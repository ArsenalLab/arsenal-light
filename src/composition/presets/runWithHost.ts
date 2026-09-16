import { Effect } from "effect";
import type { HostProcess } from "../../ports/HostProcess.js";
import { NodeHostProcess } from "../../platform/node/NodeHostProcess.js";
import { runPromiseUnwrapped } from "../../ports/runEffect.js";

/**
 * Run an API-level Effect with the Node host-process adapter provided.
 *
 * Uses `runPromiseUnwrapped` (not `Effect.runPromise`) so a failure rejects
 * with the original tagged error, not Effect's `FiberFailure` wrapper —
 * callers throughout `composition/presets` catch/inspect these errors
 * directly (e.g. `error instanceof WorktreeError`).
 */
export const runWithHost = <A, E>(
  effect: Effect.Effect<A, E, HostProcess>,
): Promise<A> =>
  runPromiseUnwrapped(Effect.provide(effect, NodeHostProcess.layer));
