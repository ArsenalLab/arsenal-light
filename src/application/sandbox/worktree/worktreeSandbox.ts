/**
 * Start a long-lived sandbox against an existing worktree, and run its
 * `onSandboxReady` hooks — the steps `createSandbox()` and
 * `createSandboxFromWorktree()` share.
 *
 * This is deliberately separate from `SandboxFactory.ts`'s
 * `acquireSandbox`/`startSandboxAgainstTarget`: those are scoped to one
 * `Effect.acquireUseRelease` callback, while a `Sandbox` handle outlives a
 * single call and can run many times. That long-lived handle is a
 * deliberate, documented gap: it is still not built on
 * `acquireSandbox`/`releaseSandbox` directly, because no caller has yet
 * needed the two to share lifecycle machinery.
 */

import { Effect } from "effect";
import type {
  SandboxHandle,
  SandboxProvider,
} from "../../../spi/SandboxProvider.js";
import { mergeProviderEnv } from "../mergeProviderEnv.js";
import type { HostProcess } from "../../../ports/HostProcess.js";
import type { SandboxHooks } from "../../../ports/lifecycleConfig.js";
import { execOk, type SandboxOps } from "../../../ports/SandboxOps.js";
import { resolveEnv } from "../lifecycle/EnvResolver.js";
import { HOOK_TIMEOUT_MS, runHostHooks } from "../lifecycle/hooks.js";
import { launchSandboxHandle } from "../lifecycle/launchSandboxHandle.js";
import { SANDBOX_REPO_DIR } from "../mounts/mountUtils.js";
import { resolveAndPatchGitMounts } from "../lifecycle/SandboxFactory.js";
import { shellQuote } from "../../../utils/shellQuote.js";
import { HookTimeoutError, withTimeout } from "../../../errors/errors.js";

export interface WorktreeSandbox {
  /** The provider's handle, or `undefined` for a test-mode sandbox. */
  readonly providerHandle: SandboxHandle | undefined;
  readonly sandbox: SandboxOps;
  /** Absolute path to the repo inside the sandbox. */
  readonly sandboxRepoDir: string;
}

export interface StartWorktreeSandboxOptions {
  readonly provider: SandboxProvider;
  readonly hostRepoDir: string;
  readonly worktreePath: string;
  /** Paths isolated providers copy in alongside sync-in. */
  readonly copyToWorktree?: string[];
  /** Test-only: build an in-process sandbox instead of starting the provider. */
  readonly buildTestSandbox?: (sandboxDir: string) => SandboxOps;
}

/**
 * Start the provider's sandbox against `worktreePath`, branching on provider
 * category: isolated providers sync the worktree in, no-sandbox runs against
 * it directly, and bind-mount providers mount it plus its git metadata.
 */
export const startWorktreeSandbox = (options: StartWorktreeSandboxOptions) =>
  Effect.gen(function* () {
    const { provider, hostRepoDir, worktreePath } = options;

    if (options.buildTestSandbox) {
      return {
        providerHandle: undefined,
        sandbox: options.buildTestSandbox(worktreePath),
        sandboxRepoDir: worktreePath,
      } satisfies WorktreeSandbox;
    }

    const resolvedEnv = yield* resolveEnv(hostRepoDir);
    const env = mergeProviderEnv({
      resolvedEnv,
      agentProviderEnv: {},
      sandboxProviderEnv: provider.env,
    });

    const started =
      provider.tag === "isolated"
        ? yield* launchSandboxHandle({
            provider,
            hostRepoDir: worktreePath,
            env,
            copyPaths: options.copyToWorktree,
          })
        : provider.tag === "none"
          ? yield* launchSandboxHandle({
              provider,
              hostRepoDir,
              env,
              worktreeOrRepoPath: worktreePath,
            })
          : // A failure to resolve git mounts must fail the sandbox start, not
            // silently start it with no git mounts at all.
            yield* resolveAndPatchGitMounts(hostRepoDir, worktreePath).pipe(
              Effect.flatMap((gitMounts) =>
                launchSandboxHandle({
                  provider,
                  hostRepoDir,
                  env,
                  worktreeOrRepoPath: worktreePath,
                  gitMounts,
                  repoDir: SANDBOX_REPO_DIR,
                }),
              ),
            );

    return {
      providerHandle: started.handle,
      sandbox: started.sandbox,
      sandboxRepoDir: started.worktreePath,
    } satisfies WorktreeSandbox;
  });

/**
 * Run `onSandboxReady` hooks — sandbox-side and host-side in parallel — after
 * marking the sandbox repo as a git `safe.directory`. A no-op when neither
 * side has hooks.
 */
export const runSandboxReadyHooks = (
  { sandbox, sandboxRepoDir }: WorktreeSandbox,
  worktreePath: string,
  hooks: SandboxHooks | undefined,
): Effect.Effect<void, unknown, HostProcess> =>
  Effect.gen(function* () {
    const sandboxOnReady = hooks?.sandbox?.onSandboxReady ?? [];
    const hostOnReady = hooks?.host?.onSandboxReady ?? [];
    if (sandboxOnReady.length === 0 && hostOnReady.length === 0) return;

    // execOk (not a bare exec) so a non-zero exit here — e.g. safe.directory
    // rejected, or a ready hook failing — actually fails setup instead of
    // silently letting createSandbox proceed. The path is shell-quoted since
    // it can contain arbitrary characters (worktree names derive from
    // user-supplied branch names).
    yield* execOk(
      sandbox,
      `git config --global --add safe.directory ${shellQuote(sandboxRepoDir)}`,
    );
    const effects: Effect.Effect<unknown, unknown, HostProcess>[] =
      sandboxOnReady.map((hook) => {
        const timeout = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
        return execOk(sandbox, hook.command, {
          cwd: sandboxRepoDir,
          sudo: hook.sudo,
        }).pipe(
          withTimeout(
            timeout,
            () =>
              new HookTimeoutError({
                message: `Hook '${hook.command}' timed out after ${timeout}ms`,
                timeoutMs: timeout,
                command: hook.command,
              }),
          ),
        );
      });
    if (hostOnReady.length > 0) {
      effects.push(runHostHooks(hostOnReady, worktreePath));
    }
    yield* Effect.all(effects, { concurrency: "unbounded" });
  });
