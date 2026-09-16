/**
 * Central orchestrator: manages the iteration loop, delegates to
 * sandbox/git/session sub-systems, and applies the branch strategy to
 * produce final commits.
 *
 * This is the internal, Effect-based engine behind the `run`/`createSandbox`/
 * `createWorktree` presets. Its iteration loop is `runIterationLoop`
 * (`iterationLoop.ts`) — the same shared core the public, Promise-based
 * `iterate()` primitive (`composition/primitives/iterate.ts`) wraps.
 *
 * `application/orchestration/` holds only the internal machinery
 * (`Orchestrator`, `RunConfig`, `RunDisplay`, `completionSignal`,
 * `iterationLoop`). The public primitives `invokeAgent` and `iterate` live
 * in `composition/primitives/` alongside `withWorktree`/`withHooks`, making
 * the presets-vs-primitives split visible in the folder structure (see
 * `scripts/check-architecture.mjs`'s header for the full layer order).
 */

import { Effect } from "effect";
import { AgentStreamEmitter } from "../display/AgentStreamEmitter.js";
import { Display } from "../../ports/Display.js";
import type { HostProcess } from "../../ports/HostProcess.js";
import { preprocessPrompt } from "../prompts/PromptPreprocessor.js";
import type { SandboxError } from "../../errors/errors.js";
import { SandboxFactory } from "../sandbox/lifecycle/SandboxFactory.js";
import { sandboxExecutor, toSandboxCommands } from "../../ports/SandboxOps.js";
import { SANDBOX_REPO_DIR } from "../sandbox/mounts/mountUtils.js";
import { withSandboxLifecycle } from "../sandbox/lifecycle/SandboxLifecycle.js";
import type { SandboxHooks, Timeouts } from "../../ports/lifecycleConfig.js";
import type { AgentProvider, IterationUsage } from "../../spi/AgentProvider.js";
import { TextDeltaBuffer } from "../display/TextDeltaBuffer.js";
import { invokeAgentEffect } from "./invokeAgentEffect.js";
import { normalizeCompletionSignals } from "./completionSignal.js";
import { runIterationLoop } from "./iterationLoop.js";

export type {
  ParsedStreamEvent,
  IterationUsage,
} from "../../spi/AgentProvider.js";

const DEFAULT_IDLE_TIMEOUT_SECONDS = 10 * 60;
const DEFAULT_COMPLETION_TIMEOUT_SECONDS = 60;

export interface OrchestrateOptions {
  readonly hostRepoDir: string;
  readonly iterations: number;
  readonly hooks?: SandboxHooks;
  readonly prompt: string;
  readonly branch?: string;
  readonly provider: AgentProvider;
  readonly completionSignal?: string | string[];
  /** Idle timeout in seconds. If the agent produces no output for this long, it fails with AgentIdleTimeoutError. Default: 600 (10 minutes) */
  readonly idleTimeoutSeconds?: number;
  /**
   * Grace window in seconds after a completion signal is observed in the
   * agent's output. The agent process is expected to exit shortly after
   * emitting the signal; if it does not (because a spawned child — a `gh`/git
   * subprocess or long-lived MCP server — inherited the exec's stdout pipe
   * and is keeping it open), this timer fires and the iteration resolves
   * successfully with the buffered output. Resets on every subsequent output
   * line, so trailing data (token-usage events, terminal `result` events,
   * structured-output tags) is still captured. Default: 60 seconds.
   */
  readonly completionTimeoutSeconds?: number;
  /** Optional name for the run, prepended to status messages as [name] */
  readonly name?: string;
  /** @internal Test-only override for the idle warning interval in milliseconds. Default: 60000 (1 minute). */
  readonly _idleWarningIntervalMs?: number;
  /** An AbortSignal that cancels the orchestration when aborted. */
  readonly signal?: AbortSignal;
  /** When true, skip prompt expansion (shell expression evaluation). Set for dynamic inline prompts. */
  readonly skipPromptExpansion?: boolean;
  /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
  readonly timeouts?: Timeouts;
  /** Forwarded to `withSandboxLifecycle` — see `SandboxLifecycleOptions.keepSourceBranch`. */
  readonly keepSourceBranch?: boolean;
  /**
   * Number of additional attempts per iteration when the agent fails with an
   * `AgentError` or `AgentIdleTimeoutError`. Each retry spins up a completely
   * fresh sandbox (the same path as a normal next iteration), so sandbox
   * lifecycle is unaffected. A value of `0` (default) means no retries — fail
   * immediately on first error. A value of `2` means up to 3 total attempts
   * per iteration.
   *
   * Only `AgentError` and `AgentIdleTimeoutError` are retried. Errors from
   * sandbox setup, git operations, or lifecycle hooks are never retried because
   * they are structural failures that a repeat attempt cannot fix.
   */
  readonly iterationRetries?: number;
}

