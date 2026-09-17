/**
 * SandboxFactory — the Context.Tag service for acquiring/releasing a live
 * sandbox tied to a worktree (`acquireSandbox`/`releaseSandbox`/`withSandbox`).
 * Implemented by `WorktreeDockerSandboxFactory`, below.
 *
 * The user-facing alert/error-attachment helpers this file's cleanup paths
 * use (`alertWorktreePreserved`, `alertSyncOutRecovery`, `attachPreservedPath`)
 * live in `./sandboxAlerts.js` — `composition/createSandbox.ts` and
 * `createWorktree.ts` need those same three leaf functions for their own
 * close()/error-path cleanup without depending on this file's much larger
 * acquire/release orchestration.
 *
 * See `spi/SandboxProvider.ts`'s `Sandbox*` glossary for how this relates to
 * `SandboxProvider`, `SandboxHandle`, `SandboxOps`, `SandboxCommands`, and
 * `SandboxLifecycle`.
 */

import { Context, Effect, Exit, Layer } from "effect";
import { FileSystem } from "@effect/platform";
import { join } from "node:path";
import type { PlatformError } from "@effect/platform/Error";
import {
  ExecError,
  SyncError,
  WorktreeError,
  type DockerError,
  type SandboxError,
} from "../../../errors/errors.js";
import * as WorktreeManager from "../worktree/WorktreeManager.js";
import { copyToWorktree } from "../worktree/CopyToWorktree.js";
import { Display } from "../../../ports/Display.js";
import { HostProcess } from "../../../ports/HostProcess.js";
import type {
  SandboxProvider,
  BranchStrategy,
  SandboxHandle,
} from "../../../spi/SandboxProvider.js";
import { runHostHooks } from "./hooks.js";
import type { SandboxHooks, Timeouts } from "../../../ports/lifecycleConfig.js";
import {
  makeSandboxFromHandle,
  type SandboxOps,
} from "../../../ports/SandboxOps.js";
import { launchSandboxHandle } from "./launchSandboxHandle.js";
import { syncOut } from "../../sync/syncOut.js";
import {
  patchGitMountsForWindows,
  parseGitdirPath,
  SANDBOX_REPO_DIR,
  type MountEntry,
} from "../mounts/mountUtils.js";
import {
  alertSyncOutRecovery,
  alertWorktreePreserved,
  attachPreservedPath,
} from "./sandboxAlerts.js";

/**
 * Exhaustiveness check for a `switch` over a closed union — calling this in
 * the `default` arm makes TypeScript flag any unhandled case at the call
 * site (a compile error, not a silent fallthrough) if the union ever grows.
 */
const assertNever = (x: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
};

export interface SandboxInfo {
  /** Host-side path to the worktree directory (worktree/branch mode only). */
  readonly hostWorktreePath?: string;
  /** Absolute path to the worktree inside the sandbox, as reported by the provider. */
  readonly sandboxRepoPath: string;
  /** Sync changes from the sandbox to the host worktree (isolated providers only). */
  readonly applyToHost?: () => Effect.Effect<void, SyncError>;
}

export interface WithSandboxResult<A> {
  readonly value: A;
  /** Host path to the preserved worktree, set when the worktree was left behind due to uncommitted changes. */
  readonly preservedWorktreePath?: string;
}

export class SandboxFactory extends Context.Tag("SandboxFactory")<
  SandboxFactory,
  {
    readonly withSandbox: <A, E, R>(
      makeEffect: (
        info: SandboxInfo,
        sandbox: SandboxOps,
      ) => Effect.Effect<A, E, R>,
    ) => Effect.Effect<WithSandboxResult<A>, E | SandboxError, R>;
  }
>() {}

