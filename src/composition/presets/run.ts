/**
 * `run()` — the top-level preset built on the internal `orchestrate()`
 * engine (`application/orchestration/Orchestrator.ts`).
 *
 * One-shot: creates its own sandbox (and worktree, if the branch strategy
 * needs one), runs the agent, then tears everything down — all within this
 * single call. If you need a workspace that outlives one agent invocation
 * (reused across several `.run()` calls, inspected, or handed to another
 * task), use `createWorktree()` / `createSandbox()` instead and call
 * `.run()` on the handle they return — a different method from this one,
 * which reuses the existing sandbox rather than creating a new one.
 *
 * This file lives in `composition/` (L5, composition roots): the layer
 * allowed to import `platform/` and perform real I/O — everything below it
 * (`application/`, `ports/`, `spi/`) stays free of `node:child_process`,
 * `console.*`, and other platform calls, going through ports instead. That's
 * also why `withHooks`/`withWorktree` sit here rather than next to
 * `iterate`/`invokeAgent` in `application/orchestration/` (platform-I/O-free) —
 * the directory split tracks I/O privilege, not public vs. internal.
 * `scripts/check-architecture.mjs` enforces the layer order and the I/O rule
 * mechanically; see its header comment for the full layer table.
 */

import { Effect, Layer } from "effect";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";
import { resolveCwd } from "../../utils/resolveCwd.js";
import { resolveBranchStrategy } from "../../application/sandbox/lifecycle/providerTraits.js";
import type { AgentProvider } from "../../spi/AgentProvider.js";
import { ClackDisplay } from "../../platform/node/displays.js";
import { Display } from "../../ports/Display.js";
import {
  orchestrate,
  type IterationResult,
  type OrchestrateResult,
} from "../../application/orchestration/Orchestrator.js";
import { resolvePrompt } from "../../application/prompts/PromptResolver.js";
import {
  WorktreeDockerSandboxFactory,
  SandboxConfig,
} from "../../application/sandbox/lifecycle/SandboxFactory.js";
import type {
  SandboxProvider,
  BranchStrategy,
} from "../../spi/SandboxProvider.js";
import { resolveEnv } from "../../application/sandbox/lifecycle/EnvResolver.js";
import { formatErrorMessage } from "../../errors/ErrorHandler.js";
import type { SandboxError } from "../../errors/errors.js";
import { agentStreamEmitterLayer } from "../../application/display/AgentStreamEmitter.js";
import type { SandboxHooks, Timeouts } from "../../ports/lifecycleConfig.js";
import { mergeProviderEnv } from "../../application/sandbox/mergeProviderEnv.js";
import {
  generateTempBranchName,
  getCurrentBranch,
} from "../../application/sandbox/worktree/WorktreeManager.js";
import {
  type PromptArgs,
  applyPromptArgs,
} from "../../application/prompts/PromptArgumentSubstitution.js";
import type {
  OutputDefinition,
  OutputObjectDefinition,
  OutputStringDefinition,
} from "../../application/prompts/StructuredOutput.js";
import { extractStructuredOutput } from "../../application/prompts/extractStructuredOutput.js";
import type { LoggingOption } from "../../application/orchestration/RunConfig.js";
import {
  DEFAULT_MAX_ITERATIONS,
  buildRunSummaryRows,
  buildCompletionMessage,
  buildContextWindowLines,
  resolveLogging,
} from "../../application/orchestration/RunDisplay.js";
import { buildAgentStreamHandler, buildRunDisplayLayer } from "./runOutput.js";
import { runWithHost } from "./runWithHost.js";

// `LoggingOption` and the display/logging helpers above live in
// `./RunConfig.js`/`./RunDisplay.js` so `createSandbox.ts` and
// `createWorktree.ts` can share them without depending on this file.

