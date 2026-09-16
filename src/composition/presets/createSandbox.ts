/**
 * `createSandbox()` and `createSandboxFromWorktree()` — build a long-lived
 * `Sandbox` handle. Types live in `./Sandbox.ts`, the handle's methods in
 * `./sandboxHandle.ts`, and the shared start/ready-hook steps in
 * `application/sandbox/worktree/worktreeSandbox.ts`.
 */

import { Effect } from "effect";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";
import type {
  MergeToHeadBranchStrategy,
  NamedBranchStrategy,
  SandboxHandle,
  SandboxProvider,
} from "../../spi/SandboxProvider.js";
import { NodeHostProcess } from "../../platform/node/NodeHostProcess.js";
import { ClackDisplay } from "../../platform/node/displays.js";
import { registerShutdown } from "../../platform/node/shutdownRegistry.js";
import { resolveCwd } from "../../utils/resolveCwd.js";
import type { SandboxHooks, Timeouts } from "../../ports/lifecycleConfig.js";
import type { SandboxOps } from "../../ports/SandboxOps.js";
import { copyToWorktree } from "../../application/sandbox/worktree/CopyToWorktree.js";
import { runHostHooks } from "../../application/sandbox/lifecycle/hooks.js";
import { providerTraits } from "../../application/sandbox/lifecycle/providerTraits.js";
import {
  alertSyncOutRecovery,
  alertWorktreePreserved,
} from "../../application/sandbox/lifecycle/sandboxAlerts.js";
import * as WorktreeManager from "../../application/sandbox/worktree/WorktreeManager.js";
import {
  runSandboxReadyHooks,
  startWorktreeSandbox,
  type WorktreeSandbox,
} from "../../application/sandbox/worktree/worktreeSandbox.js";
import { syncOut } from "../../application/sync/syncOut.js";
import { runWithHost } from "./runWithHost.js";
import type { CloseResult, CreateSandboxOptions, Sandbox } from "./Sandbox.js";
import { buildSandboxHandle } from "./sandboxHandle.js";

/**
 * `applyToHost` for a started sandbox: isolated providers sync the sandbox's
 * commits back to the worktree (alerting recovery steps if a patch fails);
 * shared-filesystem providers have nothing to sync.
 */
const makeApplyToHost = (
  isIsolated: boolean,
  providerHandle: SandboxHandle | undefined,
  worktreePath: string,
) =>
  isIsolated && providerHandle
    ? () =>
        syncOut(worktreePath, providerHandle).pipe(
          Effect.flatMap(alertSyncOutRecovery),
          Effect.provide(ClackDisplay.layer),
          Effect.provide(NodeHostProcess.layer),
        )
    : () => Effect.void;

/** @internal Options for createSandboxFromWorktree — used by worktree.attachSandbox(). */
export interface CreateSandboxFromWorktreeOptions {
  readonly branch: string;
  readonly worktreePath: string;
  readonly hostRepoDir: string;
  readonly sandbox: SandboxProvider;
  readonly hooks?: SandboxHooks;
  readonly copyToWorktree?: string[];
  readonly timeouts?: Timeouts;
  /** Forwarded to the Sandbox handle. Set by `createWorktree` so the handle
   *  can route `.runAgent()`/`.interactive()` correctly: for `merge-to-head`,
   *  each call merges back to the host's current branch and the worktree's
   *  source branch is preserved; for `branch`, the lifecycle is driven as
   *  explicit-branch mode. Absent for top-level `createSandbox()`. */
  readonly branchStrategy?: MergeToHeadBranchStrategy | NamedBranchStrategy;
  readonly _test?: {
    readonly buildSandbox?: (sandboxDir: string) => SandboxOps;
  };
}

/**
 * @internal Creates a sandbox backed by an existing worktree.
 * Split ownership: close() tears down the container only, leaving the worktree intact.
 * Used by Worktree.attachSandbox().
 */
