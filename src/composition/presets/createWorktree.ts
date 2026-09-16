import { Effect, Layer } from "effect";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";
import type { AgentProvider } from "../../spi/AgentProvider.js";
import { ClackDisplay } from "../../platform/node/displays.js";
import { Display } from "../../ports/Display.js";
import { preprocessPrompt } from "../../application/prompts/PromptPreprocessor.js";
import { resolvePrompt } from "../../application/prompts/PromptResolver.js";
import {
  SandboxFactory,
  startSandboxAgainstTarget,
} from "../../application/sandbox/lifecycle/SandboxFactory.js";
import { alertWorktreePreserved } from "../../application/sandbox/lifecycle/sandboxAlerts.js";
import { withSandboxLifecycle } from "../../application/sandbox/lifecycle/SandboxLifecycle.js";
import { runHostHooks } from "../../application/sandbox/lifecycle/hooks.js";
import type { SandboxHooks, Timeouts } from "../../ports/lifecycleConfig.js";
import type {
  AnySandboxProvider,
  SandboxProvider,
  MergeToHeadBranchStrategy,
  NamedBranchStrategy,
} from "../../spi/SandboxProvider.js";
import type { CloseResult, Sandbox } from "./Sandbox.js";
import { createSandboxFromWorktree } from "./createSandbox.js";
import { buildAgentStreamHandler, buildRunDisplayLayer } from "./runOutput.js";
import {
  buildCompletionMessage,
  buildContextWindowLines,
  resolveLogging,
} from "../../application/orchestration/RunDisplay.js";
import type { LoggingOption } from "../../application/orchestration/RunConfig.js";
import {
  orchestrate,
  type IterationResult,
} from "../../application/orchestration/Orchestrator.js";
import { agentStreamEmitterLayer } from "../../application/display/AgentStreamEmitter.js";
import { resolveEnv } from "../../application/sandbox/lifecycle/EnvResolver.js";
import { mergeProviderEnv } from "../../application/sandbox/mergeProviderEnv.js";
import * as WorktreeManager from "../../application/sandbox/worktree/WorktreeManager.js";
import { copyToWorktree } from "../../application/sandbox/worktree/CopyToWorktree.js";
import { resolveCwd } from "../../utils/resolveCwd.js";
import {
  type PromptArgs,
  applyPromptArgs,
} from "../../application/prompts/PromptArgumentSubstitution.js";
import { raceAbortSignal } from "../../utils/raceAbortSignal.js";
import { NodeHostProcess } from "../../platform/node/NodeHostProcess.js";

/** Branch strategies valid for createWorktree — head is excluded. */
export type WorktreeBranchStrategy =
  | MergeToHeadBranchStrategy
  | NamedBranchStrategy;

export interface CreateWorktreeOptions {
  /** Branch strategy — only 'branch' and 'merge-to-head' are allowed. */
  readonly branchStrategy: WorktreeBranchStrategy;
  /**
   * Host repo directory. Replaces `process.cwd()` as the anchor for
   * `.arsenal/worktrees/`, `.arsenal/.env`, and git operations.
   *
   * - Relative paths are resolved against `process.cwd()`.
   * - Absolute paths are used as-is.
   * - Defaults to `process.cwd()` when omitted.
   */
  readonly cwd?: string;
  /** Paths relative to the host repo root to copy into the worktree at creation time. */
  readonly copyToWorktree?: string[];
  /** Lifecycle hooks grouped by execution location (host or sandbox).
   *  Only `host.onWorktreeReady` is executed here — other hooks are passed
   *  through to whichever of the returned `Worktree`'s `.runAgent()` or
   *  `.attachSandbox()` calls you make afterward. */
  readonly hooks?: SandboxHooks;
  /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
  readonly timeouts?: Timeouts;
}

