import { Cause, Effect, Exit } from "effect";

/**
 * Run an Effect at a public Promise boundary.
 *
 * Unlike `Effect.runPromise`, which rejects with a `FiberFailure` wrapper, this
 * rejects with the original failure — the tagged error, the thrown defect, or
 * an abort signal's `reason` — so callers can `instanceof`/`_tag` check it
 * without importing Effect.
 */
export const runPromiseUnwrapped = async <A, E>(
  effect: Effect.Effect<A, E>,
): Promise<A> => {
  const exit = await Effect.runPromiseExit(effect);
  if (Exit.isSuccess(exit)) return exit.value;
  throw Cause.squash(exit.cause);
};
