/**
 * invokeAgent — standalone primitive for running one agent turn.
 *
 * This is the lowest composable layer above the transport. It handles:
 *   - ACP session execution (spawn-per-call or persistent AgentSession)
 *   - idle timeout and completion-grace timer
 *   - completion signal detection
 *   - abort signal wiring
 *
 * It knows nothing about worktrees, git lifecycle, iterations, or hooks.
 * Those are separate opt-in layers above this one.
 *
 * @example
 * ```typescript
 * // Just invoke — no orchestration at all
 * const result = await invokeAgent({
 *   executor: localExecutor(process.cwd(), env),
 *   cwd: process.cwd(),
 *   prompt: "List all files",
 *   provider: bob("default"),
 *   signal,
 * });
 *
 * // With your own worktree wrapping it
 * await withWorktree({ ... }, async (ctx) => {
 *   await invokeAgent({ executor: ctx.executor, cwd: ctx.cwd, prompt, provider });
 * });
 * ```
 *
 * Lives in `composition/primitives/` alongside `iterate`, `withWorktree`, and
 * `withHooks` — all four public primitives are co-located here.
 *
 * The Effect-based implementation lives in
 * `application/orchestration/invokeAgentEffect.ts` (L4) so the internal
 * `Orchestrator` can share it without an upward layer violation.
 */

import { runPromiseUnwrapped } from "../../ports/runEffect.js";
import {
  invokeAgentEffect,
  type InvokeAgentOptions,
  type InvokeAgentResult,
} from "../../application/orchestration/invokeAgentEffect.js";

export type { InvokeAgentOptions, InvokeAgentResult };

/**
 * Run one agent turn through `options.executor` using ACP transport.
 *
 * Rejects with the original error — `AgentError`, `AgentIdleTimeoutError`, or
 * the abort signal's `reason` — never an Effect wrapper.
 */
export const invokeAgent = (
  options: InvokeAgentOptions,
): Promise<InvokeAgentResult> =>
  runPromiseUnwrapped(invokeAgentEffect(options));
