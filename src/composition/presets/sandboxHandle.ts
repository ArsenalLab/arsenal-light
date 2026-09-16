/**
 * The long-lived `Sandbox` handle's methods — `.runAgent()`, `.interactive()`,
 * `.exec()` and `.close()` — shared by `createSandbox()` and
 * `createSandboxFromWorktree()`. These reuse the existing sandbox rather
 * than creating a new one; contrast with the top-level `run()`, which owns
 * its own sandbox end-to-end for a single call. `runAgent` is deliberately
 * not named `run` so it can't be confused with that top-level function.
 */

import { Effect, Layer, Ref } from "effect";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";
import { ClackDisplay, SilentDisplay } from "../../platform/node/displays.js";
import { Display, type DisplayEntry } from "../../ports/Display.js";
import { orchestrate } from "../../application/orchestration/Orchestrator.js";
import { TextDeltaBuffer } from "../../application/display/TextDeltaBuffer.js";
import { agentStreamEmitterLayer } from "../../application/display/AgentStreamEmitter.js";
import { applyPromptArgs } from "../../application/prompts/PromptArgumentSubstitution.js";
import { resolvePrompt } from "../../application/prompts/PromptResolver.js";
import { preprocessPrompt } from "../../application/prompts/PromptPreprocessor.js";
import { buildAgentStreamHandler, buildRunDisplayLayer } from "./runOutput.js";
import {
  buildCompletionMessage,
  buildContextWindowLines,
  resolveLogging,
} from "../../application/orchestration/RunDisplay.js";
import { withSandboxLifecycle } from "../../application/sandbox/lifecycle/SandboxLifecycle.js";
import type { Timeouts } from "../../ports/lifecycleConfig.js";
import { type SandboxOps } from "../../ports/SandboxOps.js";
import { SandboxFactory } from "../../application/sandbox/lifecycle/SandboxFactory.js";
import type {
  SandboxHandle,
  MergeToHeadBranchStrategy,
  NamedBranchStrategy,
  ExecResult,
} from "../../spi/SandboxProvider.js";
import * as WorktreeManager from "../../application/sandbox/worktree/WorktreeManager.js";
import { runAcpSession } from "../../application/acp/runAcpSession.js";
import { runWithHost } from "./runWithHost.js";
import type {
  CloseResult,
  Sandbox,
  SandboxExecOptions,
  SandboxInteractiveOptions,
  SandboxInteractiveResult,
  SandboxRunOptions,
  SandboxRunResult,
} from "./Sandbox.js";

/** @internal Context for building Sandbox handle methods. */
export interface SandboxHandleContext {
  readonly branch: string;
  readonly worktreePath: string;
  readonly hostRepoDir: string;
  readonly sandboxRepoDir: string;
  readonly sandbox: SandboxOps;
  readonly providerHandle: SandboxHandle | undefined;
  readonly applyToHost: () => Effect.Effect<void, any>;
  readonly timeouts?: Timeouts;
  /** Worktree branch strategy. Set only when the handle is backed by a
   *  `createWorktree(...)` handle; absent for top-level `createSandbox()`,
   *  which is always explicit-branch. When `type === "merge-to-head"`, each
   *  `.runAgent()`/`.interactive()` call routes through the lifecycle's merge
   *  step and the worktree's source branch is preserved across calls. */
  readonly branchStrategy?: MergeToHeadBranchStrategy | NamedBranchStrategy;
}

/**
 * @internal Builds a Sandbox handle with `.runAgent()` and `.interactive()`
 * methods (methods on the handle, not the top-level `run()` — see this
 * file's header comment). The close callback controls teardown behavior —
 * top-level createSandbox() cleans up both container and worktree, while
 * worktree-backed sandboxes only tear down the container.
 */