export class SandboxConfig extends Context.Tag("SandboxConfig")<
  SandboxConfig,
  {
    readonly env: Record<string, string>;
    readonly hostRepoDir: string;
    /** Paths relative to the host repo root to copy into the worktree before sandbox start. */
    readonly copyToWorktree?: string[];
    /** When specified, the run name is included in the auto-generated branch and worktree names. */
    readonly name?: string;
    /** Sandbox provider — delegates sandbox lifecycle to the provider. */
    readonly sandboxProvider: SandboxProvider;
    /** Branch strategy — controls how the agent's changes relate to branches. */
    readonly branchStrategy: BranchStrategy;
    /** Lifecycle hooks grouped by execution location (host or sandbox). */
    readonly hooks?: SandboxHooks;
    /** AbortSignal threaded to lifecycle hooks so they can cooperatively cancel. */
    readonly signal?: AbortSignal;
    /** Override default timeouts for built-in lifecycle steps. */
    readonly timeouts?: Timeouts;
  }
>() {}

/**
 * Check for uncommitted changes and either preserve or remove the worktree.
 * Returns the preserved path if preserved, undefined if removed.
 */
const cleanupWorktree = (
  worktreePath: string,
  exit: Exit.Exit<unknown, unknown>,
): Effect.Effect<string | undefined, WorktreeError, Display | HostProcess> =>
  Effect.gen(function* () {
    const isDirty = yield* WorktreeManager.hasUncommittedChanges(
      worktreePath,
    ).pipe(Effect.catchAll(() => Effect.succeed(false)));
    if (isDirty) {
      yield* alertWorktreePreserved(
        worktreePath,
        Exit.isSuccess(exit)
          ? `Run succeeded but worktree has uncommitted changes at ${worktreePath}`
          : `Worktree preserved at ${worktreePath}`,
      );
      return worktreePath;
    }
    if (!Exit.isSuccess(exit)) {
      const display = yield* Display;
      yield* display.alert(`\nWorktree removed (no uncommitted changes)`);
    }
    yield* WorktreeManager.remove(worktreePath);
    return undefined;
  });

/**
 * Resolves the git-related mounts needed for the sandbox.
 * Handles both normal repos (where .git is a directory) and worktrees
 * (where .git is a file pointing to the parent repo's .git/worktrees/<name>).
 */
export const resolveGitMounts = (
  gitPath: string,
): Effect.Effect<MountEntry[], PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const stat = yield* fs.stat(gitPath);
    if (stat.type === "Directory") {
      return [{ hostPath: gitPath, sandboxPath: gitPath }];
    }
    // Worktree: .git is a file with "gitdir: <path>"
    const content = (yield* fs.readFileString(gitPath)).trim();
    const match = content.match(/^gitdir:\s*(.+)$/);
    if (!match) {
      // Unrecognized format — fall back to mounting the file as-is
      return [{ hostPath: gitPath, sandboxPath: gitPath }];
    }
    const gitdirPath = match[1]!;
    // gitdirPath is like /path/to/repo/.git/worktrees/<name> — reuse
    // parseGitdirPath (mountUtils.ts) rather than re-deriving parentGitDir
    // here, so there's one platform-aware (handles both `/` and `\`)
    // implementation of this parsing instead of two that can drift.
    const { parentGitDir } = parseGitdirPath(gitdirPath);
    return [
      { hostPath: gitPath, sandboxPath: gitPath },
      { hostPath: parentGitDir, sandboxPath: parentGitDir },
    ];
  });

/**
 * Resolve `hostRepoDir`'s git mounts and patch them for Windows worktree
 * compatibility (see `mountUtils.ts`'s Windows git-mount patch) against
 * `targetPath`. This is the bind-mount-provider setup step shared by
 * `startSandboxAgainstTarget` (below) and `worktreeSandbox.ts`'s
 * `startWorktreeSandbox` (used by both `createSandbox()` and
 * `createSandboxFromWorktree()`).
 * Leaves `FileSystem.FileSystem` in the requirement channel rather than
 * providing it, so each call site keeps satisfying it its own way (ambient
 * `Effect.gen` context vs. an explicit `Effect.provide`).
 */
