/**
 * Tests for how the orchestrator decides an iteration signalled completion.
 *
 * The signal is matched against the *parsed* agent stream inside
 * `invokeAgent`, never against the returned output string. Two failures
 * motivated that:
 *
 *  - False positive: the returned output falls back to raw stdout, which
 *    contains the agent echoing back the prompt it was given. The prompt is
 *    where the completion signal is defined, so re-scanning that string
 *    reported a completion the agent never made. Raw stdout is also a bounded
 *    64KiB tail, so whether the echo survived depended on run length — the
 *    same prompt completed on a short run and looped on a long one.
 *
 *  - False negative: when the provider emits a terminal `result` event with
 *    text, that short string won over the full transcript, so a signal emitted
 *    in an earlier assistant message was dropped and the run kept iterating.
 */
import { Effect, Layer, Ref } from "effect";
import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { bob } from "../../agents/bob/bob.js";
import { orchestrate } from "./Orchestrator.js";
import type { SandboxOps } from "../../ports/SandboxOps.js";
import { SandboxFactory } from "../sandbox/lifecycle/SandboxFactory.js";
import { makeLocalSandbox } from "../../testing/testSandbox.js";
import { agentStreamEmitterLayer } from "../display/AgentStreamEmitter.js";
import { SilentDisplay } from "../../platform/node/displays.js";
import type { DisplayEntry } from "../../ports/Display.js";
import { createMockInteractiveExec } from "../../testing/mockAcpServer.js";
import type { DockerError } from "../../errors/errors.js";
import { nodeHostLayer } from "../../testing/hostProcess.js";

const execAsync = promisify(exec);

const SIGNAL = "<promise>COMPLETE</promise>";

const testDisplayLayer = Layer.mergeAll(
  nodeHostLayer,
  SilentDisplay.layer(Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([])),
  agentStreamEmitterLayer(),
);

const initRepo = async (dir: string) => {
  await execAsync("git init -b main", { cwd: dir });
  await execAsync('git config user.email "test@test.com"', { cwd: dir });
  await execAsync('git config user.name "Test"', { cwd: dir });
  await writeFile(join(dir, "hello.txt"), "hello");
  await execAsync("git add hello.txt", { cwd: dir });
  await execAsync("git commit -m initial", { cwd: dir });
};

const makeTestSandboxFactory = (
  hostRepoDir: string,
  buildSandbox: (sandboxDir: string) => SandboxOps,
): Layer.Layer<SandboxFactory> => {
  const sandboxBaseDir = join(tmpdir(), `orch-signal-${randomUUID()}`);
  let branchCounter = 0;

  return Layer.succeed(SandboxFactory, {
    withSandbox: <A, E, R>(
      makeEffect: (
        info: import("../sandbox/lifecycle/SandboxFactory.js").SandboxInfo,
        sandbox: SandboxOps,
      ) => Effect.Effect<A, E, R>,
    ): Effect.Effect<
      import("../sandbox/lifecycle/SandboxFactory.js").WithSandboxResult<A>,
      E | DockerError,
      R
    > =>
      Effect.acquireUseRelease(
        Effect.promise(async () => {
          await rm(sandboxBaseDir, { recursive: true, force: true });
          const branchName = `arsenal/signal-test-${++branchCounter}`;
          await execAsync(
            `git worktree add -b "${branchName}" "${sandboxBaseDir}" HEAD`,
            { cwd: hostRepoDir },
          );
          return branchName;
        }),
        (_) =>
          makeEffect(
            {
              hostWorktreePath: sandboxBaseDir,
              sandboxRepoPath: sandboxBaseDir,
              applyToHost: () => Effect.void,
            },
            buildSandbox(sandboxBaseDir),
          ) as Effect.Effect<A, E | DockerError, R>,
        (_) =>
          Effect.promise(async () => {
            await execAsync(`git worktree remove "${sandboxBaseDir}" --force`, {
              cwd: hostRepoDir,
            }).catch(() => {});
          }),
      ).pipe(
        Effect.map((value) => ({ value, preservedWorktreePath: undefined })),
      ),
  });
};

/**
 * Sandbox whose agent invocation replays `lines` through `onLine` and then
 * resolves with the supplied raw `stdout` — the two are independent, exactly
 * as they are for a real provider whose parser drops some stdout lines.
 */
const makeAgentSandbox = (
  dir: string,
  lines: string[],
  stdout: string,
  onRun?: () => void,
): SandboxOps => {
  const real = makeLocalSandbox(dir);
  return {
    exec: real.exec,
    copyIn: real.copyIn,
    copyFileOut: real.copyFileOut,
    interactiveExec: async (args, options) => {
      onRun?.();
      const mock = createMockInteractiveExec({
        onPrompt: async (_prompt, client) => {
          for (const line of lines) {
            await client.notify("session/update", {
              sessionId: "mock-session-id",
              update: {
                sessionUpdate: "agent_message_chunk",
                content: { type: "text", text: line },
              },
            });
          }
        },
      });
      return mock(args, options);
    },
  };
};

describe("Orchestrator completion signal", () => {
  it("does not treat the agent's echo of the prompt as a completion signal", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-echo-"));
    await initRepo(hostDir);

    const prompt = `Reset the machine, then verify.\n\n${SIGNAL}`;
    // The agent finishes without ever emitting the signal — it only says so in
    // prose.
    const assistant = "## Reset — COMPLETE. All checks pass.";

    let runs = 0;
    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) =>
      makeAgentSandbox(dir, [assistant], `${assistant}\n`, () => {
        runs++;
      }),
    );

    const result = await Effect.runPromise(
      orchestrate({
        provider: bob("default"),
        hostRepoDir: hostDir,
        iterations: 2,
        prompt,
        skipPromptExpansion: true,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.completionSignal).toBeUndefined();
    expect(runs).toBe(2);

    await rm(hostDir, { recursive: true, force: true });
  }, 60000);

  it("completes when the signal is in a streamed message a later result event does not repeat", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-event-"));
    await initRepo(hostDir);

    // The signal arrives in an assistant message.
    const lines = [`All checks pass.\n${SIGNAL}`];

    let runs = 0;
    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) =>
      makeAgentSandbox(dir, lines, "", () => {
        runs++;
      }),
    );

    const result = await Effect.runPromise(
      orchestrate({
        provider: bob("default"),
        hostRepoDir: hostDir,
        iterations: 3,
        prompt: "do the thing",
        skipPromptExpansion: true,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.completionSignal).toBe(SIGNAL);
    expect(runs).toBe(1);

    await rm(hostDir, { recursive: true, force: true });
  }, 60000);
});