export interface RunOptions<A extends AgentProvider = AgentProvider> {
  /** Agent provider to use (e.g. bob("default")) */
  readonly agent: A;
  /** Sandbox provider (e.g. docker({ imageName: "arsenal:myrepo" })). */
  readonly sandbox: SandboxProvider;
  /**
   * Host repo directory. Replaces `process.cwd()` as the anchor for
   * `.arsenal/worktrees/`, `.arsenal/.env`, `.arsenal/logs/`,
   * `.arsenal/patches/`, and git operations.
   *
   * - Relative paths are resolved against `process.cwd()`.
   * - Absolute paths are used as-is.
   * - Defaults to `process.cwd()` when omitted.
   */
  readonly cwd?: string;
  /** Inline prompt string (mutually exclusive with promptFile) */
  readonly prompt?: string;
  /**
   * Path to a prompt file (mutually exclusive with prompt).
   *
   * **Note:** `promptFile` is always resolved against `process.cwd()`, not
   * against the `cwd` option. If you set a custom `cwd`, pass an absolute
   * `promptFile` to avoid ambiguity.
   */
  readonly promptFile?: string;
  /** Maximum iterations to run (default: 1) */
  readonly maxIterations?: number;
  /** Lifecycle hooks grouped by execution location (host or sandbox). */
  readonly hooks?: SandboxHooks;
  /** Key-value map for {{KEY}} placeholder substitution in prompts */
  readonly promptArgs?: PromptArgs;
  /** Logging mode (default: { type: 'file' } with auto-generated path under .arsenal/logs/) */
  readonly logging?: LoggingOption;
  /** Substring(s) the agent emits to stop the iteration loop early. Matched via `includes` against agent output. (default: `"<promise>COMPLETE</promise>"`) */
  readonly completionSignal?: string | string[];
  /** Idle timeout in seconds. If the agent produces no output for this long, it fails. Default: 600 (10 minutes) */
  readonly idleTimeoutSeconds?: number;
  /**
   * Grace window in seconds after a completion signal is observed in the
   * agent's output. The agent process is expected to exit shortly after
   * emitting the signal; if it does not (typically because a spawned child —
   * a `gh`/git subprocess or long-lived MCP server — keeps stdout open),
   * Arsenal force-completes the iteration with a warning. Resets on every
   * subsequent output line so trailing data (token-usage events, terminal
   * `result` events, structured-output tags) is still captured. Independent
   * of `idleTimeoutSeconds`. Default: 60.
   */
  readonly completionTimeoutSeconds?: number;
  /** Optional name for the run, shown as a prefix in log output */
  readonly name?: string;
  /** Paths relative to the host repo root to copy into the worktree before sandbox start. */
  readonly copyToWorktree?: string[];
  /** Branch strategy — controls how the agent's changes relate to branches.
   * Defaults to { type: "head" } for bind-mount providers and { type: "merge-to-head" } for isolated providers. */
  readonly branchStrategy?: BranchStrategy;
  /**
   * An `AbortSignal` that cancels the run when aborted.
   *
   * - If `signal.aborted` is already `true` at entry, `run()` rejects
   *   immediately without doing any setup work.
   * - Aborting mid-iteration kills the in-flight agent subprocess.
   * - Phase boundaries (between iterations) also check the signal.
   * - The rejected promise surfaces `signal.reason` via
   *   `signal.throwIfAborted()` — no Arsenal-specific wrapping.
   * - The worktree is preserved on disk after abort (error-path behavior).
   */
  readonly signal?: AbortSignal;
  /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
  readonly timeouts?: Timeouts;
  /**
   * Number of additional attempts per iteration when the agent fails with an
   * `AgentError` or `AgentIdleTimeoutError` (e.g. SSH disconnect, non-zero exit,
   * idle timeout). Each retry creates a completely fresh sandbox, so lifecycle
   * is unaffected. Default: `0` (no retries).
   */
  readonly iterationRetries?: number;
  /**
   * Structured output definition. When provided, the agent's stdout is
   * scanned for the configured XML tag after the iteration completes, and the
   * result is parsed/validated and returned on `RunResult.output`.
   *
   * Use `Output.object({ tag, schema })` for JSON+schema or
   * `Output.string({ tag })` for raw string extraction.
   *
   * Constraints:
   * - `maxIterations` must be `1` (the default): `RunResult.output` is a
   *   single value, and nothing here would arbitrate which iteration's tag
   *   should win if more than one emitted it.
   * - The resolved prompt must contain the configured opening tag literal.
   */
  readonly output?: OutputDefinition;
}

export type {
  IterationResult,
  IterationUsage,
} from "../../application/orchestration/Orchestrator.js";

export interface RunResult {
  /** Per-iteration results (use `iterations.length` for the count). */
  readonly iterations: IterationResult[];
  /** The matched completion signal string, or undefined if no signal fired before the iteration limit. */
  readonly completionSignal?: string;
  /** Combined stdout output from all agent iterations. */
  readonly stdout: string;
  /** List of commits made by the agent during the run, each identified by its SHA. */
  readonly commits: { sha: string }[];
  /** The branch name the agent worked on inside the sandbox. */
  readonly branch: string;
  /** Path to the log file, if logging was drained to a file. */
  readonly logFilePath?: string;
  /** Host path to the preserved worktree, set when the run succeeded but the worktree had uncommitted changes. */
  readonly preservedWorktreePath?: string;
}

