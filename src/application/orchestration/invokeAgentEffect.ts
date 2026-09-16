/**
 * invokeAgentEffect — internal Effect-based implementation of one agent turn.
 *
 * This is the shared core used by both the public `invokeAgent()` primitive
 * (`composition/primitives/invokeAgent.ts`) and the internal `Orchestrator`
 * (`Orchestrator.ts`). It is not part of the public API.
 *
 * Kept in `application/orchestration/` (L4) so `Orchestrator` can import it
 * without an upward layer violation. The public wrapper in
 * `composition/primitives/invokeAgent.ts` reaches down to this file.
 */

import { Deferred, Duration, Effect, Fiber } from "effect";
import type {
  AgentProvider,
  IterationUsage,
  ParsedStreamEvent,
} from "../../spi/AgentProvider.js";
import type { AgentExecutor } from "../../ports/AgentExecutor.js";
import {
  matchCompletionSignal,
  normalizeCompletionSignals,
} from "./completionSignal.js";
import {
  AgentError,
  AgentIdleTimeoutError,
  type SandboxError,
} from "../../errors/errors.js";
import {
  runAcpSession,
  type PersistentAcpSession,
} from "../../application/acp/runAcpSession.js";

const IDLE_WARNING_INTERVAL_MS = 60_000;
const DEFAULT_IDLE_TIMEOUT_SECONDS = 10 * 60;
const DEFAULT_COMPLETION_TIMEOUT_SECONDS = 60;

/** Result of a single agent invocation turn. */
export interface InvokeAgentResult {
  /** The final text response or result from the agent. */
  readonly result: string;
  /** The session ID if one was emitted during this turn. */
  readonly sessionId?: string;
  /** Token/cost usage snapshot from this turn. */
  readonly usage?: IterationUsage;
  /** The completion signal matched in the output, if any. */
  readonly completionSignal?: string;
}

/** Options for invokeAgent. */
export interface InvokeAgentOptions {
  /** The executor to run commands through. Use `localExecutor()` for host runs, or `ctx.executor` from `withWorktree`. */
  readonly executor: AgentExecutor;
  /** Absolute path to the repo root inside the sandbox/worktree. */
  readonly cwd: string;
  /** Prompt text to send to the agent. */
  readonly prompt: string;
  /** The agent provider — supplies transport args and output parsers. */
  readonly provider: AgentProvider;
  /**
   * Completion signals to scan for in the agent's output.
   * Defaults to `["<promise>COMPLETE</promise>"]`.
   */
  readonly completionSignal?: string | readonly string[];
  /** Idle timeout in seconds before failing. Default: 600. */
  readonly idleTimeoutSeconds?: number;
  /** Grace window in seconds after completion signal is seen. Default: 60. */
  readonly completionTimeoutSeconds?: number;
  /** AbortSignal to cancel mid-flight. */
  readonly signal?: AbortSignal;
  /**
   * Reuse a persistent ACP session instead of spawning a fresh process.
   * Pass an `AgentSession` from `AgentSession.create()` or from a `BobAcpSession` wrapper.
   */
  readonly session?: PersistentAcpSession;
  /** Called for each text chunk emitted by the agent. */
  readonly onText?: (text: string) => void;
  /** Called for each tool call announcement or result. */
  readonly onToolCall?: (name: string, args: string) => void;
  /**
   * Called with every raw ACP `session/update` as a JSON line, before parsing —
   * including updates that produce no typed event. Any update resets the idle timer.
   */
  readonly onRawLine?: (line: string) => void;
  /** Called when the agent is idle for each elapsed minute. */
  readonly onIdleWarning?: (minutes: number) => void;
  /** Called when the completion-grace timer fires. */
  readonly onCompletionTimeout?: (timeoutMs: number) => void;
  /** @internal Test-only override for idle warning interval ms. */
  readonly _idleWarningIntervalMs?: number;
}

/**
 * Effect form of `invokeAgent`, for engine callers that compose it with
 * other Effects (e.g. `Orchestrator`). Not part of the public API.
 */