export const buildSandboxHandle = (
  ctx: SandboxHandleContext,
  close: () => Promise<CloseResult>,
): Sandbox => {
  const {
    branch,
    worktreePath,
    hostRepoDir,
    sandboxRepoDir,
    sandbox,
    providerHandle,
    applyToHost,
    timeouts,
    branchStrategy,
  } = ctx;
  // Routing for the lifecycle: in merge-to-head mode pass `branch: undefined`
  // (so the lifecycle records host's current branch and merges back) and keep
  // the worktree's source branch alive for subsequent calls. In all other
  // cases (top-level createSandbox, named-branch worktree) forward `branch`
  // as-is and let the lifecycle delete the temp branch normally.
  const mergeToHead = branchStrategy?.type === "merge-to-head";

  const sandboxHandle: Sandbox = {
    branch,
    worktreePath: worktreePath,

    runAgent: async (
      runOptions: SandboxRunOptions,
    ): Promise<SandboxRunResult> => {
      // If signal is already aborted, reject immediately without any setup
      runOptions.signal?.throwIfAborted();

      const {
        agent: provider,
        prompt,
        promptFile,
        maxIterations = 1,
      } = runOptions;

      const resolved = await runWithHost(
        resolvePrompt({ prompt, promptFile }).pipe(
          Effect.provide(NodeFileSystem),
        ),
      );
      const rawPrompt = resolved.text;
      const isInlinePrompt = resolved.source === "inline";

      const currentHostBranch = await runWithHost(
        WorktreeManager.getCurrentBranch(hostRepoDir),
      );

      const displayRef = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
      const silentDisplayLayer = SilentDisplay.layer(displayRef);

      const resolvedPrompt = await runWithHost(
        applyPromptArgs({
          rawPrompt,
          isInlinePrompt,
          userArgs: runOptions.promptArgs ?? {},
          builtIns: { SOURCE_BRANCH: branch, TARGET_BRANCH: currentHostBranch },
        }).pipe(Effect.provide(silentDisplayLayer)),
      );

      const resolvedLogging = resolveLogging({
        logging: runOptions.logging,
        hostRepoDir,
        branch,
        name: runOptions.name,
      });

      const runDisplayLayer = buildRunDisplayLayer(
        resolvedLogging,
        { agentName: runOptions.name, branch, hostRepoDir },
        silentDisplayLayer,
      );

      const reuseFactoryLayer = Layer.succeed(SandboxFactory, {
        withSandbox: (makeEffect) =>
          makeEffect(
            {
              hostWorktreePath: worktreePath,
              sandboxRepoPath: sandboxRepoDir,
              applyToHost,
            },
            sandbox,
          ).pipe(
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

      let result;
      try {
        result = await runWithHost(
          Effect.gen(function* () {
            const display = yield* Display;
            yield* display.intro(runOptions.name ?? "arsenal");

            const orchestrateResult = yield* orchestrate({
              hostRepoDir,
              iterations: maxIterations,
              prompt: resolvedPrompt,
              branch: mergeToHead ? undefined : branch,
              provider,
              completionSignal: runOptions.completionSignal,
              idleTimeoutSeconds: runOptions.idleTimeoutSeconds,
              completionTimeoutSeconds: runOptions.completionTimeoutSeconds,
              name: runOptions.name,
              iterationRetries: runOptions.iterationRetries,
              signal: runOptions.signal,
              skipPromptExpansion: isInlinePrompt,
              timeouts,
              keepSourceBranch: mergeToHead,
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
          }).pipe(Effect.provide(runLayer)),
        );
      } catch (error: unknown) {
        // If the signal was aborted, surface its reason verbatim
        runOptions.signal?.throwIfAborted();
        throw error;
      }

      return {
        iterations: result.iterations,
        completionSignal: result.completionSignal,
        stdout: result.stdout,
        commits: result.commits,
        logFilePath:
          resolvedLogging.type === "file" ? resolvedLogging.path : undefined,
      };
    },

    interactive: async (
      interactiveOptions: SandboxInteractiveOptions,
    ): Promise<SandboxInteractiveResult> => {
      // If signal is already aborted, reject immediately without any setup
      interactiveOptions.signal?.throwIfAborted();

      const { agent: provider, prompt, promptFile } = interactiveOptions;

      if (
        typeof provider.buildAcpArgs !== "function" ||
        typeof provider.parseAcpUpdate !== "function"
      ) {
        throw new Error(
          `Agent provider "${provider.name}" does not support buildAcpArgs or parseAcpUpdate, required for interactive sessions.`,
        );
      }

      if (!providerHandle?.interactiveExec) {
        throw new Error(
          `Sandbox provider does not support interactiveExec. ` +
            `The provider must implement the optional interactiveExec method to use .interactive().`,
        );
      }
      const interactiveExecFn =
        providerHandle.interactiveExec.bind(providerHandle);

      let lifecycleResult;
      try {
        lifecycleResult = await runWithHost(
          Effect.gen(function* () {
            const resolved = yield* resolvePrompt({ prompt, promptFile });
            const rawPrompt = resolved.text;
            const isInlinePrompt = resolved.source === "inline";

            const currentHostBranch =
              yield* WorktreeManager.getCurrentBranch(hostRepoDir);

            const resolvedPrompt = yield* applyPromptArgs({
              rawPrompt,
              isInlinePrompt,
              userArgs: interactiveOptions.promptArgs ?? {},
              builtIns: {
                SOURCE_BRANCH: branch,
                TARGET_BRANCH: currentHostBranch,
              },
            });

            return yield* withSandboxLifecycle(
              {
                hostRepoDir,
                sandboxRepoDir,
                branch: mergeToHead ? undefined : branch,
                hostWorktreePath: worktreePath,
                applyToHost,
                timeouts,
                keepSourceBranch: mergeToHead,
              },
              sandbox,
              (ctx) =>
                Effect.gen(function* () {
                  const fullPrompt = isInlinePrompt
                    ? resolvedPrompt
                    : yield* preprocessPrompt(
                        resolvedPrompt,
                        ctx.sandbox,
                        ctx.sandboxRepoDir,
                      );

                  // ACP path: drive the agent over JSON-RPC stdio.
                  const acpTextBuffer = new TextDeltaBuffer((chunk) => {
                    process.stdout.write(chunk);
                  });
                  const { exitCode } = yield* Effect.promise(() =>
                    runAcpSession({
                      provider,
                      interactiveExec: interactiveExecFn,
                      cwd: ctx.sandboxRepoDir,
                      prompt: fullPrompt,
                      onEvent: (event) => {
                        if (event.type === "text") {
                          acpTextBuffer.write(event.text);
                        } else if (event.type === "tool_call") {
                          acpTextBuffer.flush();
                          process.stdout.write(
                            `[tool] ${event.name}  ${event.args}\n`,
                          );
                        }
                      },
                      signal: interactiveOptions.signal,
                    }),
                  );
                  acpTextBuffer.flush();
                  return exitCode;
                }),
            );
          }).pipe(
            Effect.provide(ClackDisplay.layer),
            Effect.provide(NodeFileSystem),
          ),
        );
      } catch (error: unknown) {
        // If the signal was aborted, surface its reason verbatim
        interactiveOptions.signal?.throwIfAborted();
        throw error;
      }

      return {
        commits: lifecycleResult.commits,
        exitCode: lifecycleResult.result,
      };
    },

    exec: async (
      command: string,
      options?: SandboxExecOptions,
    ): Promise<ExecResult> => {
      const mergedOptions = { cwd: sandboxRepoDir, ...options };
      if (providerHandle) {
        return providerHandle.exec(command, mergedOptions);
      }
      // Test-mode fallback: no providerHandle, only the Effect SandboxOps.
      return runWithHost(sandbox.exec(command, mergedOptions));
    },

    close: async (): Promise<CloseResult> => close(),

    [Symbol.asyncDispose]: async (): Promise<void> => {
      await sandboxHandle.close();
    },
  };

  return sandboxHandle;
};
