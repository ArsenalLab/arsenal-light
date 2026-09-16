/**
 * withWorktree — standalone primitive for git-isolated agent execution.
 *
 * Creates a fresh git worktree (branch), runs your callback inside it,
 * then merges/commits/cleans up. Everything about git branch isolation
 * lives here — nothing about what the agent does inside.
 *
 * This is an opt-in layer. Use it when you want branch isolation.
 * Skip it when you don't (e.g. direct no-sandbox runs).
 *
 * @example
 * ```typescript
 * // With worktree isolation — agent runs on its own branch
 * const result = await withWorktree(
 *   { hostRepoDir: process.cwd(), branch: "my-feature" },
 *   async (ctx) => {
 *     return await invokeAgent({ executor: ctx.executor, cwd: ctx.cwd, ... });
 *   },
 * );
 * console.log(result.commits, result.branch);
 *
 * // Without — just call invokeAgent directly, no worktree
 * const result = await invokeAgent({ executor: localExecutor(cwd), cwd, ... });
 * ```
 */

import { Effect, Layer } from "effect";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";
import type { SandboxHooks, Timeouts } from "../../ports/lifecycleConfig.js";
import { withSandboxLifecycle } from "../../application/sandbox/lifecycle/SandboxLifecycle.js";
import {
  SandboxFactory,
  SandboxConfig,
  WorktreeDockerSandboxFactory,
} from "../../application/sandbox/lifecycle/SandboxFactory.js";
import {
  sandboxExecutor,
  toSandboxCommands,
  type SandboxCommands,
} from "../../ports/SandboxOps.js";
import type { AgentExecutor } from "../../ports/AgentExecutor.js";
import { ClackDisplay } from "../../platform/node/displays.js";
import { agentStreamEmitterLayer } from "../../application/display/AgentStreamEmitter.js";
import type {
  SandboxProvider,
  BranchStrategy,
} from "../../spi/SandboxProvider.js";
import { resolveEnv } from "../../application/sandbox/lifecycle/EnvResolver.js";
import { resolveCwd } from "../../utils/resolveCwd.js";
import { resolveBranchStrategy } from "../../application/sandbox/lifecycle/providerTraits.js";
import { mergeProviderEnv } from "../../application/sandbox/mergeProviderEnv.js";
import type { AgentProvider } from "../../spi/AgentProvider.js";
import { runPromiseUnwrapped } from "../../ports/runEffect.js";
import { NodeHostProcess } from "../../platform/node/NodeHostProcess.js";

/** Context passed to the callback inside withWorktree. */
export interface WorktreeContext {
  /**
   * Executor for `invokeAgent` — the minimal exec interface for this worktree.
   * Use `ctx.executor` with `invokeAgent({ executor: ctx.executor, ... })`.
   */
  readonly executor: AgentExecutor;
  /**
   * Underlying sandbox service. Available if you need sandbox-specific
   * operations (copyIn, copyFileOut, hooks). For `invokeAgent`, prefer `executor`.
   */
  readonly sandbox: SandboxCommands;
  /** Absolute path to the repo root inside the sandbox/worktree. */
  readonly cwd: string;
}

/** Result returned by withWorktree after the callback completes. */
export interface WithWorktreeResult<A> {
  readonly value: A;
  /** Commits created during the run. */
  readonly commits: { sha: string }[];
  /** The branch name used. */
  readonly branch: string;
  /** Host path to the preserved worktree when uncommitted changes remain. */
  readonly preservedWorktreePath?: string;
}

