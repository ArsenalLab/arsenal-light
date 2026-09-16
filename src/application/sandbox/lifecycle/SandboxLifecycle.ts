/**
 * SandboxLifecycle — orchestrates git setup, hooks, and commit collection
 * around one sandbox, once `SandboxFactory` has produced it.
 *
 * See `spi/SandboxProvider.ts`'s `Sandbox*` glossary for how this relates to
 * `SandboxProvider`, `SandboxHandle`, `SandboxOps`, `SandboxCommands`, and
 * `SandboxFactory`.
 */

import { Duration, Effect, Schedule } from "effect";
import { Display } from "../../../ports/Display.js";
import { HostProcess } from "../../../ports/HostProcess.js";
import {
  CommitCollectionTimeoutError,
  ExecError,
  GitSetupTimeoutError,
  HookTimeoutError,
  MergeToHostTimeoutError,
  SyncError,
  withTimeout,
  type SandboxError,
} from "../../../errors/errors.js";
import { GitClient, LocalGitClient } from "../../git/GitClient.js";
import {
  execOk,
  type ExecResult,
  type SandboxOps,
} from "../../../ports/SandboxOps.js";
import type { SandboxHooks, Timeouts } from "../../../ports/lifecycleConfig.js";
import { HOOK_TIMEOUT_MS, runSandboxHooksWithAbort } from "./hooks.js";
import { countCommitsToSync } from "../../sync/syncOut.js";

const GIT_SETUP_TIMEOUT_MS = 10_000;
const COMMIT_COLLECTION_TIMEOUT_MS = 30_000;
const MERGE_TO_HOST_TIMEOUT_MS = 30_000;

/**
 * Number of times a transient git setup exec is retried after the first
 * attempt, and the backoff between attempts. A fixed 2 retries @ 250ms
 * (the original values) was tuned for a single container's overlayfs/exec
 * races, not for the stampede a shared-$HOME host sees when ~150 sandbox
 * sessions all fight over the same `~/.gitconfig` lock at once — that
 * exhausted the budget in production even after the lock-contention pattern
 * below started being retried at all. Exponential backoff with jitter
 * spreads a stampede out instead of every loser retrying in lockstep; worst
 * case (a repo unlucky 8 times running) adds ~20s, trivial next to an
 * agent run that fails outright and needs a full manual re-run otherwise.
 */
const GIT_SETUP_MAX_RETRIES = 8;
const GIT_SETUP_RETRY_SCHEDULE = Schedule.exponential(
  Duration.millis(150),
  1.8,
).pipe(Schedule.jittered);

/**
 * Exit codes that indicate the shell could not exec the command rather than the
 * command itself failing — symptoms of a transient race under heavy container
 * load (e.g. overlayfs not yet ready, or the process being killed). Worth a retry.
 * 126: command found but not executable / exec failed. 137: killed (128 + SIGKILL).
 */
const TRANSIENT_EXEC_EXIT_CODES = new Set([126, 137]);

/**
 * Git prints this when `git config --global` loses the race for the config
 * file's advisory lock. Under `no-sandbox`, every sandbox session shares the
 * same real `$HOME` (unlike the old docker/podman sandboxes, which each got
 * an isolated one), so many sessions
 * setting up concurrently all write `~/.gitconfig` at once and collide on its
 * lock file. The lock is only ever held for the few milliseconds of a single
 * `git config` call, so this is worth a retry.
 */
const GIT_LOCK_CONTENTION_PATTERN = /could not lock config file/i;

const isTransientExecError = (err: ExecError | GitSetupTimeoutError): boolean =>
  err._tag === "ExecError" &&
  ((err.exitCode !== undefined &&
    TRANSIENT_EXEC_EXIT_CODES.has(err.exitCode)) ||
    GIT_LOCK_CONTENTION_PATTERN.test(err.message));