export interface WorktreeRunOptions {
  /** Agent provider to use (e.g. bob("default")) */
  readonly agent: AgentProvider;
  /** Sandbox provider (e.g. docker()). Required — an unattended agent should always run inside a sandbox. */
  readonly sandbox: SandboxProvider;
  /** Inline prompt string (mutually exclusive with promptFile). */
  readonly prompt?: string;
  /** Path to a prompt file (mutually exclusive with prompt). */
  readonly promptFile?: string;
  /** Key-value map for {{KEY}} placeholder substitution in prompts */
  readonly promptArgs?: PromptArgs;
  /** Maximum iterations to run (default: 1). */
  readonly maxIterations?: number;
  /** Substring(s) the agent emits to stop the iteration loop early. */
  readonly completionSignal?: string | string[];
  /** Idle timeout in seconds. Default: 600. */
  readonly idleTimeoutSeconds?: number;
  /** Grace window in seconds after a completion signal is observed but the agent process has not exited — e.g. a spawned `gh`/git subprocess or long-lived MCP server inherited the exec's stdout pipe and is keeping it open. Default: 60. */
  readonly completionTimeoutSeconds?: number;
  /** Optional name for the run. */
  readonly name?: string;
  /** Logging mode. */
  readonly logging?: LoggingOption;
  /** Hooks to run during sandbox lifecycle */
  readonly hooks?: SandboxHooks;
  /** Environment variables to inject into the sandbox. */
  readonly env?: Record<string, string>;
  /**
   * Number of additional attempts per iteration when the agent fails with an
   * agent error or idle timeout. Each retry spins up a completely fresh
   * sandbox. Default: 0 (no retries — fail immediately on first error). See
   * `OrchestrateOptions.iterationRetries` for full semantics.
   */
  readonly iterationRetries?: number;
  /**
   * An `AbortSignal` that cancels the run when aborted.
   *
   * - If `signal.aborted` is already `true` at entry, rejects immediately
   *   without doing any setup work.
   * - Aborting mid-iteration kills the in-flight agent subprocess.
   * - The worktree is preserved on disk after abort.
   * - The `Worktree` handle remains usable for subsequent operations.
   */
  readonly signal?: AbortSignal;
}

export interface WorktreeRunResult {
  /** Per-iteration results (use `iterations.length` for the count). */
  readonly iterations: IterationResult[];
  /** The matched completion signal string, or undefined if none fired. */
  readonly completionSignal?: string;
  /** Combined stdout output from all agent iterations. */
  readonly stdout: string;
  /** List of commits made by the agent during the run. */
  readonly commits: { sha: string }[];
  /** The branch name the agent worked on. */
  readonly branch: string;
  /** Path to the log file, if logging was drained to a file. */
  readonly logFilePath?: string;
}

export interface WorktreeCreateSandboxOptions {
  /** Sandbox provider (e.g. docker({ imageName: "arsenal:myrepo" })). */
  readonly sandbox: SandboxProvider;
  /** Lifecycle hooks grouped by execution location (host or sandbox). */
  readonly hooks?: SandboxHooks;
  /** Paths relative to the host repo root to copy into the worktree at creation time. */
  readonly copyToWorktree?: string[];
  /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
  readonly timeouts?: Timeouts;
  /** @internal Test-only overrides to bypass the sandbox provider. */
  readonly _test?: {
    readonly buildSandbox?: (
      sandboxDir: string,
    ) => import("../../ports/SandboxOps.js").SandboxOps;
  };
}

export interface Worktree {
  /** The branch the worktree is on. */
  readonly branch: string;
  /** Host path to the worktree (worktree). */
  readonly worktreePath: string;
  /**
   * Run an agent inside *this* worktree — reuses the branch/worktree
   * `createWorktree()` already created here; never creates or removes a
   * worktree itself (unlike the top-level `run()`, which owns its own
   * worktree end-to-end for a single call). Safe to call repeatedly; only
   * `.close()` tears the worktree down. Named `runAgent` (not `run`)
   * precisely so it can't be confused with the top-level `run()`.
   */
  runAgent(options: WorktreeRunOptions): Promise<WorktreeRunResult>;
  /**
   * Attach a long-lived `Sandbox` to this existing worktree — reuse
   * semantics, same as `.runAgent()` above: no new worktree is created.
   * Contrast with the top-level `createSandbox()`, which creates its own new
   * worktree on an explicit branch. Named `attachSandbox` (not
   * `createSandbox`) precisely so it can't be confused with that.
   */
  attachSandbox(options: WorktreeCreateSandboxOptions): Promise<Sandbox>;
  /** Clean up the worktree. Preserves worktree if dirty. */
  close(): Promise<CloseResult>;
  /** Auto cleanup via `await using`. */
  [Symbol.asyncDispose](): Promise<void>;
}

/**
 * Creates a git worktree as an independent, first-class worktree.
 * Returns a Worktree handle with close() and [Symbol.asyncDispose]().
 *
 * Only accepts 'branch' and 'merge-to-head' strategies — 'head' is a
 * compile-time type error since head means no worktree.
 */