export const resolveAndPatchGitMounts = (
  hostRepoDir: string,
  targetPath: string,
): Effect.Effect<MountEntry[], WorktreeError, FileSystem.FileSystem> =>
  resolveGitMounts(join(hostRepoDir, ".git")).pipe(
    Effect.mapError(
      (e) =>
        new WorktreeError({
          message: `Failed to resolve git mounts: ${e}`,
        }),
    ),
    Effect.flatMap((gitMounts) =>
      patchGitMountsForWindows(gitMounts, targetPath, SANDBOX_REPO_DIR),
    ),
  );

// ---------------------------------------------------------------------------
// acquireSandbox / releaseSandbox — the setup/teardown primitives underneath
// withSandbox, factored out so a caller that needs a sandbox to outlive a
// single scoped callback (createSandbox(), createWorktree()) can call
// acquireSandbox() once, use the result across many operations, and call
// releaseSandbox() only at the point it actually wants to tear down —
// instead of hand-rolling this same acquire sequence at each call site.
// ---------------------------------------------------------------------------

export interface AcquireSandboxOptions {
  readonly env: Record<string, string>;
  readonly hostRepoDir: string;
  /** Paths relative to the host repo root to copy into the worktree before sandbox start. */
  readonly copyToWorktree?: string[];
  /** When specified, the run name is included in the auto-generated branch and worktree names. */
  readonly name?: string;
  readonly sandboxProvider: SandboxProvider;
  readonly branchStrategy: BranchStrategy;
  readonly hooks?: SandboxHooks;
  readonly signal?: AbortSignal;
  readonly timeouts?: Timeouts;
  /**
   * Skip the best-effort stale-worktree prune (default `false`). Set by
   * `withSandbox` on every call after its first within the same run — the
   * worktree set under `.arsenal/worktrees/` doesn't meaningfully change
   * between iterations of one `orchestrate()` call, so re-pruning (2 `git`
   * subprocess spawns + a directory scan) on every iteration is redundant
   * work. Direct `acquireSandbox` callers (`createSandbox()`,
   * `createWorktree()`) leave this unset and still prune on every call.
   */
  readonly skipPrune?: boolean;
}

export interface AcquiredSandbox {
  readonly sandboxInfo: SandboxInfo;
  readonly sandbox: SandboxOps;
  readonly handle: SandboxHandle;
  /**
   * Present only when this acquisition created or reused a worktree — i.e.
   * every branch strategy except `head`. `releaseSandbox` uses this to
   * decide whether there's a worktree to preserve-or-remove at all.
   */
  readonly worktreeInfo: WorktreeManager.WorktreeInfo | undefined;
}

export interface StartSandboxAgainstTargetOptions {
  readonly env: Record<string, string>;
  readonly hostRepoDir: string;
  /** Where the code actually lives: `hostRepoDir` itself for head mode, a worktree's path otherwise. */
  readonly targetPath: string;
  /** Paths relative to the host repo root to copy into `targetPath` before sandbox start. Omit for head mode (nothing to copy) or when the target already has everything it needs (e.g. an existing worktree, reused across multiple sandbox starts). */
  readonly copyToWorktree?: string[];
  readonly sandboxProvider: SandboxProvider;
  readonly hooks?: SandboxHooks;
  readonly signal?: AbortSignal;
  readonly timeouts?: Timeouts;
}

/**
 * Start a sandbox against an existing target directory — no worktree
 * creation. Copies paths (if any), runs onWorktreeReady hooks, resolves and
 * patches git mounts, and starts the sandbox. This is the piece of
 * `acquireSandbox` that stays the same whether the worktree was just
 * created for this one acquisition or already existed independently of it
 * (a `Worktree` from `createWorktree()`, handed to many `.run()` calls over
 * its lifetime) — exported standalone so a caller in the second situation
 * isn't stuck re-deriving the same per-provider-category branching
 * `acquireSandbox` already has.
 */
export const startSandboxAgainstTarget = (
  options: StartSandboxAgainstTargetOptions,
): Effect.Effect<
  Omit<AcquiredSandbox, "worktreeInfo">,
  SandboxError,
  FileSystem.FileSystem | Display | HostProcess
