/** Completion-signal defaults and matching, shared by `invokeAgent` and `orchestrate`. */

export const DEFAULT_COMPLETION_SIGNAL = "<promise>COMPLETE</promise>";

/** Normalize a single signal, a list, or `undefined` (the default) into a list.
 *
 * Blank/empty-string signals are dropped — an empty string would match via
 * `output.includes("")` against any text, causing the first parsed event to
 * be mistaken for completion. A blank signal is treated as "no signal
 * configured" rather than "matches everything".
 */
export const normalizeCompletionSignals = (
  completionSignal: string | readonly string[] | undefined,
): readonly string[] => {
  if (completionSignal === undefined) return [DEFAULT_COMPLETION_SIGNAL];
  const signals =
    typeof completionSignal === "string"
      ? [completionSignal]
      : completionSignal;
  return signals.filter((sig) => sig.trim().length > 0);
};

/**
 * Scan accumulated agent output for a completion signal, returning the first
 * matching signal string or `undefined`. This is the exact matching logic
 * `orchestrate()` uses internally to decide when an agent has finished —
 * exported so custom orchestration built on `createSandbox()`/`createWorktree()`
 * (calling `.run()` repeatedly under your own control flow instead of through
 * `run()`'s built-in iteration loop) can apply the same semantics to each
 * step's output without reimplementing it.
 *
 * Matches by substring against the given text — callers driving their own
 * orchestration should scan the same accumulated/parsed output `run()` would
 * (not raw stdout, which can echo the prompt itself and false-positive on the
 * signal — see the `AgentInvocationResult.completionSignal` doc comment).
 */
export const matchCompletionSignal = (
  output: string,
  completionSignal: string | readonly string[] | undefined,
): string | undefined =>
  normalizeCompletionSignals(completionSignal).find((sig) =>
    output.includes(sig),
  );
