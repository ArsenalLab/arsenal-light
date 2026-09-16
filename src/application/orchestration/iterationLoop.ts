/**
 * runIterationLoop — the shared Effect-based core behind both `iterate()`
 * (`iterate.ts`, the Promise-facing public primitive) and `orchestrate()`
 * (`Orchestrator.ts`, the internal engine behind the `run`/`createSandbox`/
 * `createWorktree` presets). Runs `work` up to `maxIterations` times,
 * retrying `AgentError`/`AgentIdleTimeoutError` failures per iteration with
 * exponential backoff, checking `signal` before every iteration and every
 * retry attempt, and stopping early when `shouldStop` returns `true`.
 */

import { Duration, Effect, Cause, Runtime } from "effect";

const INITIAL_RETRY_DELAY_MS = 100;
const MAX_RETRY_DELAY_MS = 5_000;
const RETRYABLE_TAGS = new Set(["AgentError", "AgentIdleTimeoutError"]);

/**
 * Whether a failure is a retryable agent failure.
 *
 * Defensively unwraps a `FiberFailure` (as produced by `Effect.runPromise`)
 * in case `work` internally runs its own Effects and rejects with one —
 * `orchestrate()`'s already-typed `SandboxError` failures just fall through
 * this branch unchanged.
 */
const isRetryableAgentError = (e: unknown): boolean => {
  const error = Runtime.isFiberFailure(e)
    ? Cause.squash(e[Runtime.FiberFailureCauseId])
    : e;
  const tag = (error as { _tag?: unknown } | null)?._tag;
  return typeof tag === "string" && RETRYABLE_TAGS.has(tag);
};

/**
 * Check `signal` and die with its `reason` if aborted — the blessed way to
 * signal abort in this codebase (see `ports/runEffect.ts`'s
 * `runPromiseUnwrapped`, which explicitly unwraps "an abort signal's
 * reason" at the Promise boundary).
 */
export const checkAbort = (
  signal: AbortSignal | undefined,
): Effect.Effect<void> =>
  signal?.aborted ? Effect.die(signal.reason) : Effect.void;

/** Per-iteration result. */
export interface IterationOutcome<A> {
  /** 1-based iteration number. */
  readonly iteration: number;
  /** Result from the callback. */
  readonly result: A;
}

export interface RunIterationLoopOptions<A> {
  /** Number of iterations to run. */
  readonly maxIterations: number;
  /** Number of additional retry attempts per iteration on agent failure. */
  readonly iterationRetries: number;
  /** AbortSignal to cancel between iterations and retry attempts. */
  readonly signal?: AbortSignal;
  /** Called before each retry attempt with the error and attempt number. */
  readonly onRetry?: (
    error: unknown,
    attempt: number,
    maxRetries: number,
  ) => Effect.Effect<void>;
  /**
   * Called after each successful iteration. Return `true` to stop early.
   * The stopping iteration's outcome is included in the results.
   */
  readonly shouldStop?: (result: A, iteration: number) => boolean;
}

/** Run one iteration, retrying retryable agent errors with exponential backoff. */
const runWithRetries = <A, E, R>(
  iteration: number,
  options: RunIterationLoopOptions<A>,
  work: (iteration: number) => Effect.Effect<A, E, R>,
): Effect.Effect<A, E, R> =>
  Effect.gen(function* () {
    let delayMs = INITIAL_RETRY_DELAY_MS;

    for (let attempt = 0; ; attempt++) {
      yield* checkAbort(options.signal);
      const outcome = yield* Effect.either(work(iteration));
      if (outcome._tag === "Right") return outcome.right;

      const e = outcome.left;
      if (!isRetryableAgentError(e) || attempt >= options.iterationRetries) {
        return yield* Effect.fail(e);
      }
      yield* options.onRetry?.(e, attempt + 1, options.iterationRetries) ??
        Effect.void;
      yield* Effect.sleep(Duration.millis(delayMs));
      delayMs = Math.min(delayMs * 2, MAX_RETRY_DELAY_MS);
    }
  });

/**
 * Run `work` up to `options.maxIterations` times.
 *
 * `work` receives the 1-based iteration number. On agent errors
 * (`AgentError` / `AgentIdleTimeoutError`), retries up to
 * `options.iterationRetries` additional times with exponential backoff
 * before failing the iteration. Stops early when `options.shouldStop`
 * returns `true`.
 *
 * Returns all per-iteration outcomes in order.
 */
export const runIterationLoop = <A, E, R>(
  options: RunIterationLoopOptions<A>,
  work: (iteration: number) => Effect.Effect<A, E, R>,
): Effect.Effect<IterationOutcome<A>[], E, R> =>
  Effect.gen(function* () {
    const results: IterationOutcome<A>[] = [];

    for (let i = 1; i <= options.maxIterations; i++) {
      yield* checkAbort(options.signal);
      const result = yield* runWithRetries(i, options, work);
      results.push({ iteration: i, result });
      if (options.shouldStop?.(result, i)) break;
    }

    return results;
  });
