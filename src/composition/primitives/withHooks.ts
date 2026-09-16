/**
 * withHooks — standalone primitive for running sandbox lifecycle hooks.
 *
 * Runs host-side and sandbox-side hooks around a callback. This is the
 * opt-in layer for `onWorktreeReady` / `onSandboxReady` hooks without
 * requiring the full orchestration stack.
 *
 * @example
 * ```typescript
 * // Run hooks around your own agent invocation
 * await withHooks(
 *   hooks,
 *   { cwd: "/repo", sandbox },
 *   async () => {
 *     await invokeAgent({ executor, cwd: "/repo", prompt, provider });
 *   },
 * );
 *
 * // No hooks needed — just skip this layer entirely
 * await invokeAgent({ executor, cwd, prompt, provider });
 * ```
 *
 * `cwd` and `sandboxCwd` are the same path above only because `sandbox` here
 * is a bind-mount provider. For an isolated `SandboxProvider` (e.g. one from
 * `createIsolatedSandboxProvider`), pass `ctx.cwd` from `withWorktree` as
 * `sandboxCwd` explicitly — it's a different filesystem root than the host `cwd`.
 *
 * Lives in `composition/primitives/` alongside `invokeAgent`, `iterate`, and
 * `withWorktree` — all four public primitives are co-located here.
 * `composition/` may import `platform/` and do real I/O; `application/` may
 * not (see `scripts/check-architecture.mjs`'s header for the full layer
 * order and the I/O rule it enforces).
 */

import {
  fromSandboxCommands,
  type SandboxCommands,
} from "../../ports/SandboxOps.js";
import type { SandboxHooks } from "../../ports/lifecycleConfig.js";
import {
  runHostHooks,
  runSandboxHooksWithAbort,
} from "../../application/sandbox/lifecycle/hooks.js";
import { Effect } from "effect";
import { runPromiseUnwrapped } from "../../ports/runEffect.js";
import { NodeHostProcess } from "../../platform/node/NodeHostProcess.js";

export type { SandboxHooks };

/** Options for withHooks. */
export interface WithHooksOptions {
  /** Host-side repo root — used as cwd for host hooks. */
  readonly cwd: string;
  /**
   * Sandbox to run sandbox-side hooks (`hooks.sandbox.onSandboxReady`) in —
   * e.g. `ctx.sandbox` from `withWorktree`. Optional when you have no sandbox hooks.
   */
  readonly sandbox?: SandboxCommands;
  /**
   * Repo root *inside* the sandbox, used as cwd for sandbox-side hooks —
   * e.g. `ctx.cwd` from `withWorktree`. Defaults to `cwd` when omitted, which
   * is only correct when the host and sandbox share a filesystem (bind-mount
   * or no-sandbox). Pass this explicitly for an isolated `SandboxProvider`
   * (e.g. `createIsolatedSandboxProvider`), where the sandbox-side path is a
   * different filesystem root than the host.
   */
  readonly sandboxCwd?: string;
  /** AbortSignal threaded to hooks. */
  readonly signal?: AbortSignal;
}

/**
 * Run lifecycle hooks around a callback.
 *
 * Executes host `onWorktreeReady` → host `onSandboxReady` → sandbox
 * `onSandboxReady` in order before calling `work`, then returns its result.
 * No teardown hooks run after — hooks are setup-only in this model.
 *
 * Omit this layer entirely if you have no hooks.
 */
export async function withHooks<A>(
  hooks: SandboxHooks,
  options: WithHooksOptions,
  work: () => Promise<A>,
): Promise<A> {
  const { cwd, sandbox, signal } = options;
  const sandboxCwd = options.sandboxCwd ?? cwd;
  // runSandboxHooksWithAbort requires a non-optional AbortSignal.
  // Provide a never-aborting signal when the caller omits one.
  const effectiveSignal = signal ?? new AbortController().signal;

  await runPromiseUnwrapped(
    Effect.gen(function* () {
      // Host: onWorktreeReady
      const worktreeReadyHooks = hooks.host?.onWorktreeReady ?? [];
      if (worktreeReadyHooks.length > 0) {
        yield* runHostHooks(worktreeReadyHooks, cwd, signal);
      }

      // Host: onSandboxReady
      const hostSandboxReadyHooks = hooks.host?.onSandboxReady ?? [];
      if (hostSandboxReadyHooks.length > 0) {
        yield* runHostHooks(hostSandboxReadyHooks, cwd, signal);
      }

      // Sandbox: onSandboxReady — needs (sandbox, cwd, hooks, signal)
      const sandboxReadyHooks = hooks.sandbox?.onSandboxReady ?? [];
      if (sandboxReadyHooks.length > 0) {
        if (!sandbox)
          throw new Error(
            "withHooks: sandbox is required when hooks.sandbox.onSandboxReady is set",
          );
        yield* runSandboxHooksWithAbort(
          fromSandboxCommands(sandbox),
          sandboxCwd,
          sandboxReadyHooks,
          effectiveSignal,
        );
      }
    }).pipe(Effect.provide(NodeHostProcess.layer)),
  );

  return work();
}