/** Per-iteration result carrying an optional session ID. */
export interface IterationResult {
  /** ACP session ID reported by the agent, when it reported one. */
  readonly sessionId?: string;
  /** Token usage reported on the agent's stream, when it reported any. */
  readonly usage?: IterationUsage;
}

export interface OrchestrateResult {
  /** Per-iteration results (use `iterations.length` for the count). */
  readonly iterations: IterationResult[];
  /**
   * The matched completion signal string, or undefined if none fired.
   *
   * Matched against the *parsed* agent output, never against raw stdout.
   * Raw stdout can include the agent echoing back the prompt it was given,
   * and the prompt is exactly where the completion signal text lives —
   * matching against raw stdout would report a completion the agent never
   * actually signaled.
   */
  readonly completionSignal?: string;
  readonly stdout: string;
  readonly commits: { sha: string }[];
  readonly branch: string;
  /** Host path to the preserved worktree from the last iteration, set when the worktree was left behind due to uncommitted changes on a successful run. */
  readonly preservedWorktreePath?: string;
}

export const orchestrate = (
  options: OrchestrateOptions,
): Effect.Effect<
  OrchestrateResult,
  SandboxError,
  SandboxFactory | Display | AgentStreamEmitter | HostProcess
> => {
  const idleTimeoutMs =
    (options.idleTimeoutSeconds ?? DEFAULT_IDLE_TIMEOUT_SECONDS) * 1000;
  const completionTimeoutMs =
    (options.completionTimeoutSeconds ?? DEFAULT_COMPLETION_TIMEOUT_SECONDS) *
    1000;
  const maxRetries = options.iterationRetries ?? 0;
  return Effect.gen(function* () {
    const factory = yield* SandboxFactory;
    const display = yield* Display;
    const streamEmitter = yield* AgentStreamEmitter;
    const { hostRepoDir, iterations, hooks, prompt, branch, provider } =
      options;
    const completionSignals = normalizeCompletionSignals(
      options.completionSignal,
    );

    const label = (msg: string): string =>
      options.name ? `[${options.name}] ${msg}` : msg;

    // One iteration: fresh sandbox, git lifecycle, prompt, agent invocation.
    // Retry (on AgentError/AgentIdleTimeoutError) and the overall iteration
    // count are handled by runIterationLoop, below — sandbox setup, git, and
    // lifecycle failures are structural and are never retried; each retry
    // creates a fresh sandbox (same path as a normal iteration) so sandbox
    // lifecycle is completely unaffected.
    const runIteration = (i: number) =>
      Effect.gen(function* () {
        yield* display.status(label(`Iteration ${i}/${iterations}`), "info");

        return yield* factory.withSandbox(
          ({ hostWorktreePath, sandboxRepoPath, applyToHost }, sandbox) =>
            withSandboxLifecycle(
              {
                hostRepoDir,
                sandboxRepoDir: sandboxRepoPath,
                hooks,
                branch,
                hostWorktreePath,
                applyToHost,
                signal: options.signal,
                timeouts: options.timeouts,
                keepSourceBranch: options.keepSourceBranch,
              },
              sandbox,
              (ctx) =>
                Effect.gen(function* () {
                  // Preprocess prompt (run !`command` expressions inside sandbox).
                  // Inline prompts pass through literally — skip expansion.
                  const fullPrompt = options.skipPromptExpansion
                    ? prompt
                    : yield* preprocessPrompt(
                        prompt,
                        ctx.sandbox,
                        ctx.sandboxRepoDir,
                      );

                  yield* display.status(label("Agent started"), "success");

                  // Invoke the agent — buffer text deltas so single-token
                  // stream chunks are displayed as readable multi-word lines.
                  const textBuffer = new TextDeltaBuffer((chunk) => {
                    Effect.runPromise(display.textChunk(chunk));
                    Effect.runPromise(
                      streamEmitter.emit({
                        type: "text",
                        message: chunk,
                        iteration: i,
                        timestamp: new Date(),
                      }),
                    );
                  });
                  const onText = (text: string) => {
                    textBuffer.write(text);
                  };
                  const onToolCall = (name: string, formattedArgs: string) => {
                    textBuffer.flush();
                    Effect.runPromise(display.toolCall(name, formattedArgs));
                    Effect.runPromise(
                      streamEmitter.emit({
                        type: "toolCall",
                        name,
                        formattedArgs,
                        iteration: i,
                        timestamp: new Date(),
                      }),
                    );
                  };
                  const onRawLine = (line: string) => {
                    Effect.runPromise(
                      streamEmitter.emit({
                        type: "raw",
                        line,
                        iteration: i,
                        timestamp: new Date(),
                      }),
                    );
                  };
                  const onIdleWarning = (minutes: number) => {
                    const msg =
                      minutes === 1
                        ? "Agent idle for 1 minute"
                        : `Agent idle for ${minutes} minutes`;
                    Effect.runPromise(display.status(label(msg), "warn"));
                  };
                  const onCompletionTimeout = (timeoutMs: number) => {
                    Effect.runPromise(
                      display.status(
                        label(
                          `Completion signal seen but agent process is hanging — force-completing after ${timeoutMs / 1000}s grace window.`,
                        ),
                        "warn",
                      ),
                    );
                  };
                  const {
                    result: agentOutput,
                    sessionId,
                    usage,
                    completionSignal: matchedSignal,
                  } = yield* invokeAgentEffect({
                    executor: sandboxExecutor(toSandboxCommands(ctx.sandbox)),
                    cwd: ctx.sandboxRepoDir,
                    prompt: fullPrompt,
                    provider,
                    idleTimeoutSeconds: idleTimeoutMs / 1000,
                    completionTimeoutSeconds: completionTimeoutMs / 1000,
                    completionSignal: completionSignals,
                    onText,
                    onToolCall,
                    onRawLine,
                    onIdleWarning,
                    onCompletionTimeout,
                    _idleWarningIntervalMs: options._idleWarningIntervalMs,
                    signal: options.signal,
                  });

                  // Flush any remaining buffered text deltas
                  textBuffer.dispose();

                  yield* display.status(label("Agent stopped"), "info");

                  // The completion signal comes from invokeAgent, which
                  // matched it against the parsed stream. Do not re-scan
                  // `agentOutput` here: it falls back to raw stdout, which
                  // carries the agent's echo of the prompt — and the prompt
                  // contains the signal, so re-scanning reports completion the
                  // agent never signalled.
                  return {
                    completionSignal: matchedSignal,
                    stdout: agentOutput,
                    sessionId,
                    usage,
                  } as const;
                }),
            ),
        );
      });

    const outcomes = yield* runIterationLoop(
      {
        maxIterations: iterations,
        iterationRetries: maxRetries,
        signal: options.signal,
        onRetry: (e, attempt, retries) => {
          const err = e as SandboxError;
          const reason =
            err._tag === "AgentIdleTimeoutError"
              ? "Agent idle timeout"
              : `Agent failed: ${err.message.split("\n")[0]}`;
          return display.status(
            label(`${reason} (attempt ${attempt}/${retries + 1}). Retrying…`),
            "warn",
          );
        },
        shouldStop: (iterationResult) =>
          iterationResult.value.result.completionSignal !== undefined,
      },
      runIteration,
    );

    const allCommits: { sha: string }[] = [];
    const allIterations: IterationResult[] = [];
    let allStdout = "";
    let resolvedBranch = "";

    for (const { result: iterationResult } of outcomes) {
      const lifecycleResult = iterationResult.value;
      allCommits.push(...lifecycleResult.commits);
      allStdout += lifecycleResult.result.stdout;
      resolvedBranch = lifecycleResult.branch;
      allIterations.push({
        sessionId: lifecycleResult.result.sessionId,
        usage: lifecycleResult.result.usage,
      });
    }

    const lastOutcome = outcomes[outcomes.length - 1];
    const iterationPreservedPath = lastOutcome?.result.preservedWorktreePath;
    const completionSignal = lastOutcome?.result.value.result.completionSignal;

    yield* display.status(
      completionSignal !== undefined
        ? label(
            `Agent signaled completion after ${outcomes.length} iteration(s).`,
          )
        : label(`Reached max iterations (${iterations}).`),
      completionSignal !== undefined ? "success" : "info",
    );

    return {
      iterations: allIterations,
      completionSignal,
      stdout: allStdout,
      commits: allCommits,
      branch: resolvedBranch,
      preservedWorktreePath: iterationPreservedPath,
    };
  });
};