const execOkWithGitTimeout = (
  sandbox: SandboxOps,
  command: string,
  gitSetupTimeoutMs: number,
  options?: { cwd?: string },
): Effect.Effect<ExecResult, ExecError | GitSetupTimeoutError> =>
  execOk(sandbox, command, options).pipe(
    withTimeout(
      gitSetupTimeoutMs,
      () =>
        new GitSetupTimeoutError({
          message: `Git command timed out after ${gitSetupTimeoutMs}ms: ${command}`,
          timeoutMs: gitSetupTimeoutMs,
          command,
        }),
    ),
    // Each attempt is bounded by its own timeout (above); retry only transient
    // exec races, so a genuine git error or a hung exec still fails fast.
    Effect.retry({
      while: isTransientExecError,
      times: GIT_SETUP_MAX_RETRIES,
      schedule: GIT_SETUP_RETRY_SCHEDULE,
    }),
  );

/**
 * Marker a batched-and-guarded shell step (see the identity/branch setup
 * command below) echoes to stderr on failure, so a batch of several `&&`-ed
 * git commands run as one exec can still report exactly which one failed
 * instead of only the combined command string.
 */
const IDENTITY_STEP_FAILED_MARKER = "__arsenal_step_failed__";

/**
 * Rewrite an `ExecError` from a batched, marker-guarded command (built by
 * joining `${command} || { echo "${IDENTITY_STEP_FAILED_MARKER}:<label>" >&2; exit 1; }`
 * steps with `&&`) so its `command`/`message` name the specific step that
 * failed, rather than the whole batch. Passes non-`ExecError` failures (e.g.
 * `GitSetupTimeoutError`) and unrecognized errors through unchanged.
 */
const identifyFailedStep = (
  err: ExecError | GitSetupTimeoutError,
  steps: ReadonlyArray<{ label: string; command: string }>,
): ExecError | GitSetupTimeoutError => {
  if (err._tag !== "ExecError") return err;
  const match = new RegExp(`${IDENTITY_STEP_FAILED_MARKER}:(\\S+)`).exec(
    err.message,
  );
  const failedStep = match && steps.find((step) => step.label === match[1]);
  if (!failedStep) return err;
  return new ExecError({
    command: failedStep.command,
    exitCode: err.exitCode,
    message: `Git identity/branch setup failed at step '${failedStep.label}': ${failedStep.command}\n${err.message}`,
  });
};

export interface SandboxLifecycleOptions {
  readonly hostRepoDir: string;
  readonly sandboxRepoDir: string;
  readonly hooks?: SandboxHooks;
  readonly branch?: string;
  /** Host-side path to the worktree directory. Required when sandboxRepoDir
   *  is a sandbox path that doesn't exist on the host (e.g. /home/agent/workspace). */
  readonly hostWorktreePath?: string;
  /** Called after agent work completes but before host-side git operations (merge, commit collection).
   *  For isolated providers, this syncs changes from the sandbox to the host worktree.
   *  For bind-mount providers, this is a no-op (filesystem is already shared). */
  readonly applyToHost?: () => Effect.Effect<void, SyncError>;
  /** AbortSignal passed through to lifecycle hooks so they can cooperatively cancel.
   *  When omitted, hooks receive a never-aborted signal. */
  readonly signal?: AbortSignal;
  /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
  readonly timeouts?: Timeouts;
  /** When true (used by `createWorktree`'s merge-to-head path), skip the post-merge
   *  detach-and-delete of the source branch so the worktree handle stays usable for
   *  subsequent `wt.runAgent()` calls. */
  readonly keepSourceBranch?: boolean;
}

export interface SandboxContext {
  readonly sandbox: SandboxOps;
  readonly sandboxRepoDir: string;
  readonly baseHead: string;
}

export interface SandboxLifecycleResult<A> {
  readonly result: A;
  readonly branch: string;
  readonly commits: { sha: string }[];
}