export const createSandboxFromWorktree = async (
  options: CreateSandboxFromWorktreeOptions,
): Promise<Sandbox> => {
  const { branch, worktreePath, hostRepoDir } = options;
  const { isolated: isIsolated } = providerTraits(options.sandbox);

  // 1. Copy files if requested (bind-mount/no-sandbox only; isolated
  //    providers copy them in alongside sync-in).
  if (
    options.copyToWorktree &&
    options.copyToWorktree.length > 0 &&
    !isIsolated
  ) {
    await runWithHost(
      copyToWorktree(
        options.copyToWorktree,
        hostRepoDir,
        worktreePath,
        options.timeouts?.copyToWorktreeMs,
      ),
    );
  }

  // 2. Start the sandbox, then 3. run onSandboxReady hooks.
  const started: WorktreeSandbox = await runWithHost(
    startWorktreeSandbox({
      provider: options.sandbox,
      hostRepoDir,
      worktreePath,
      copyToWorktree: options.copyToWorktree,
      buildTestSandbox: options._test?.buildSandbox,
    }).pipe(Effect.provide(NodeFileSystem)),
  );
  await runWithHost(runSandboxReadyHooks(started, worktreePath, options.hooks));

  // 4. Build and return the handle — container-only close (the worktree
  //    belongs to its createWorktree() owner).
  const { providerHandle, sandbox, sandboxRepoDir } = started;
  let closed = false;

  return buildSandboxHandle(
    {
      branch,
      worktreePath,
      hostRepoDir,
      sandboxRepoDir,
      sandbox,
      providerHandle,
      applyToHost: makeApplyToHost(isIsolated, providerHandle, worktreePath),
      timeouts: options.timeouts,
      branchStrategy: options.branchStrategy,
    },
    async () => {
      if (closed) return { preservedWorktreePath: undefined };
      closed = true;
      if (providerHandle) await providerHandle.close();
      return { preservedWorktreePath: undefined };
    },
  );
};

/**
 * Eagerly creates a git worktree on the provided explicit branch and starts
 * a sandbox with the worktree bind-mounted. Returns a `Sandbox` handle whose
 * `.runAgent()` / `.interactive()` methods can be called repeatedly against
 * it — distinct from the top-level `run()`, which creates and tears down its
 * own worktree within a single call. For a sandbox backed by a worktree you
 * already made with `createWorktree()`, use `Worktree.attachSandbox()`
 * instead.
 */