/** Options for withWorktree. */
export interface WithWorktreeOptions {
  /**
   * The agent provider — used only to resolve env vars, merged into the
   * sandbox once at creation time, before `work` runs. If `work` invokes
   * `invokeAgent()` with a *different* provider (or several), pass whichever
   * provider(s) you actually invoke inside `work` here too, or that
   * provider's `env` won't reach the sandbox.
   */
  readonly agent: AgentProvider;
  /** The sandbox provider. */
  readonly sandbox: SandboxProvider;
  /** Host-side repo root. Defaults to process.cwd(). */
  readonly cwd?: string;
  /** Branch strategy. Defaults to `merge-to-head` for isolated, `head` for bind-mount. */
  readonly branchStrategy?: BranchStrategy;
  /** Explicit branch name (used with `branch` strategy). */
  readonly branch?: string;
  /** Lifecycle hooks. */
  readonly hooks?: SandboxHooks;
  /** AbortSignal to cancel. */
  readonly signal?: AbortSignal;
  /** Override built-in lifecycle step timeouts. */
  readonly timeouts?: Timeouts;
  /** Name prefix for auto-generated branch/worktree names. */
  readonly name?: string;
  /** Paths relative to host repo root to copy into the worktree. */
  readonly copyToWorktree?: string[];
}

/**
 * Run a callback inside a git-isolated worktree.
 *
 * Creates the worktree, runs `work`, then handles git lifecycle
 * (merge/commit collection/cleanup). The callback receives a `WorktreeContext`
 * with a sandbox service and the cwd path inside the worktree.
 */
export async function withWorktree<A>(
  options: WithWorktreeOptions,
  work: (ctx: WorktreeContext) => Promise<A>,
): Promise<WithWorktreeResult<A>> {
  const branchStrategy = resolveBranchStrategy(
    options.sandbox,
    options.branchStrategy,
  );

  const hostRepoDir = await Effect.runPromise(
    resolveCwd(options.cwd).pipe(Effect.provide(NodeFileSystem)),
  );

  const resolvedEnv = await Effect.runPromise(
    resolveEnv(hostRepoDir).pipe(Effect.provide(NodeFileSystem)),
  );
  const env = mergeProviderEnv({
    resolvedEnv,
    agentProviderEnv: options.agent.env,
    sandboxProviderEnv: options.sandbox.env,
  });

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
        hooks: options.hooks,
        signal: options.signal,
        timeouts: options.timeouts,
      }),
      NodeFileSystem,
      ClackDisplay.layer,
    ),
  );

  const runLayer = Layer.mergeAll(
    factoryLayer,
    ClackDisplay.layer,
    agentStreamEmitterLayer(() => {}),
  );

  const program = Effect.gen(function* () {
    const factory = yield* SandboxFactory;

    const sandboxResult = yield* factory.withSandbox(
      ({ sandboxRepoPath, hostWorktreePath, applyToHost }, sandbox) =>
        withSandboxLifecycle(
          {
            hostRepoDir,
            sandboxRepoDir: sandboxRepoPath,
            hooks: options.hooks,
            // Named-branch strategies carry the branch on the strategy
            // itself; derive it from there so the lifecycle doesn't fall
            // back to merge-to-head just because the caller didn't also
            // duplicate it onto `options.branch`.
            branch:
              branchStrategy.type === "branch"
                ? branchStrategy.branch
                : options.branch,
            hostWorktreePath,
            applyToHost,
            signal: options.signal,
            timeouts: options.timeouts,
          },
          sandbox,
          // The callback's own errors are not SandboxErrors: carry them as
          // defects so they reach the caller unchanged (see below).
          (ctx) => {
            const sandbox = toSandboxCommands(ctx.sandbox);
            return Effect.promise(() =>
              work({
                executor: sandboxExecutor(sandbox),
                sandbox,
                cwd: ctx.sandboxRepoDir,
              }),
            );
          },
        ),
    );

    const lifecycleResult = sandboxResult.value;
    return {
      value: lifecycleResult.result,
      commits: lifecycleResult.commits,
      branch: lifecycleResult.branch,
      preservedWorktreePath: sandboxResult.preservedWorktreePath,
    };
  }).pipe(Effect.provide(runLayer));

  // Reject with the original error (a lifecycle SandboxError or whatever
  // `work` threw), not Effect's FiberFailure wrapper.
  return runPromiseUnwrapped(Effect.provide(program, NodeHostProcess.layer));
}