export const createWorktree = async (
  options: CreateWorktreeOptions,
): Promise<Worktree> => {
  const branch =
    options.branchStrategy.type === "branch"
      ? options.branchStrategy.branch
      : undefined;

  const baseBranch =
    options.branchStrategy.type === "branch"
      ? options.branchStrategy.baseBranch
      : undefined;

  // Captured for the worktree's run/interactive/createSandbox methods so they
  // can route the branch correctly into `SandboxLifecycle`: in `merge-to-head`
  // mode they pass `branch: undefined` (to trigger the merge step) plus
  // `keepSourceBranch: true` (so the worktree's source branch survives).
  const isMergeToHead = options.branchStrategy.type === "merge-to-head";

  const { hostRepoDir, worktreeInfo } = await Effect.gen(function* () {
    const hostRepoDir = yield* resolveCwd(options.cwd);
    yield* WorktreeManager.pruneStale(hostRepoDir).pipe(
      Effect.catchAll(() => Effect.void),
    );
    const info = yield* WorktreeManager.create(hostRepoDir, {
      branch,
      baseBranch,
    });
    if (options.copyToWorktree && options.copyToWorktree.length > 0) {
      yield* copyToWorktree(
        options.copyToWorktree,
        hostRepoDir,
        info.path,
        options.timeouts?.copyToWorktreeMs,
      );
    }
    // Run host.onWorktreeReady hooks after copyToWorktree, before sandbox creation
    if (options.hooks?.host?.onWorktreeReady?.length) {
      yield* runHostHooks(options.hooks.host.onWorktreeReady, info.path);
    }
    return { hostRepoDir, worktreeInfo: info };
  }).pipe(
    Effect.provide(ClackDisplay.layer),
    Effect.provide(NodeFileSystem),
    Effect.provide(NodeHostProcess.layer),
    Effect.runPromise,
  );

  let closed = false;

  const close = async (): Promise<CloseResult> => {
    if (closed) return { preservedWorktreePath: undefined };
    closed = true;

    return Effect.gen(function* () {
      const isDirty = yield* WorktreeManager.hasUncommittedChanges(
        worktreeInfo.path,
      ).pipe(Effect.catchAll(() => Effect.succeed(false)));

      if (isDirty) {
        // Matches SandboxFactory.ts's cleanupWorktree: tell the user a
        // worktree was left on disk instead of preserving it silently.
        yield* alertWorktreePreserved(
          worktreeInfo.path,
          `Worktree preserved at ${worktreeInfo.path}`,
        );
        return { preservedWorktreePath: worktreeInfo.path } as CloseResult;
      }

      yield* WorktreeManager.remove(worktreeInfo.path).pipe(
        Effect.catchAll(() => Effect.void),
      );

      return { preservedWorktreePath: undefined } as CloseResult;
    }).pipe(
      Effect.provide(ClackDisplay.layer),
      Effect.provide(NodeHostProcess.layer),
      Effect.runPromise,
    );
  };

  const worktreeRun = async (
    opts: WorktreeRunOptions,
  ): Promise<WorktreeRunResult> => {
    // If signal is already aborted, reject immediately without any setup
    opts.signal?.throwIfAborted();

    const { prompt, promptFile, hooks, agent: provider } = opts;
    const sandboxProvider = opts.sandbox;
    const maxIterations = opts.maxIterations ?? 1;

    const inner = Effect.gen(function* () {
      // 1. Resolve prompt
      const resolved = yield* resolvePrompt({ prompt, promptFile });
      const rawPrompt = resolved.text;
      const isInlinePrompt = resolved.source === "inline";

      // 2. Resolve env vars
      const resolvedEnv = yield* resolveEnv(hostRepoDir);
      const env = mergeProviderEnv({
        resolvedEnv,
        agentProviderEnv: provider.env,
        sandboxProviderEnv: sandboxProvider.env,
      });
      const effectiveEnv = { ...env, ...(opts.env ?? {}) };

      // 3. Prompt args substitution (skipped for inline prompts — passthrough)
      const resolvedPrompt = yield* applyPromptArgs({
        rawPrompt,
        isInlinePrompt,
        userArgs: opts.promptArgs ?? {},
        builtIns: {
          SOURCE_BRANCH: worktreeInfo.branch,
          TARGET_BRANCH: worktreeInfo.branch,
        },
      });

      // 4. Start a sandbox against the already-existing worktree — the
      // same per-provider-category setup the top-level run()/createSandbox()
      // use via acquireSandbox, exposed standalone here because this
      // worktree wasn't created for this one call: it's owned by
      // createWorktree() and may back many `.runAgent()` calls over its
      // lifetime.
      const { handle, sandbox, sandboxInfo } = yield* startSandboxAgainstTarget(
        {
          env: effectiveEnv,
          hostRepoDir,
          targetPath: worktreeInfo.path,
          sandboxProvider,
          hooks,
          signal: opts.signal,
          timeouts: options.timeouts,
        },
      );
      const sandboxRepoDir = sandboxInfo.sandboxRepoPath;

      // 5. Resolve logging
      const resolvedLogging = resolveLogging({
        logging: opts.logging,
        hostRepoDir,
        branch: worktreeInfo.branch,
        name: opts.name,
      });

      const runDisplayLayer = buildRunDisplayLayer(
        resolvedLogging,
        { agentName: opts.name, branch: worktreeInfo.branch, hostRepoDir },
        ClackDisplay.layer,
      );

      // 6. Build a SandboxFactory that reuses the started sandbox.
      // `sandboxInfo` already carries `applyToHost`
      // correctly per provider category — startSandboxAgainstTarget just
      // populated it — so there's no need to re-derive either by hand here.
      const reuseFactoryLayer = Layer.succeed(SandboxFactory, {
        withSandbox: (makeEffect) =>
          makeEffect(sandboxInfo, sandbox).pipe(
            Effect.map((value) => ({
              value,
              preservedWorktreePath: undefined,
            })),
          ) as any,
      });

      const streamEmitterLayer = agentStreamEmitterLayer(
        buildAgentStreamHandler(resolvedLogging),
      );

      const runLayer = Layer.mergeAll(
        reuseFactoryLayer,
        runDisplayLayer,
        streamEmitterLayer,
      );

      // 7. Run orchestration
      const result = yield* Effect.gen(function* () {
        const display = yield* Display;
        yield* display.intro(opts.name ?? "arsenal");

        const orchestrateResult = yield* orchestrate({
          hostRepoDir,
          iterations: maxIterations,
          hooks,
          prompt: resolvedPrompt,
          // merge-to-head: pass `undefined` so the lifecycle records the host's
          // current branch and routes through the merge step. branch strategy:
          // pin to the worktree's branch so commits stay there.
          branch: isMergeToHead ? undefined : worktreeInfo.branch,
          provider,
          completionSignal: opts.completionSignal,
          idleTimeoutSeconds: opts.idleTimeoutSeconds,
          completionTimeoutSeconds: opts.completionTimeoutSeconds,
          name: opts.name,
          iterationRetries: opts.iterationRetries,
          signal: opts.signal,
          skipPromptExpansion: isInlinePrompt,
          timeouts: options.timeouts,
          keepSourceBranch: isMergeToHead,
        });

        const completion = buildCompletionMessage(
          orchestrateResult.completionSignal,
          orchestrateResult.iterations.length,
        );
        yield* display.status(completion.message, completion.severity);

        for (const line of buildContextWindowLines(
          orchestrateResult.iterations,
        )) {
          yield* display.text(line);
        }

        return orchestrateResult;
      }).pipe(
        Effect.provide(runLayer),
        // Always close sandbox handle
        Effect.ensuring(Effect.promise(() => handle.close().catch(() => {}))),
      );

      return {
        iterations: result.iterations,
        completionSignal: result.completionSignal,
        stdout: result.stdout,
        commits: result.commits,
        branch: result.branch,
        logFilePath:
          resolvedLogging.type === "file" ? resolvedLogging.path : undefined,
      } satisfies WorktreeRunResult;
    });

    try {
      return await Effect.runPromise(
        inner.pipe(
          Effect.provide(ClackDisplay.layer),
          Effect.provide(NodeFileSystem),
          Effect.provide(NodeFileSystem),
          Effect.provide(NodeHostProcess.layer),
        ),
      );
    } catch (error: unknown) {
      // If the signal was aborted, surface its reason verbatim (no wrapping)
      opts.signal?.throwIfAborted();
      throw error;
    }
  };

  const worktreeCreateSandbox = async (
    opts: WorktreeCreateSandboxOptions,
  ): Promise<Sandbox> => {
    return createSandboxFromWorktree({
      branch: worktreeInfo.branch,
      worktreePath: worktreeInfo.path,
      hostRepoDir,
      sandbox: opts.sandbox,
      hooks: opts.hooks,
      copyToWorktree: opts.copyToWorktree,
      timeouts: opts.timeouts,
      branchStrategy: options.branchStrategy,
      _test: opts._test,
    });
  };

  return {
    branch: worktreeInfo.branch,
    worktreePath: worktreeInfo.path,
    runAgent: worktreeRun,
    attachSandbox: worktreeCreateSandbox,
    close,
    async [Symbol.asyncDispose]() {
      await close();
    },
  };
};