/**
 * `GitClient`-parameterized implementation — genuinely requires `GitClient`
 * rather than hardcoding host git operations. Exported (rather than kept
 * private) so callers — and tests — can provide a different `GitClient`
 * layer; `withSandboxLifecycle` below is the common case, providing
 * `LocalGitClient` by default so every existing caller is unaffected.
 */
export const withSandboxLifecycleImpl = <A>(
  options: SandboxLifecycleOptions,
  sandbox: SandboxOps,
  work: (ctx: SandboxContext) => Effect.Effect<A, SandboxError, Display>,
): Effect.Effect<
  SandboxLifecycleResult<A>,
  SandboxError,
  Display | GitClient | HostProcess
> =>
  Effect.gen(function* () {
    const display = yield* Display;
    const gitClient = yield* GitClient;
    const host = yield* HostProcess;
    const { hostRepoDir, sandboxRepoDir, hooks, branch, hostWorktreePath } =
      options;

    // Resolve effective timeouts, falling back to the built-in defaults.
    const gitSetupTimeoutMs =
      options.timeouts?.gitSetupMs ?? GIT_SETUP_TIMEOUT_MS;
    const commitCollectionTimeoutMs =
      options.timeouts?.commitCollectionMs ?? COMMIT_COLLECTION_TIMEOUT_MS;
    const mergeToHostTimeoutMs =
      options.timeouts?.mergeToHostMs ?? MERGE_TO_HOST_TIMEOUT_MS;

    // Resolve signal: use caller's signal or a never-aborted one so hooks
    // can unconditionally reference it without null-checking.
    const signal = options.signal ?? new AbortController().signal;

    // Without an explicit branch, record host's current branch so the temp
    // branch can be merged back into it later.
    const hostCurrentBranch: string | null = !branch
      ? yield* gitClient.currentBranch(hostRepoDir)
      : null;

    // Read host git identity before entering the sandbox
    const { name: hostGitName, email: hostGitEmail } =
      yield* gitClient.identity(hostRepoDir);

    // For host-side operations, use hostWorktreePath (the real path on the host)
    // instead of sandboxRepoDir (which may be a sandbox path like /home/agent/workspace).
    const hostSideWorktreePath = hostWorktreePath ?? sandboxRepoDir;

    // Setup: onSandboxReady hooks.
    let resolvedBranch = "";
    yield* display.taskLog("Setting up sandbox", (message) =>
      Effect.gen(function* () {
        // The bind-mounted worktree may be owned by a different UID (host user
        // vs sandbox user). Mark it safe so git doesn't reject it with
        // "dubious ownership".
        yield* execOkWithGitTimeout(
          sandbox,
          `git config --global --add safe.directory "${sandboxRepoDir}"`,
          gitSetupTimeoutMs,
        );

        // Propagate host git identity into the sandbox so commits are attributed
        // to the actual developer without requiring manual setup, then discover
        // the branch — batched into one exec (one process spawn instead of
        // three). Safe to retry as a unit: unlike safe.directory's `--add`
        // above, setting the same name/email twice or re-reading HEAD is
        // idempotent, so this doesn't change retry/lock-contention behavior.
        // Each step is guarded so a failure names the specific step it came
        // from (via `identityStepFailed`) instead of surfacing only the
        // combined command string.
        const identitySteps = [
          hostGitName && {
            label: "user.name",
            command: `git config --global user.name "${hostGitName.replace(/"/g, '\\"')}"`,
          },
          hostGitEmail && {
            label: "user.email",
            command: `git config --global user.email "${hostGitEmail.replace(/"/g, '\\"')}"`,
          },
          { label: "rev-parse", command: "git rev-parse --abbrev-ref HEAD" },
        ].filter((step): step is { label: string; command: string } =>
          Boolean(step),
        );
        const batchedCommand = identitySteps
          .map(
            ({ label, command }) =>
              `${command} || { echo "${IDENTITY_STEP_FAILED_MARKER}:${label}" >&2; exit 1; }`,
          )
          .join(" && ");

        resolvedBranch = (
          yield* execOkWithGitTimeout(
            sandbox,
            batchedCommand,
            gitSetupTimeoutMs,
            { cwd: sandboxRepoDir },
          ).pipe(Effect.mapError((err) => identifyFailedStep(err, identitySteps)))
        ).stdout.trim();

        // Run sandbox.onSandboxReady and host.onSandboxReady in parallel
        const sandboxHooks = hooks?.sandbox?.onSandboxReady;
        const hostOnSandboxReady = hooks?.host?.onSandboxReady;

        if (sandboxHooks?.length) {
          for (const hook of sandboxHooks) {
            message(hook.command);
          }
        }
        if (hostOnSandboxReady?.length) {
          for (const hook of hostOnSandboxReady) {
            message(`[host] ${hook.command}`);
          }
        }

        const hostHookEffects = (hostOnSandboxReady ?? []).map((hook) => {
          const timeout = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
          return host
            .shell(hook.command, { cwd: hostSideWorktreePath, signal })
            .pipe(
              Effect.mapError(
                (err) =>
                  new ExecError({
                    command: hook.command,
                    message: `Host hook failed: ${hook.command}\n${err.message}`,
                  }),
              ),
              withTimeout(
                timeout,
                () =>
                  new HookTimeoutError({
                    message: `Host hook '${hook.command}' timed out after ${timeout}ms`,
                    timeoutMs: timeout,
                    command: hook.command,
                  }),
              ),
            );
        });

        yield* Effect.all(
          [
            runSandboxHooksWithAbort(
              sandbox,
              sandboxRepoDir,
              sandboxHooks ?? [],
              signal,
            ),
            ...hostHookEffects,
          ],
          { concurrency: "unbounded" },
        );
      }),
    );

    const targetBranch = branch ?? resolvedBranch;

    // Record base HEAD from the host worktree (not the sandbox), *after* the
    // sandbox-setup step above (including host.onSandboxReady hooks) has
    // fully finished. Those hooks run on the host, at hostSideWorktreePath —
    // the same path read here — and may commit (e.g. regenerating a
    // lockfile). Reading baseHead only once they're done guarantees any such
    // commit is captured in the baseline rather than raced against and
    // potentially misattributed to the agent's own work below.
    // For bind-mount providers, sandbox and host HEAD are the same. For
    // isolated providers, the host-side SHA is the correct baseline for git
    // rev-list after applyToHost syncs commits back (syncOut creates new
    // SHAs via format-patch/am).
    const baseHead = yield* gitClient.revParseHead(hostSideWorktreePath);

    // Run the caller's work
    const result = yield* work({ sandbox, sandboxRepoDir, baseHead });

    // Sync changes from sandbox to host worktree (isolated sandbox only).
    // The count resolves the base from the same sandbox-owned ref `syncOut`
    // uses, so on run 2+ we don't anchor to the host's `am`-rewritten HEAD
    // (which the sandbox has never seen) and silently degrade to 0.
    if (options.applyToHost) {
      const commitCount = yield* countCommitsToSync(
        sandbox,
        sandboxRepoDir,
        baseHead,
      );

      yield* display.taskLog(
        commitCount > 0
          ? `Syncing ${commitCount} commit${commitCount !== 1 ? "s" : ""} to host`
          : "No commits to sync out",
        () => options.applyToHost!(),
      );
    }

    // Collect commits and handle the merge-back for temp branches
    let commits: { sha: string }[];
    let finalBranch: string;

    if (hostCurrentBranch !== null) {
      // Temp branch mode: merge temp branch into host branch, then delete temp branch.
      // We use merge instead of cherry-pick because cherry-pick breaks when the
      // temp branch contains merge commits (e.g. a merge agent merging multiple parallel
      // branches). A regular merge handles both the fast-forward case (host branch hasn't
      // moved) and the diverged case (host branch has new commits since the worktree started).

      // Check if there are any new commits on the temp branch
      const hasNewCommits = yield* gitClient.hasCommitsInRange(
        hostSideWorktreePath,
        `${baseHead}..HEAD`,
      );

      // Detach the worktree from the temp branch so the branch can be deleted.
      // Skipped when `keepSourceBranch` is set (createWorktree's merge-to-head
      // path) so the worktree stays on its source branch for re-use.
      if (!options.keepSourceBranch) {
        yield* execOk(sandbox, "git checkout --detach", {
          cwd: sandboxRepoDir,
        });
      }

      if (hasNewCommits) {
        // Fast-forward host's current branch to the temp branch
        yield* display.taskLog(`Merging to ${hostCurrentBranch}`, () =>
          gitClient
            .mergeBranch(hostRepoDir, resolvedBranch, hostCurrentBranch)
            .pipe(
              Effect.mapError((e) => new SyncError({ message: e.message })),
              withTimeout(
                mergeToHostTimeoutMs,
                () =>
                  new MergeToHostTimeoutError({
                    message: `Merge of '${resolvedBranch}' to '${hostCurrentBranch}' timed out after ${mergeToHostTimeoutMs}ms`,
                    timeoutMs: mergeToHostTimeoutMs,
                    sourceBranch: resolvedBranch,
                    targetBranch: hostCurrentBranch,
                  }),
              ),
            ),
        );
      }

      // Delete the temp branch (now merged into host branch). Skipped when
      // `keepSourceBranch` is set: the source branch is the worktree's active
      // branch and the worktree's lifetime outlives the lifecycle.
      if (!options.keepSourceBranch) {
        yield* gitClient.deleteBranch(hostRepoDir, resolvedBranch);
      }

      // Collect the commits now on the host branch
      commits = yield* display.taskLog("Collecting commits", () =>
        gitClient.revList(hostRepoDir, `${baseHead}..HEAD`).pipe(
          Effect.map((shas) => shas.map((sha) => ({ sha }))),
          withTimeout(
            commitCollectionTimeoutMs,
            () =>
              new CommitCollectionTimeoutError({
                message: `Commit collection timed out after ${commitCollectionTimeoutMs}ms`,
                timeoutMs: commitCollectionTimeoutMs,
              }),
          ),
        ),
      );

      finalBranch = hostCurrentBranch;
    } else {
      // Explicit branch: commits stay on that branch. `revList` is best-effort
      // and never fails, so a branch that doesn't exist on the host yet (no
      // commits were produced) just resolves to [].
      commits = yield* display.taskLog("Collecting commits", () =>
        gitClient
          .revList(hostRepoDir, `${baseHead}..refs/heads/${targetBranch}`)
          .pipe(
            Effect.map((shas) => shas.map((sha) => ({ sha }))),
            withTimeout(
              commitCollectionTimeoutMs,
              () =>
                new CommitCollectionTimeoutError({
                  message: `Commit collection timed out after ${commitCollectionTimeoutMs}ms`,
                  timeoutMs: commitCollectionTimeoutMs,
                }),
            ),
          ),
      );

      finalBranch = targetBranch;
    }

    return { result, branch: finalBranch, commits };
  });

/**
 * Runs the sandbox lifecycle (git identity propagation, hooks, merge/commit
 * collection) against the local host filesystem via `LocalGitClient` — the
 * default and, today, only `GitClient` implementation. Behavior is identical
 * to before this seam existed; every existing caller needs no changes.
 */
export const withSandboxLifecycle = <A>(
  options: SandboxLifecycleOptions,
  sandbox: SandboxOps,
  work: (ctx: SandboxContext) => Effect.Effect<A, SandboxError, Display>,
): Effect.Effect<
  SandboxLifecycleResult<A>,
  SandboxError,
  Display | HostProcess
> =>
  withSandboxLifecycleImpl(options, sandbox, work).pipe(
    Effect.provide(LocalGitClient),
  );