> =>
  Effect.gen(function* () {
    const {
      env,
      hostRepoDir,
      targetPath,
      copyToWorktree: copyPaths,
      sandboxProvider,
      hooks,
      signal,
      timeouts,
    } = options;
    const display = yield* Display;
    const host = yield* HostProcess;

    const runOnWorktreeReady = () =>
      hooks?.host?.onWorktreeReady?.length
        ? runHostHooks(hooks.host.onWorktreeReady, targetPath, signal)
        : Effect.void;

    const runCopyToWorktree = () =>
      copyPaths && copyPaths.length > 0
        ? display.spinner(
            "Copying to worktree",
            copyToWorktree(
              copyPaths,
              hostRepoDir,
              targetPath,
              timeouts?.copyToWorktreeMs,
            ),
          )
        : Effect.succeed(undefined);

    // Exhaustive dispatch on provider category — a switch with an
    // `assertNever` default, not the previous if/if/fallthrough-with-cast,
    // so a fourth `SandboxProvider` tag is a compile error at the default
    // arm below instead of silently landing in the bind-mount branch.
    switch (sandboxProvider.tag) {
      // No-sandbox providers: run directly on the host, no container or mounts.
      case "none": {
        yield* runCopyToWorktree();
        yield* runOnWorktreeReady();
        const { sandbox, worktreePath, handle } = yield* launchSandboxHandle({
          provider: sandboxProvider,
          hostRepoDir,
          env,
          worktreeOrRepoPath: targetPath,
        });
        return {
          sandboxInfo: {
            hostWorktreePath: targetPath,
            sandboxRepoPath: worktreePath,
          },
          sandbox,
          handle,
        };
      }

      // Isolated providers sync via git bundle. Note `copyPaths` is threaded
      // into `launchSandboxHandle` here (not applied via `runCopyToWorktree`) —
      // isolated providers copy the whole target into the sandbox via
      // sync-in, so extra paths ride along with that same transfer rather
      // than a separate host-side step.
      case "isolated": {
        yield* runOnWorktreeReady();
        const { sandbox, worktreePath, handle } = yield* launchSandboxHandle({
          provider: sandboxProvider,
          hostRepoDir: targetPath,
          env,
          copyPaths,
        });
        return {
          sandboxInfo: {
            hostWorktreePath: targetPath,
            sandboxRepoPath: worktreePath,
            applyToHost: () =>
              syncOut(targetPath, handle).pipe(
                Effect.flatMap(alertSyncOutRecovery),
                Effect.provideService(Display, display),
                Effect.provideService(HostProcess, host),
              ),
          },
          sandbox,
          handle,
        };
      }

      // Bind-mount provider.
      case "bind-mount": {
        yield* runCopyToWorktree();
        yield* runOnWorktreeReady();
        const gitMounts = yield* resolveAndPatchGitMounts(
          hostRepoDir,
          targetPath,
        );
        const { sandbox, worktreePath, handle } = yield* launchSandboxHandle({
          provider: sandboxProvider,
          hostRepoDir,
          env,
          worktreeOrRepoPath: targetPath,
          gitMounts,
          repoDir: SANDBOX_REPO_DIR,
        });
        return {
          sandboxInfo: {
            hostWorktreePath: targetPath,
            sandboxRepoPath: worktreePath,
          },
          sandbox,
          handle,
        };
      }

      default:
        return assertNever(sandboxProvider);
    }
  });

/**
 * Acquire a live sandbox: prune stale worktrees, create or reuse one if the
 * branch strategy needs it, then `startSandboxAgainstTarget` against it (or
 * against `hostRepoDir` directly, for head mode). Schedules no release — if
 * a step after worktree creation fails, the worktree this function itself
 * created is still cleaned up (preserved-if-dirty) before the failure
 * propagates, but a *successful* return hands the whole lifecycle —
 * including the worktree — to the caller. Pair with `releaseSandbox`.
 */
export const acquireSandbox = (
  options: AcquireSandboxOptions,
): Effect.Effect<
  AcquiredSandbox,
  SandboxError,
  FileSystem.FileSystem | Display | HostProcess
