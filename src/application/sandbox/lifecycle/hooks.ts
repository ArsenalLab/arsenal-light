import { Deferred, Effect } from "effect";
import {
  ExecError,
  HookTimeoutError,
  withTimeout,
} from "../../../errors/errors.js";
import { execOk, type SandboxOps } from "../../../ports/SandboxOps.js";
import { HostProcess } from "../../../ports/HostProcess.js";

/** Default per-hook timeout when a hook sets no `timeoutMs`. */
export const HOOK_TIMEOUT_MS = 60_000;

/**
 * Runs an array of host-side hook commands sequentially.
 * Each command runs on the host with the given cwd.
 * Fails fast on non-zero exit.
 */
export const runHostHooks = (
  hooks: ReadonlyArray<{
    readonly command: string;
    readonly timeoutMs?: number;
  }>,
  cwd: string,
  signal?: AbortSignal,
): Effect.Effect<void, ExecError | HookTimeoutError, HostProcess> =>
  Effect.gen(function* () {
    const host = yield* HostProcess;
    for (const hook of hooks) {
      const timeout = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
      // Own controller, forwarding the caller's signal into it, so a timeout
      // here can abort `host.shell`'s child process directly — `withTimeout`
      // only interrupts the racing Effect fiber, which doesn't by itself stop
      // the process, leaving it free to keep mutating the worktree after this
      // hook has already been reported as timed out.
      const hookController = new AbortController();
      const forwardAbort = () => hookController.abort(signal?.reason);
      if (signal) {
        if (signal.aborted) hookController.abort(signal.reason);
        else signal.addEventListener("abort", forwardAbort, { once: true });
      }
      yield* host
        .shell(hook.command, { cwd, signal: hookController.signal })
        .pipe(
          // Attached to the innermost effect (before withTimeout races it) so
          // it's this fiber's own finalizer that runs when withTimeout
          // interrupts it on timeout, not a no-op wrapping the race itself.
          Effect.onInterrupt(() => Effect.sync(() => hookController.abort())),
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
          Effect.ensuring(
            Effect.sync(() =>
              signal?.removeEventListener("abort", forwardAbort),
            ),
          ),
        );
    }
  });

/**
 * Runs `hooks` inside the sandbox with unbounded concurrency, racing each one
 * against `signal` via a `Deferred` — `sandbox.exec` has no native
 * cancellation, so this is the bridge from a Node `AbortSignal` (which
 * Effect's own fiber interruption doesn't observe) into Effect's world.
 * Cancels the *wait*, not the underlying child process. Extracted out of
 * `withSandboxLifecycleImpl`'s inline block as its own export so any future
 * lighter-weight lifecycle variant (one that doesn't need a full worktree)
 * can reuse this exact, proven cancellation behavior instead of a second,
 * lesser implementation.
 */
export const runSandboxHooksWithAbort = (
  sandbox: SandboxOps,
  sandboxRepoDir: string,
  hooks: ReadonlyArray<{
    readonly command: string;
    readonly sudo?: boolean;
    readonly timeoutMs?: number;
  }>,
  signal: AbortSignal,
): Effect.Effect<void, ExecError | HookTimeoutError> =>
  Effect.gen(function* () {
    const abortDeferred = yield* Deferred.make<never, ExecError>();
    let abortCleanup: (() => void) | null = null;
    if (signal.aborted) {
      yield* Deferred.fail(
        abortDeferred,
        new ExecError({
          command: "abort",
          message: `Aborted: ${signal.reason}`,
        }),
      );
    } else {
      const onAbort = () => {
        Effect.runPromise(
          Deferred.fail(
            abortDeferred,
            new ExecError({
              command: "abort",
              message: `Aborted: ${signal.reason}`,
            }),
          ),
        ).catch(() => {});
      };
      signal.addEventListener("abort", onAbort, { once: true });
      abortCleanup = () => signal.removeEventListener("abort", onAbort);
    }

    const hookEffects = hooks.map((hook) => {
      const timeout = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
      return Effect.raceFirst(
        execOk(sandbox, hook.command, {
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
        ),
        Deferred.await(abortDeferred) as Effect.Effect<never, ExecError, never>,
      );
    });

    yield* (
      hookEffects.length > 0
        ? Effect.all(hookEffects, { concurrency: "unbounded" })
        : Effect.void
    ).pipe(Effect.ensuring(Effect.sync(() => abortCleanup?.())));
  });
