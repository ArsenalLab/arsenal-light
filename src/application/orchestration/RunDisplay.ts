/**
 * Pure formatting helpers for run output — log filenames, summary rows,
 * completion and context-window messages. Anything that writes to the
 * terminal or the filesystem lives in `composition/runOutput.ts`.
 */

import path from "node:path";
import type { Severity } from "../../ports/Display.js";
import type { IterationResult } from "./Orchestrator.js";
import type { IterationUsage } from "../../spi/AgentProvider.js";
import type { LoggingOption } from "./RunConfig.js";

/** Default maximum number of iterations for a run. */
export const DEFAULT_MAX_ITERATIONS = 1;

/** Replace characters that are invalid or problematic in file paths with dashes. */
export const sanitizeBranchForFilename = (branch: string): string =>
  branch.replace(/[/\\:*?"<>|]/g, "-");

/**
 * The caller's `logging` option, or by default a log file under
 * `<hostRepoDir>/.arsenal/logs/` named by {@link buildLogFilename}.
 */
export const resolveLogging = (options: {
  readonly logging: LoggingOption | undefined;
  readonly hostRepoDir: string;
  readonly branch: string;
  readonly targetBranch?: string;
  readonly name?: string;
}): LoggingOption =>
  options.logging ?? {
    type: "file",
    path: path.join(
      options.hostRepoDir,
      ".arsenal",
      "logs",
      buildLogFilename(options.branch, options.targetBranch, options.name),
    ),
  };

/**
 * Build the log filename for a run.
 * When a targetBranch is provided (temp branch mode), prefixes the filename
 * with the sanitized target branch name so developers can identify which
 * branch the run was targeting: `<targetBranch>-<resolvedBranch>.log`
 * When no targetBranch, uses just the resolved branch: `<resolvedBranch>.log`
 * When a name is provided, appends it to avoid collisions in multi-agent workflows.
 */
export const buildLogFilename = (
  resolvedBranch: string,
  targetBranch?: string,
  name?: string,
): string => {
  const sanitized = sanitizeBranchForFilename(resolvedBranch);
  const nameSuffix = name
    ? `-${name.toLowerCase().replace(/[^a-z0-9_.-]/g, "-")}`
    : "";
  if (targetBranch) {
    return `${sanitizeBranchForFilename(targetBranch)}-${sanitized}${nameSuffix}.log`;
  }
  return `${sanitized}${nameSuffix}.log`;
};

export interface RunSummaryRowsOptions {
  readonly name?: string;
  readonly agentName: string;
  readonly sandboxName: string;
  readonly maxIterations: number;
  readonly branch: string;
}

/**
 * Build the summary rows for a run, used in both terminal mode and
 * log-to-file mode. When a custom name is provided it appears as the
 * Agent value instead of the internal provider name.
 */
export const buildRunSummaryRows = (
  options: RunSummaryRowsOptions,
): Record<string, string> => ({
  Agent: options.name ?? options.agentName,
  Sandbox: options.sandboxName,
  "Max iterations": String(options.maxIterations),
  Branch: options.branch,
});

/**
 * Build the completion status message for a run, used in both terminal mode
 * and log-to-file mode to record the final outcome.
 */
export const buildCompletionMessage = (
  completionSignal: string | undefined,
  iterationsRun: number,
): { readonly message: string; readonly severity: Severity } => {
  if (completionSignal !== undefined) {
    return {
      message: `Run complete: agent finished after ${iterationsRun} iteration(s).`,
      severity: "success",
    };
  }
  return {
    message: `Run complete: reached ${iterationsRun} iteration(s) without completion signal.`,
    severity: "warn",
  };
};

/**
 * Format the context window size from an iteration's usage data.
 * Returns a string like "103k" representing the total context tokens
 * rounded up to the nearest 1000, or undefined when no token data is present.
 *
 * Prefers `contextTokens` (ACP `usage_update` running fill) when set, then
 * falls back to the CLI path's per-turn sum
 * (inputTokens + cacheCreationInputTokens + cacheReadInputTokens).
 * Returns undefined when all relevant fields are zero or absent
 * (e.g. Bob 2.x `bob run`, which does not report token counts at all).
 */
export const formatContextWindowSize = (
  usage: IterationUsage,
): string | undefined => {
  if (usage.contextTokens !== undefined && usage.contextTokens > 0) {
    return `${Math.ceil(usage.contextTokens / 1000)}k`;
  }
  const total =
    usage.inputTokens +
    usage.cacheCreationInputTokens +
    usage.cacheReadInputTokens;
  return total > 0 ? `${Math.ceil(total / 1000)}k` : undefined;
};

/**
 * Build "Context window: NNNk" lines for iterations that have usage data
 * with a non-zero token total. Returns an empty array when no iterations
 * carry token counts (e.g. Bob 2.x, which reports cost/duration instead).
 */
export const buildContextWindowLines = (
  iterations: readonly Pick<IterationResult, "usage">[],
): string[] =>
  iterations
    .filter((it): it is { usage: IterationUsage } => it.usage !== undefined)
    .flatMap((it) => {
      const size = formatContextWindowSize(it.usage);
      return size !== undefined ? [`Context window: ${size}`] : [];
    });