/** Overload: with `Output.object`, returns `RunResult` with typed `output: T`. */
export function run<T, A extends AgentProvider>(
  options: RunOptions<A> & { output: OutputObjectDefinition<T> },
): Promise<RunResult & { output: T }>;
/** Overload: with `Output.string`, returns `RunResult` with `output: string`. */
export function run<A extends AgentProvider>(
  options: RunOptions<A> & { output: OutputStringDefinition },
): Promise<RunResult & { output: string }>;
/** Overload: without `output`, returns the standard `RunResult`. */
export function run<A extends AgentProvider>(
  options: RunOptions<A>,
): Promise<RunResult>;
export async function run(
  options: RunOptions,
): Promise<RunResult & { output?: unknown }> {
  // If signal is already aborted, reject immediately without any setup
  options.signal?.throwIfAborted();

  const {
    prompt,
    promptFile,
    maxIterations = DEFAULT_MAX_ITERATIONS,
    hooks,
    agent: provider,
  } = options;

  const branchStrategy = resolveBranchStrategy(
    options.sandbox,
    options.branchStrategy,
  );
  const effectiveBranchType = branchStrategy.type;

  // Validate: copyToWorktree is incompatible with head strategy
  if (
    effectiveBranchType === "head" &&
    options.copyToWorktree &&
    options.copyToWorktree.length > 0
  ) {
    throw new Error(
      "copyToWorktree is not supported with head branch strategy. " +
        "In head mode the host working directory is bind-mounted directly.",
    );
  }

  // Validate: output requires maxIterations === 1
  if (options.output && maxIterations !== 1) {
    throw new Error(
      "output requires maxIterations to be 1. " +
        "Structured output is only supported for single-iteration runs.",
    );
  }

  // Extract explicit branch when in branch mode
  const branch: string | undefined =
    branchStrategy.type === "branch" ? branchStrategy.branch : undefined;

  // Resolve cwd/prompt/env/current-branch in one Effect instead of four
  // separate runWithHost round-trips. `resolveCwd` and `resolvePrompt` are
  // mutually independent (resolvePrompt doesn't need hostRepoDir), so they
  // run concurrently; `resolveEnv` and `getCurrentBranch` both need
  // hostRepoDir but not each other, so they also run concurrently once it's
  // resolved. Each pair runs via `Effect.either` so both always complete
  // rather than one interrupting the other on failure — that lets us report
  // errors in the same priority order the original sequential calls had
  // (resolveCwd before resolvePrompt, resolveEnv before getCurrentBranch)
  // instead of whichever happens to fail first in wall-clock time.
  const { hostRepoDir, resolved, resolvedEnv, currentHostBranch } =
    await runWithHost(
      Effect.gen(function* () {
        const [cwdResult, promptResult] = yield* Effect.all(
          [
            resolveCwd(options.cwd).pipe(
              Effect.provide(NodeFileSystem),
              Effect.either,
            ),
            resolvePrompt({ prompt, promptFile }).pipe(
              Effect.provide(NodeFileSystem),
              Effect.either,
            ),
          ],
          { concurrency: "unbounded" },
        );
        if (cwdResult._tag === "Left") return yield* Effect.fail(cwdResult.left);
        const hostRepoDir = cwdResult.right;
        if (promptResult._tag === "Left") {
          return yield* Effect.fail(promptResult.left);
        }
        const resolved = promptResult.right;

        const [envResult, branchResult] = yield* Effect.all(
          [
            resolveEnv(hostRepoDir).pipe(
              Effect.provide(NodeFileSystem),
              Effect.either,
            ),
            getCurrentBranch(hostRepoDir).pipe(Effect.either),
          ],
          { concurrency: "unbounded" },
        );
        if (envResult._tag === "Left") return yield* Effect.fail(envResult.left);
        const resolvedEnv = envResult.right;
        if (branchResult._tag === "Left") {
          return yield* Effect.fail(branchResult.left);
        }
        const currentHostBranch = branchResult.right;

        return { hostRepoDir, resolved, resolvedEnv, currentHostBranch };
      }),
    );

  const rawPrompt = resolved.text;
  const isInlinePrompt = resolved.source === "inline";

  // Validate: output tag must appear in the resolved prompt
  if (options.output) {
    const openTag = `<${options.output.tag}>`;
    if (!rawPrompt.includes(openTag)) {
      throw new Error(
        `output tag <${options.output.tag}> not found in the resolved prompt. ` +
          "The caller must instruct the agent to emit the configured tag.",
      );
    }
  }

  const agentName = provider.name;

  // Merge resolved env vars with provider env.
  const env = mergeProviderEnv({
    resolvedEnv,
    agentProviderEnv: provider.env,
    sandboxProviderEnv: options.sandbox.env,
  });

  // `currentHostBranch` (captured above) feeds the TARGET_BRANCH built-in
  // prompt argument. When using a temp branch, it also prefixes the log filename.

  // When in merge-to-head mode, generate a temporary branch name.
  // In head mode, use the host's current branch directly (no worktree).
  const resolvedBranch =
    effectiveBranchType === "head"
      ? currentHostBranch
      : (branch ?? generateTempBranchName(options.name));

  // When using a temp branch, prefix the log filename with the target branch
  // (the host's current branch) so developers can tell which branch was targeted.
  const targetBranch =
    effectiveBranchType === "merge-to-head" ? currentHostBranch : undefined;

  const resolvedLogging = resolveLogging({
    logging: options.logging,
    hostRepoDir,
    branch: resolvedBranch,
    targetBranch,
    name: options.name,
  });
  const displayLayer = buildRunDisplayLayer(
    resolvedLogging,
    { agentName: options.name, branch: resolvedBranch, hostRepoDir },
    ClackDisplay.layer,
  );

  const factoryLayer = Layer.provide(
    WorktreeDockerSandboxFactory.layer,
    Layer.mergeAll(
      Layer.succeed(SandboxConfig, {
        env,
        hostRepoDir,
        copyToWorktree: options.copyToWorktree,
        name: options.name,
        sandboxProvider: options.sandbox,
        branchStrategy,
        hooks,
        signal: options.signal,
        timeouts: options.timeouts,
      }),
      NodeFileSystem,
      displayLayer,
    ),
  );

  const streamEmitterLayer = agentStreamEmitterLayer(
    buildAgentStreamHandler(resolvedLogging),
  );

  const runLayer = Layer.mergeAll(
    factoryLayer,
    displayLayer,
    streamEmitterLayer,
  );

  const baseEffect = Effect.gen(function* () {
    const d = yield* Display;
    yield* d.intro(options.name ?? "arsenal");
    const rows = buildRunSummaryRows({
      name: options.name,
      agentName,
      sandboxName: options.sandbox.name,
      maxIterations,
      branch: resolvedBranch,
    });
    yield* d.summary("Arsenal Run", rows);

    const resolvedPrompt = yield* applyPromptArgs({
      rawPrompt,
      isInlinePrompt,
      userArgs: options.promptArgs ?? {},
      builtIns: {
        SOURCE_BRANCH: resolvedBranch,
        TARGET_BRANCH: currentHostBranch,
      },
    });

    // In head mode, pass the host branch so SandboxLifecycle skips the merge step.
    // In merge-to-head mode, branch is undefined (triggers merge). In branch mode, it's the explicit branch.
    const orchestrateBranch =
      effectiveBranchType === "head" ? currentHostBranch : branch;

    const orchestrateResult = yield* orchestrate({
      hostRepoDir,
      iterations: maxIterations,
      hooks,
      prompt: resolvedPrompt,
      branch: orchestrateBranch,
      provider,
      completionSignal: options.completionSignal,
      idleTimeoutSeconds: options.idleTimeoutSeconds,
      completionTimeoutSeconds: options.completionTimeoutSeconds,
      name: options.name,
      signal: options.signal,
      skipPromptExpansion: isInlinePrompt,
      timeouts: options.timeouts,
      iterationRetries: options.iterationRetries,
    });

    const completion = buildCompletionMessage(
      orchestrateResult.completionSignal,
      orchestrateResult.iterations.length,
    );
    yield* d.status(completion.message, completion.severity);

    for (const line of buildContextWindowLines(orchestrateResult.iterations)) {
      yield* d.text(line);
    }

    return orchestrateResult;
  });

  // In file-logging mode, write errors to the log before they propagate.
  // In stdout mode (ClackDisplay), errors are not printed here — they reject
  // run()'s promise and the caller decides how to present them.
  const withErrorLog =
    resolvedLogging.type === "file"
      ? baseEffect.pipe(
          Effect.tapError((error) =>
            Effect.gen(function* () {
              const d = yield* Display;
              yield* d.status(
                formatErrorMessage(error as SandboxError),
                "error",
              );
            }),
          ),
        )
      : baseEffect;

  let result: OrchestrateResult;
  try {
    result = await runWithHost(withErrorLog.pipe(Effect.provide(runLayer)));
  } catch (error: unknown) {
    // If the signal was aborted, surface its reason verbatim (no wrapping)
    options.signal?.throwIfAborted();
    throw error;
  }

  const baseResult = {
    ...result,
    logFilePath:
      resolvedLogging.type === "file" ? resolvedLogging.path : undefined,
  };

  // Extract structured output after the iteration completes (separate pass from completion signal)
  if (options.output) {
    // Structured output runs are single-iteration, so the last iteration is the
    // one that produced this stdout. Carry its session id onto the error.
    const lastIteration = baseResult.iterations.at(-1);
    const output = await extractStructuredOutput(
      baseResult.stdout,
      options.output,
      {
        commits: baseResult.commits,
        branch: baseResult.branch,
        preservedWorktreePath: baseResult.preservedWorktreePath,
        sessionId: lastIteration?.sessionId,
      },
    );
    return { ...baseResult, output };
  }

  return baseResult;
}
