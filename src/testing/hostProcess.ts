/**
 * Test helpers for running engine Effects that need the `HostProcess` port,
 * backed by the real Node adapter (tests exercise real git/cp/shell).
 */

import { Effect, Layer } from "effect";
import type { HostProcess } from "../ports/HostProcess.js";
import { NodeHostProcess } from "../platform/node/NodeHostProcess.js";

export { NodeHostProcess };

export const nodeHostLayer: Layer.Layer<HostProcess> = NodeHostProcess.layer;

export const runWithHost = <A, E>(effect: Effect.Effect<A, E, HostProcess>) =>
  Effect.runPromise(Effect.provide(effect, NodeHostProcess.layer));

export const runWithHostExit = <A, E>(
  effect: Effect.Effect<A, E, HostProcess>,
) => Effect.runPromiseExit(Effect.provide(effect, NodeHostProcess.layer));