export const invokeAgentEffect = (
  options: InvokeAgentOptions,
): Effect.Effect<InvokeAgentResult, SandboxError> =>
  Effect.gen(function* () {
    const {
      executor,
      cwd,
      prompt,
      provider,
      signal,
      onText = () => {},
      onToolCall = () => {},
      onRawLine,
      onIdleWarning = () => {},
      onCompletionTimeout = () => {},
    } = options;

    const idleTimeoutMs =
      (options.idleTimeoutSeconds ?? DEFAULT_IDLE_TIMEOUT_SECONDS) * 1000;
    const completionTimeoutMs =
      (options.completionTimeoutSeconds ?? DEFAULT_COMPLETION_TIMEOUT_SECONDS) *
      1000;
    const idleWarningIntervalMs =
      options._idleWarningIntervalMs ?? IDLE_WARNING_INTERVAL_MS;

    const completionSignals = normalizeCompletionSignals(
      options.completionSignal,
    );

    const { session } = options;
    const { interactiveExec } = executor;

    if (!session && !interactiveExec) {
      return yield* Effect.fail(
        new AgentError({
          message:
            "Executor does not support interactiveExec, which is required for ACP transport.",
        }),
      );
    }

    let resultText = "";
    let sessionId: string | undefined;
    let usage: IterationUsage | undefined;
    let accumulatedOutput = "";

    const timeoutSignal = yield* Deferred.make<never, AgentIdleTimeoutError>();
    const completionTimeoutDeferred = yield* Deferred.make<
      InvokeAgentResult,
      never
    >();

    let timeoutFiber: Fiber.RuntimeFiber<unknown, unknown> | null = null;
    let completionDetected = false;
    let matchedSignal: string | undefined;
    let warningFiber: Fiber.RuntimeFiber<unknown, unknown> | null = null;
    let idleMinuteCounter = 0;

    /**
     * Drives cancellation of the in-flight `runAcpSession` promise itself —
     * `Effect.raceFirst` below only interrupts the *fiber* wrapping that
     * promise when a timeout wins; the promise (and the ACP child
     * process/transport it owns) keeps running unless this signal aborts.
     * `runAcpSession` already knows how to react to an abort (it notifies
     * `session/cancel` and tears down its transport), so timeouts reuse that
     * same path instead of only interrupting the Effect fiber.
     */
    const acpAbortController = new AbortController();

    const interruptFiber = (f: Fiber.RuntimeFiber<unknown, unknown> | null) => {
      if (f !== null) Effect.runFork(Fiber.interrupt(f));
    };

    const startWarningInterval = () => {
      interruptFiber(warningFiber);
      idleMinuteCounter = 0;
      warningFiber = Effect.runFork(
        Effect.gen(function* () {
          while (true) {
            yield* Effect.sleep(Duration.millis(idleWarningIntervalMs));
            idleMinuteCounter++;
            onIdleWarning(idleMinuteCounter);
          }
        }),
      );
    };

    const resetTimer = () => {
      interruptFiber(timeoutFiber);
      if (completionDetected) {
        timeoutFiber = Effect.runFork(
          Effect.gen(function* () {
            yield* Effect.sleep(Duration.millis(completionTimeoutMs));
            onCompletionTimeout(completionTimeoutMs);
            acpAbortController.abort(
              new Error("Completion grace period elapsed"),
            );
            yield* Deferred.succeed(completionTimeoutDeferred, {
              result: resultText || accumulatedOutput,
              sessionId,
              usage,
              completionSignal: matchedSignal,
            });
          }),
        );
      } else {
        timeoutFiber = Effect.runFork(
          Effect.gen(function* () {
            yield* Effect.sleep(Duration.millis(idleTimeoutMs));
            const idleError = new AgentIdleTimeoutError({
              message: `Agent idle for ${idleTimeoutMs / 1000} seconds — no output received. Consider increasing the idleTimeoutSeconds option.`,
              timeoutMs: idleTimeoutMs,
            });
            acpAbortController.abort(idleError);
            yield* Deferred.fail(timeoutSignal, idleError);
          }),
        );
        startWarningInterval();
      }
    };

    /** Handle a parsed event from the ACP transport. */
    const handleEvent = (event: ParsedStreamEvent) => {
      switch (event.type) {
        case "text":
          onText(event.text);
          if (event.assertive !== false) accumulatedOutput += event.text;
          break;
        case "result":
          resultText = event.result;
          accumulatedOutput += event.result;
          break;
        case "tool_call":
          onToolCall(event.name, event.args);
          break;
        case "session_id":
          sessionId = event.sessionId;
          break;
        case "usage":
          usage = event.usage;
          break;
      }
      if (!completionDetected) {
        const found = matchCompletionSignal(
          accumulatedOutput,
          completionSignals,
        );
        if (found !== undefined) {
          completionDetected = true;
          matchedSignal = found;
          interruptFiber(warningFiber);
          warningFiber = null;
        }
      }
      resetTimer();
    };

    const abortDeferred = yield* Deferred.make<never, never>();
    let abortCleanup: (() => void) | null = null;
    if (signal) {
      if (signal.aborted) return yield* Effect.die(signal.reason);
      const onAbort = () => {
        acpAbortController.abort(signal.reason);
        Effect.runFork(Deferred.die(abortDeferred, signal.reason));
      };
      signal.addEventListener("abort", onAbort, { once: true });
      abortCleanup = () => signal.removeEventListener("abort", onAbort);
    }

    resetTimer();

    const workEffect = Effect.tryPromise({
      try: () =>
        runAcpSession({
          cwd,
          prompt,
          signal: acpAbortController.signal,
          onEvent: handleEvent,
          onRawUpdate: (update) => {
            onRawLine?.(JSON.stringify(update));
            resetTimer();
          },
          ...(session ? { session } : { provider, interactiveExec }),
        }),
      catch: (e) =>
        new AgentError({
          message: `ACP session failed: ${e instanceof Error ? e.message : String(e)}`,
        }),
    }).pipe(
      Effect.flatMap((sessionResult) => {
        if (sessionResult.exitCode !== 0 && !matchedSignal) {
          return Effect.fail(
            new AgentError({
              message: `Agent exited with non-zero code ${sessionResult.exitCode}`,
            }),
          );
        }
        return Effect.succeed({
          result: resultText || accumulatedOutput,
          sessionId,
          usage,
          completionSignal: matchedSignal,
        });
      }),
    );

    const workWithCleanup = workEffect.pipe(
      Effect.ensuring(
        Effect.sync(() => {
          interruptFiber(timeoutFiber);
          timeoutFiber = null;
          interruptFiber(warningFiber);
          warningFiber = null;
          if (abortCleanup) {
            abortCleanup();
            abortCleanup = null;
          }
        }),
      ),
    );

    return yield* Effect.raceFirst(
      workWithCleanup,
      Effect.raceFirst(
        Deferred.await(timeoutSignal),
        Effect.raceFirst(
          Deferred.await(completionTimeoutDeferred),
          Deferred.await(abortDeferred),
        ),
      ),
    );
  });