> =>
  Effect.gen(function* () {
    const {
      env,
      hostRepoDir,
      copyToWorktree,
      name,
      sandboxProvider,
      branchStrategy,
      hooks,
      signal,
      timeouts,
      skipPrune,
    } = options;

    const isHeadMode = branchStrategy.type === "head";
    const branch =
      branchStrategy.type === "branch" ? branchStrategy.branch : undefined;
    const baseBranch =
      branchStrategy.type === "branch" ? branchStrategy.baseBranch : undefined;
    const fileSystem = yield* FileSystem.FileSystem;
    const display = yield* Display;
    const host = yield* HostProcess;

    const startAgainst = (targetPath: string) =>
      provideAcquireDepsLocal(
        startSandboxAgainstTarget({
          env,
          hostRepoDir,
          targetPath,
          copyToWorktree,
          sandboxProvider,
          hooks,
          signal,
          timeouts,
        }),
      );

    // Satisfy startSandboxAgainstTarget's own Display | FileSystem
    // requirement from the values already resolved above, the same way the
    // Layer-construction call site does for acquireSandbox itself.
    function provideAcquireDepsLocal<A2, E2>(
      effect: Effect.Effect<
        A2,
        E2,
        Display | FileSystem.FileSystem | HostProcess
      >,
    ): Effect.Effect<A2, E2> {
      return effect.pipe(
        Effect.provideService(Display, display),
        Effect.provideService(FileSystem.FileSystem, fileSystem),
        Effect.provideService(HostProcess, host),
      );
    }

    if (isHeadMode) {
      const { sandboxInfo, sandbox, handle } = yield* startAgainst(hostRepoDir);
      return { sandboxInfo, sandbox, handle, worktreeInfo: undefined };
    }

    /** Prune stale worktrees (best-effort, unless `skipPrune`), then create a fresh one. */
    const pruneAndCreate = () => {
      const create = branch
        ? WorktreeManager.create(hostRepoDir, { branch, baseBranch })
        : WorktreeManager.create(hostRepoDir, { name });
      const prune = skipPrune
        ? Effect.void
        : WorktreeManager.pruneStale(hostRepoDir).pipe(
            Effect.catchAll((e) =>
              Effect.flatMap(Display, (display) =>
                display.alert(
                  `[arsenal] Warning: failed to prune stale worktrees: ${e.message}`,
                ),
              ),
            ),
          );
      return prune.pipe(
        Effect.andThen(create),
        Effect.provideService(FileSystem.FileSystem, fileSystem),
      );
    };

    // Create/reuse a worktree, then start a sandbox against it. If startup
    // fails, the worktree is cleaned up (preserved-if-dirty, with the same
    // message/attachPreservedPath handling `withSandbox` always gave a
    // mid-setup failure) before the failure propagates. If it succeeds, the
    // worktree's lifecycle passes to the caller untouched — this function
    // does not remove or preserve it on the success path.
    let preservedPath: string | undefined;
    return yield* Effect.acquireUseRelease(
      pruneAndCreate(),
      (worktreeInfo) =>
        startAgainst(worktreeInfo.path).pipe(
          Effect.map(({ sandboxInfo, sandbox, handle }) => ({
            sandboxInfo,
            sandbox,
            handle,
            worktreeInfo,
          })),
        ),
      (worktreeInfo, exit) =>
        Exit.isSuccess(exit)
          ? Effect.void
          : cleanupWorktree(worktreeInfo.path, exit).pipe(
              Effect.tap((p) => {
                preservedPath = p;
              }),
              Effect.asVoid,
              Effect.orDie,
            ),
    ).pipe(
      Effect.mapError((e: SandboxError) =>
        attachPreservedPath(preservedPath, e),
      ),
    );
  });

/**
 * Release a sandbox acquired via `acquireSandbox`: close the handle, then —
 * if this acquisition owns a worktree — preserve it (with the same message
 * `withSandbox` always printed) if it has uncommitted changes, otherwise
 * remove it. Returns the preserved path, if any.
 *
 * `exit` is the outcome of whatever work the caller did with the acquired
 * sandbox, if there's a meaningful one to report — `withSandbox` passes the
 * real exit of `makeEffect` through so `cleanupWorktree`'s messaging
 * distinguishes "worktree preserved after a failure" from "run succeeded
 * but left uncommitted changes". A caller with no single "did the run
 * succeed" moment (an explicit `.close()` on a long-lived, possibly
 * multi-run sandbox) can omit it — defaults to a successful exit.
 */
