/**
 * iterate — standalone primitive for multi-iteration agent loops.
 *
 * Runs a callback N times, collecting results from each iteration.
 * Handles retry logic for agent failures and abort signal checks
 * between iterations.
 *
 * This is an opt-in layer. Use it when you need multiple iterations.
 * Skip it and call your callback once for single-turn runs.
 *
 * @example
 * ```typescript
 * // Multiple iterations with retry
 * const results = await iterate(
 *   { maxIterations: 3, iterationRetries: 1, signal },
 *   async (i) => {
 *     return await invokeAgent({ executor, cwd, prompt, provider });
 *   },
 * );
 *
 * // Single turn — just call directly, skip iterate()
 * const result = await invokeAgent({ executor, cwd, prompt, provider });
 * ```
 *
 * A thin Promise-facing wrapper around `runIterationLoop`
 * (`application/orchestration/iterationLoop.ts`) — the same shared core
 * `orchestrate()` (`Orchestrator.ts`, the engine behind the `run`/
 * `createSandbox`/`createWorktree` presets) runs directly in Effect-space.
 *
 * Lives in `composition/primitives/` alongside `invokeAgent`, `withWorktree`,
 * and `withHooks` — all four public primitives are co-located here. The L4
 * internal machinery (`Orchestrator`, `iterationLoop`, etc.) stays in
 * `application/orchestration/`; the split tracks I/O privilege, not
 * public-vs-internal (see `scripts/check-architecture.mjs`'s header for the
 * full layer order).
 */

import { Effect } from "effect";
import { runPromiseUnwrapped } from "../../ports/runEffect.js";
import {
  runIterationLoop,
  type IterationOutcome,
} from "../../application/orchestration/iterationLoop.js";

export type { IterationOutcome };

/** Options for iterate. */
export interface IterateOptions<A = unknown> {
  /** Number of iterations to run. Default: 1. */
  readonly maxIterations?: number;
  /**
   * Number of additional retry attempts per iteration on agent failure.
   * 0 = no retries (fail immediately). Default: 0.
   */
  readonly iterationRetries?: number;
  /** AbortSignal to cancel between iterations. */
  readonly signal?: AbortSignal;
  /**
   * Called before each retry attempt with the error and attempt number.
   * Use to log or display retry progress.
   */
  readonly onRetry?: (
    error: Error,
    attempt: number,
    maxRetries: number,
  ) => void;
  /**
   * Called after each successful iteration. Return `true` to stop early —
   * e.g. when the agent emitted its completion signal. The stopping
   * iteration's outcome is included in the results.
   */
  readonly shouldStop?: (result: A, iteration: number) => boolean;
}

const toError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(String(e));

/**
 * Run a callback up to `maxIterations` times.
 *
 * The callback receives the 1-based iteration number. On agent errors
 * (`AgentError` / `AgentIdleTimeoutError`), retries up to `iterationRetries`
 * additional times with exponential backoff before failing the iteration.
 * Stops early when `shouldStop` returns `true`.
 *
 * Returns an array of per-iteration outcomes in order.
 */
export async function iterate<A>(
  options: IterateOptions<A>,
  work: (iteration: number) => Promise<A>,
): Promise<IterationOutcome<A>[]> {
  return runPromiseUnwrapped(
    runIterationLoop(
      {
        maxIterations: options.maxIterations ?? 1,
        iterationRetries: options.iterationRetries ?? 0,
        signal: options.signal,
        onRetry: options.onRetry
          ? (e, attempt, maxRetries) =>
              Effect.sync(() =>
                options.onRetry!(toError(e), attempt, maxRetries),
              )
          : undefined,
        shouldStop: options.shouldStop,
      },
      (i) => Effect.tryPromise({ try: () => work(i), catch: (e) => e }),
    ),
  );
}