export const createSandbox = async (
  options: CreateSandboxOptions,
): Promise<Sandbox> => {
  const { branch } = options;
  const { isolated: isIsolated } = providerTraits(options.sandbox);

  // Resolve cwd, create the worktree, and set up the sandbox in a single Effect.
  // Once the worktree exists, any later failure (e.g. a missing image surfacing
  // when the provider creates the container) tears down the container — if it
  // started — and removes the worktree so it is not orphaned on disk.
  const { hostRepoDir, worktreePath, providerHandle, sandbox, sandboxRepoDir } =
    await runWithHost(
      Effect.gen(function* () {
        const hostRepoDir = yield* resolveCwd(options.cwd);

        yield* WorktreeManager.pruneStale(hostRepoDir).pipe(
          Effect.catchAll(() => Effect.void),
        );
        const { path: worktreePath, reused: worktreeReused } =
          yield* WorktreeManager.create(hostRepoDir, {
            branch,
            baseBranch: options.baseBranch,
          });

        const prepared = yield* Effect.gen(function* () {
          // Copy files (bind-mount/no-sandbox only; isolated copies in launchSandboxHandle).
          if (
            options.copyToWorktree &&
            options.copyToWorktree.length > 0 &&
            !isIsolated
          ) {
            yield* copyToWorktree(
              options.copyToWorktree,
              hostRepoDir,
              worktreePath,
              options.timeouts?.copyToWorktreeMs,
            );
          }

          // Run host.onWorktreeReady hooks (after copy, before sandbox creation).
          if (options.hooks?.host?.onWorktreeReady?.length) {
            yield* runHostHooks(
              options.hooks.host.onWorktreeReady,
              worktreePath,
            );
          }

          const started = yield* startWorktreeSandbox({
            provider: options.sandbox,
            hostRepoDir,
            worktreePath,
            copyToWorktree: options.copyToWorktree,
            buildTestSandbox: options._test?.buildSandbox,
          });

          // If the ready hooks fail, tear down the container that just started
          // before the outer handler removes the worktree.
          yield* runSandboxReadyHooks(
            started,
            worktreePath,
            options.hooks,
          ).pipe(
            Effect.onError(() =>
              started.providerHandle
                ? Effect.promise(() =>
                    started.providerHandle!.close().catch(() => {}),
                  )
                : Effect.void,
            ),
          );

          return started;
        }).pipe(
          Effect.onError(() =>
            // A reused worktree belongs to whoever created it originally —
            // never force-remove it here. Only clean up a worktree this call
            // itself created, and only if it has no uncommitted changes.
            worktreeReused
              ? Effect.void
              : WorktreeManager.hasUncommittedChanges(worktreePath).pipe(
                  Effect.catchAll(() => Effect.succeed(false)),
                  Effect.flatMap((isDirty) =>
                    isDirty
                      ? Effect.void
                      : WorktreeManager.remove(worktreePath).pipe(
                          Effect.catchAll(() => Effect.void),
                        ),
                  ),
                ),
          ),
        );

        return { hostRepoDir, worktreePath, ...prepared };
      }).pipe(
        Effect.provide(ClackDisplay.layer),
        Effect.provide(NodeFileSystem),
      ),
    );

  let closed = false;
  let closeResult: CloseResult | undefined;

  const forceCleanup = () => {
    console.error(`\nWorktree preserved at ${worktreePath}`);
    console.error(`  To review: cd ${worktreePath}`);
    console.error(`  To clean up: git worktree remove --force ${worktreePath}`);
  };

  // Route cleanup through the shared registry so concurrent sandboxes share one
  // SIGINT/SIGTERM/exit listener instead of tripping MaxListenersExceededWarning.
  // Stays registered until teardown actually completes below — unregistering
  // it up front would silence the "worktree preserved" recovery message if
  // the process exits abruptly while a failed close() is still stranding it.
  const unregisterShutdown = registerShutdown(forceCleanup);

  const doClose = async (): Promise<CloseResult> => {
    if (closed) return closeResult!;

    // Capture (rather than propagate) a failure from providerHandle.close()
    // so worktree cleanup below still runs instead of stranding the worktree
    // and leaving it untracked for a retry.
    let closeError: unknown;
    if (providerHandle) {
      try {
        await providerHandle.close();
      } catch (error) {
        closeError = error;
      }
    }

    const result = await runWithHost(
      Effect.gen(function* () {
        // Preserve the worktree when it has uncommitted changes; otherwise remove it.
        const isDirty = yield* WorktreeManager.hasUncommittedChanges(
          worktreePath,
        ).pipe(Effect.catchAll(() => Effect.succeed(false)));
        if (isDirty) {
          // Matches SandboxFactory.ts's cleanupWorktree: tell the user a
          // worktree was left on disk instead of preserving it silently.
          yield* alertWorktreePreserved(
            worktreePath,
            `Worktree preserved at ${worktreePath}`,
          );
          return { preservedWorktreePath: worktreePath };
        }

        yield* WorktreeManager.remove(worktreePath).pipe(
          Effect.catchAll(() => Effect.void),
        );
        return { preservedWorktreePath: undefined };
      }).pipe(Effect.provide(ClackDisplay.layer)),
    );

    closed = true;
    closeResult = result;
    unregisterShutdown();

    if (closeError) throw closeError;
    return result;
  };

  return buildSandboxHandle(
    {
      branch,
      worktreePath,
      hostRepoDir,
      sandboxRepoDir,
      sandbox,
      providerHandle,
      applyToHost: makeApplyToHost(isIsolated, providerHandle, worktreePath),
      timeouts: options.timeouts,
    },
    doClose,
  );
};