export const releaseSandbox = (
  acquired: AcquiredSandbox,
  exit: Exit.Exit<unknown, unknown> = Exit.succeed(undefined),
): Effect.Effect<
  { readonly preservedWorktreePath?: string },
  never,
  Display | HostProcess
> =>
  Effect.gen(function* () {
    yield* Effect.tryPromise({
      try: () => acquired.handle.close(),
      catch: () => undefined,
    }).pipe(Effect.orDie);

    if (!acquired.worktreeInfo) {
      return { preservedWorktreePath: undefined };
    }

    const preservedWorktreePath = yield* cleanupWorktree(
      acquired.worktreeInfo.path,
      exit,
    ).pipe(Effect.orDie);
    return { preservedWorktreePath };
  });

/**
 * The `SandboxFactory` implementation. Despite the name (kept from when
 * Arsenal only supported Docker), this works with any `SandboxProvider` —
 * `noSandbox()`, a custom bind-mount/isolated provider, or a real Docker/
 * Podman one someone builds with `createBindMountSandboxProvider`/
 * `createIsolatedSandboxProvider`.
 */
export const WorktreeDockerSandboxFactory = {
  layer: Layer.effect(
    SandboxFactory,
    Effect.gen(function* () {
      const config = yield* SandboxConfig;
      // Resolved once here (matching the pre-extraction layer's own
      // behavior) so withSandbox's returned Effect doesn't leak
      // acquireSandbox's Display | FileSystem.FileSystem requirement into
      // its R channel — the interface promises exactly the caller's own R.
      const display = yield* Display;
      const fileSystem = yield* FileSystem.FileSystem;
      const host = yield* HostProcess;
      const provideAcquireDeps = <A2, E2>(
        effect: Effect.Effect<
          A2,
          E2,
          Display | FileSystem.FileSystem | HostProcess
        >,
      ): Effect.Effect<A2, E2> =>
        effect.pipe(
          Effect.provideService(Display, display),
          Effect.provideService(FileSystem.FileSystem, fileSystem),
          Effect.provideService(HostProcess, host),
        );

      // Tracks whether this factory has already pruned stale worktrees once.
      // `withSandbox` is called once per iteration in a multi-iteration
      // orchestrate() run, all sharing this same factory instance/layer —
      // pruning is best-effort cleanup of *other* stale worktrees, so
      // re-running it on every iteration of the same run just repeats work
      // against a worktree set that hasn't meaningfully changed.
      let prunedOnce = false;

      return {
        withSandbox: <A, E, R>(
          makeEffect: (
            info: SandboxInfo,
            sandbox: SandboxOps,
          ) => Effect.Effect<A, E, R>,
        ): Effect.Effect<WithSandboxResult<A>, E | SandboxError, R> => {
          let preservedPath: string | undefined;
          const skipPrune = prunedOnce;
          prunedOnce = true;
          return Effect.acquireUseRelease(
            provideAcquireDeps(acquireSandbox({ ...config, skipPrune })),
            (acquired) =>
              makeEffect(
                acquired.sandboxInfo,
                acquired.sandbox,
              ) as Effect.Effect<A, E | SandboxError, R>,
            (acquired, exit) =>
              provideAcquireDeps(releaseSandbox(acquired, exit)).pipe(
                Effect.tap(({ preservedWorktreePath }) => {
                  preservedPath = preservedWorktreePath;
                }),
                Effect.asVoid,
              ),
          ).pipe(
            Effect.map((value) => ({
              value,
              preservedWorktreePath: preservedPath,
            })),
            Effect.mapError((e: E | SandboxError) =>
              attachPreservedPath(preservedPath, e),
            ),
          );
        },
      };
    }),
  ),
};
