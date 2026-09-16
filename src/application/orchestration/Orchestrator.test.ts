import { Cause, Effect, Layer, Ref } from "effect";
import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it, vi } from "vitest";
import { Display, type DisplayEntry } from "../../ports/Display.js";
import { SilentDisplay } from "../../platform/node/displays.js";
import { makeLocalSandbox } from "../../testing/testSandbox.js";
import { orchestrate } from "./Orchestrator.js";
import { substitutePromptArgs } from "../prompts/PromptArgumentSubstitution.js";
import { bob } from "../../agents/bob/bob.js";
import type { SandboxOps } from "../../ports/SandboxOps.js";
import type { DockerError, SandboxError } from "../../errors/errors.js";
import { AgentError, AgentIdleTimeoutError } from "../../errors/errors.js";
import { SandboxFactory } from "../sandbox/lifecycle/SandboxFactory.js";
import { createMockInteractiveExec } from "../../testing/mockAcpServer.js";
import {
  agentStreamEmitterLayer,
  type AgentStreamEvent,
} from "../display/AgentStreamEmitter.js";
import {
  nodeHostLayer,
  runWithHost,
  runWithHostExit,
} from "../../testing/hostProcess.js";

const noopAgentStreamEmitterLayer = agentStreamEmitterLayer();

// Most tests here do at least one real sandbox-lifecycle cycle (worktree
// creation + git identity + commit collection); under full-suite parallel
// load that can exceed vitest's 5s default — same class of flake fixed for
// syncOut.test.ts and Orchestrator.iterationRetries.test.ts elsewhere in
// this repo.
vi.setConfig({ testTimeout: 30000 });

const execAsync = promisify(exec);

const testProvider = bob("default");

const testDisplayLayer = Layer.mergeAll(
  nodeHostLayer,
  SilentDisplay.layer(Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([])),
  noopAgentStreamEmitterLayer,
);

const initRepo = async (dir: string) => {
  await execAsync("git init -b main", { cwd: dir });
  await execAsync('git config user.email "test@test.com"', { cwd: dir });
  await execAsync('git config user.name "Test"', { cwd: dir });
};

const commitFile = async (
  dir: string,
  name: string,
  content: string,
  message: string,
) => {
  await writeFile(join(dir, name), content);
  await execAsync(`git add "${name}"`, { cwd: dir });
  await execAsync(`git commit -m "${message}"`, { cwd: dir });
};

const getHead = async (dir: string) => {
  const { stdout } = await execAsync("git rev-parse HEAD", { cwd: dir });
  return stdout.trim();
};

/**
 * Create a mock SandboxFactory that creates a fresh git worktree
 * from hostRepoDir for each withSandbox call, then cleans it up after.
 *
 * Each iteration gets an isolated sandbox: the worktree directory is
 * removed and recreated before each call, and cleaned up after.
 *
 * @param hostRepoDir - The host git repository to create worktrees from
 * @param buildLayer - Given a fresh sandbox dir, return a Sandbox layer
 * @returns The factory layer
 */
const makeTestSandboxFactory = (
  hostRepoDir: string,
  buildSandbox: (sandboxDir: string) => SandboxOps,
): { factoryLayer: Layer.Layer<SandboxFactory>; sandboxRepoDir: string } => {
  const sandboxBaseDir = join(tmpdir(), `orch-factory-${randomUUID()}`);
  const sandboxRepoDir = sandboxBaseDir;

  let branchCounter = 0;

  const factoryLayer = Layer.succeed(SandboxFactory, {
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
          const branchName = `arsenal/test-${++branchCounter}`;
          await execAsync(
            `git worktree add -b "${branchName}" "${sandboxBaseDir}" HEAD`,
            { cwd: hostRepoDir },
          );
          return branchName;
        }),
        (_branchName) =>
          makeEffect(
            {
              hostWorktreePath: sandboxBaseDir,
              sandboxRepoPath: sandboxBaseDir,
              applyToHost: () => Effect.void,
            },
            buildSandbox(sandboxBaseDir),
          ) as Effect.Effect<A, E | DockerError, R>,
        (_branchName) =>
          Effect.promise(async () => {
            try {
              await execAsync(
                `git worktree remove "${sandboxBaseDir}" --force`,
                { cwd: hostRepoDir },
              ).catch(() => {});
            } catch {}
          }),
      ).pipe(
        Effect.map((value) => ({ value, preservedWorktreePath: undefined })),
      ),
  });

  return { factoryLayer, sandboxRepoDir };
};

/** Real sandbox exec, with an ACP agent whose output is `mockAgentBehavior`'s return value. */
const makeMockAgentLayer = (
  sandboxDir: string,
  mockAgentBehavior: (sandboxRepoDir: string) => Promise<string>,
): SandboxOps => {
  const real = makeLocalSandbox(sandboxDir);
  return {
    exec: real.exec,
    copyIn: real.copyIn,
    copyFileOut: real.copyFileOut,
    interactiveExec: createMockInteractiveExec((cwd) => mockAgentBehavior(cwd)),
  };
};

type SessionUpdate = Record<string, unknown>;

interface AcpAgentTurn {
  /** Prompt text the agent received. */
  readonly prompt: string;
  /** Working directory the agent was launched in. */
  readonly cwd: string;
  /** Stream one `session/update` to the client. */
  readonly send: (update: SessionUpdate) => Promise<void>;
}

interface AcpAgentSandboxOptions {
  /** Called with the argv the agent was launched with. */
  readonly onLaunch?: (args: string[]) => void;
  /** Exit code the agent process reports. */
  readonly exitCode?: number;
}

/**
 * Real sandbox exec, with an ACP agent that runs `turn` for each prompt.
 * The turn ends when `turn` resolves; a never-resolving turn simulates a hang.
 */
const makeAcpAgentSandbox = (
  sandboxDir: string,
  turn: (ctx: AcpAgentTurn) => Promise<void>,
  options: AcpAgentSandboxOptions = {},
): SandboxOps => {
  const real = makeLocalSandbox(sandboxDir);
  return {
    exec: real.exec,
    copyIn: real.copyIn,
    copyFileOut: real.copyFileOut,
    interactiveExec: (args, execOptions) => {
      options.onLaunch?.(args);
      return createMockInteractiveExec({
        exitCode: options.exitCode,
        onPrompt: (prompt, client) =>
          turn({
            prompt,
            cwd: execOptions.cwd ?? sandboxDir,
            send: (update) =>
              client.notify("session/update", {
                sessionId: "mock-session-id",
                update,
              } as never),
          }),
      })(args, execOptions);
    },
  };
};

const textUpdate = (text: string): SessionUpdate => ({
  sessionUpdate: "agent_message_chunk",
  content: { type: "text", text },
});

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const hangForever = () => new Promise<void>(() => {});

describe("Orchestrator", () => {
  it("runs a single iteration: sync-in, agent, sync-out", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: creates a commit in the sandbox repo
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async (repoDir) => {
          await writeFile(join(repoDir, "agent-output.txt"), "agent was here");
          await execAsync("git add -A", { cwd: repoDir });
          await execAsync('git config user.email "agent@test.com"', {
            cwd: repoDir,
          });
          await execAsync('git config user.name "Agent"', { cwd: repoDir });
          await execAsync('git commit -m "RALPH: agent commit"', {
            cwd: repoDir,
          });
          return "Done with iteration.";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBeUndefined();

    // Verify the agent's commit was synced back to host
    const content = await readFile(join(hostDir, "agent-output.txt"), "utf-8");
    expect(content).toBe("agent was here");
  });

  it("stops early on completion signal", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: emits completion signal
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. <promise>COMPLETE</promise>";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
  });

  it("stops early on custom completion signal", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: emits a custom completion signal
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. TASK_FINISHED";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,
        prompt: "do some work",
        completionSignal: "TASK_FINISHED",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("TASK_FINISHED");
  });

  it("does not trigger default completion signal when custom one is set", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: emits the default completion signal but custom one is set
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. <promise>COMPLETE</promise>";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 2,
        prompt: "do some work",
        completionSignal: "TASK_FINISHED",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Custom signal not in output, so all iterations run
    expect(result.iterations.length).toBe(2);
    expect(result.completionSignal).toBeUndefined();
  });

  it("does not complete from a signal that appears only in non-assertive (reasoning) text", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: streams a reasoning (agent_thought_chunk) update containing
    // the literal completion signal, exercised end-to-end through the real
    // bob() ACP parser and invokeAgent's signal matching.
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) => {
        const real = makeLocalSandbox(dir);
        return {
          exec: real.exec,
          copyIn: real.copyIn,
          copyFileOut: real.copyFileOut,
          interactiveExec: async (args, options) => {
            const mock = createMockInteractiveExec({
              onPrompt: async (_prompt, client) => {
                await client.notify("session/update", {
                  sessionId: "mock-session-id",
                  update: {
                    sessionUpdate: "agent_thought_chunk",
                    content: {
                      type: "text",
                      text: "Once everything passes I'll emit <promise>COMPLETE</promise> to finish up.",
                    },
                  },
                });
                await client.notify("session/update", {
                  sessionId: "mock-session-id",
                  update: {
                    sessionUpdate: "agent_message_chunk",
                    content: { type: "text", text: "Still working on it." },
                  },
                });
              },
            });
            return mock(args, options);
          },
        };
      },
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // The signal only ever appeared inside isReasoning:true content — must
    // never be mistaken for the agent asserting completion.
    expect(result.completionSignal).toBeUndefined();
    expect(result.iterations.length).toBe(1);
  });

  it("stops early when any signal in an array matches", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: emits the second signal in the array
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. TASK_ABORTED";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,
        prompt: "do some work",
        completionSignal: ["TASK_FINISHED", "TASK_ABORTED"],
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("TASK_ABORTED");
  });

  it("returns the matched signal from an array", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: emits the first signal in the array
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. TASK_FINISHED";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,
        prompt: "do some work",
        completionSignal: ["TASK_FINISHED", "TASK_ABORTED"],
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("TASK_FINISHED");
  });

  it("runs all iterations when no signal in array matches", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: emits neither signal
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "Still working.";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 2,
        prompt: "do some work",
        completionSignal: ["TASK_FINISHED", "TASK_ABORTED"],
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(2);
    expect(result.completionSignal).toBeUndefined();
  });

  it("runs multiple iterations with re-sync between them", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let iterationCount = 0;

    // Mock agent: creates a commit each iteration, completes on iteration 3
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async (repoDir) => {
          iterationCount++;
          const filename = `iter-${iterationCount}.txt`;
          await writeFile(
            join(repoDir, filename),
            `iteration ${iterationCount}`,
          );
          await execAsync("git add -A", { cwd: repoDir });
          await execAsync('git config user.email "agent@test.com"', {
            cwd: repoDir,
          });
          await execAsync('git config user.name "Agent"', { cwd: repoDir });
          await execAsync(
            `git commit -m "RALPH: iteration ${iterationCount}"`,
            {
              cwd: repoDir,
            },
          );

          if (iterationCount === 3) {
            return "All tasks done. <promise>COMPLETE</promise>";
          }
          return `Finished iteration ${iterationCount}.`;
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(3);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");

    // Verify all 3 iteration files arrived on host
    for (let i = 1; i <= 3; i++) {
      const content = await readFile(join(hostDir, `iter-${i}.txt`), "utf-8");
      expect(content).toBe(`iteration ${i}`);
    }
  });

  it("handles iteration with no agent commits gracefully", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: doesn't make any commits
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "Nothing to do.";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 2,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(2);
    expect(result.completionSignal).toBeUndefined();

    // Host should still be at the original commit
    const hostHead = await getHead(hostDir);
    const { stdout } = await execAsync("git log --oneline", { cwd: hostDir });
    expect(stdout.trim().split("\n")).toHaveLength(1);
  });

  it("each iteration gets an isolated sandbox (no state leaks)", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-iso-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let iteration = 0;
    let markerExistedInIter2 = true;

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async (repoDir) => {
          iteration++;
          if (iteration === 1) {
            // Create an untracked marker file — should NOT leak to iteration 2
            await writeFile(join(repoDir, ".sandbox-marker"), "iter1");
            return "Done iter 1";
          }
          // Iteration 2: check if marker leaked from iteration 1
          markerExistedInIter2 = existsSync(join(repoDir, ".sandbox-marker"));
          return "Done iter 2. <promise>COMPLETE</promise>";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 3,

        prompt: "test isolation",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(2);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    // Untracked file from iteration 1 must not exist in iteration 2's sandbox
    expect(markerExistedInIter2).toBe(false);
  });
});

describe("OrchestrateResult", () => {
  it("captures agent stdout in the result", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return 'Here is my structured output: {"plan": [1, 2, 3]}';
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.stdout).toContain(
      'Here is my structured output: {"plan": [1, 2, 3]}',
    );
  });

  it("accumulates commits across multiple iterations", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let iterationCount = 0;

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async (repoDir) => {
          iterationCount++;
          await writeFile(
            join(repoDir, `file-${iterationCount}.txt`),
            `content ${iterationCount}`,
          );
          await execAsync("git add -A", { cwd: repoDir });
          await execAsync('git config user.email "agent@test.com"', {
            cwd: repoDir,
          });
          await execAsync('git config user.name "Agent"', { cwd: repoDir });
          await execAsync(`git commit -m "commit ${iterationCount}"`, {
            cwd: repoDir,
          });

          if (iterationCount === 3) {
            return "All done. <promise>COMPLETE</promise>";
          }
          return `Iteration ${iterationCount} done.`;
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.commits).toHaveLength(3);
    // Each commit sha should be valid
    for (const commit of result.commits) {
      expect(commit.sha).toMatch(/^[0-9a-f]{40}$/);
    }
    // All shas should be unique
    const uniqueShas = new Set(result.commits.map((c) => c.sha));
    expect(uniqueShas.size).toBe(3);
  });

  it("returns empty commits and branch when agent makes no commits", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "Nothing to do.";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.commits).toEqual([]);
    expect(result.branch).toBe("main");
  });

  it("returns commit shas and branch after a single iteration", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async (repoDir) => {
          await writeFile(join(repoDir, "new-file.txt"), "new content");
          await execAsync("git add -A", { cwd: repoDir });
          await execAsync('git config user.email "agent@test.com"', {
            cwd: repoDir,
          });
          await execAsync('git config user.name "Agent"', { cwd: repoDir });
          await execAsync('git commit -m "agent commit"', { cwd: repoDir });
          return "Done.";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Branch should match the host's current branch
    expect(result.branch).toBe("main");

    // Should have exactly one commit
    expect(result.commits).toHaveLength(1);
    expect(result.commits[0]!.sha).toMatch(/^[0-9a-f]{40}$/);

    // The sha should match what's on the host
    const hostHead = await getHead(hostDir);
    expect(result.commits[0]!.sha).toBe(hostHead);
  });

  it("surfaces commits even when worktree has uncommitted changes", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const sandboxBaseDir = join(tmpdir(), `orch-factory-${randomUUID()}`);
    let branchCounter = 0;

    // Custom factory that detects uncommitted changes and preserves worktree path
    const factoryLayer = Layer.succeed(SandboxFactory, {
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
            const branchName = `arsenal/test-${++branchCounter}`;
            await execAsync(
              `git worktree add -b "${branchName}" "${sandboxBaseDir}" HEAD`,
              { cwd: hostDir },
            );
            return branchName;
          }),
          (_branchName) =>
            makeEffect(
              {
                hostWorktreePath: sandboxBaseDir,
                sandboxRepoPath: sandboxBaseDir,
                applyToHost: () => Effect.void,
              },
              makeMockAgentLayer(sandboxBaseDir, async (repoDir) => {
                // Make a commit
                await writeFile(
                  join(repoDir, "committed.txt"),
                  "committed content",
                );
                await execAsync("git add -A", { cwd: repoDir });
                await execAsync('git config user.email "agent@test.com"', {
                  cwd: repoDir,
                });
                await execAsync('git config user.name "Agent"', {
                  cwd: repoDir,
                });
                await execAsync('git commit -m "agent commit"', {
                  cwd: repoDir,
                });

                // Leave uncommitted changes
                await writeFile(
                  join(repoDir, "uncommitted.txt"),
                  "uncommitted content",
                );

                return "Done.";
              }),
            ) as Effect.Effect<A, E | DockerError, R>,
          (_branchName) =>
            Effect.promise(async () => {
              try {
                await execAsync(
                  `git worktree remove "${sandboxBaseDir}" --force`,
                  { cwd: hostDir },
                ).catch(() => {});
              } catch {}
            }),
        ).pipe(
          Effect.map((value) => {
            // Check for uncommitted changes before cleanup
            return { value, preservedWorktreePath: sandboxBaseDir };
          }),
        ),
    });

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Should have the preserved worktree path
    expect(result.preservedWorktreePath).toBe(sandboxBaseDir);

    // Commits should still be surfaced
    expect(result.commits).toHaveLength(1);
    expect(result.commits[0]!.sha).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe("Orchestrator agent stream emitter", () => {
  it("emits text and toolCall events with iteration index and timestamps", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-stream-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = SilentDisplay.layer(ref);

    const events: AgentStreamEvent[] = [];
    const emitterLayer = agentStreamEmitterLayer((e) => {
      events.push(e);
    });

    const mockLayer = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        await send(textUpdate("Working now"));
        await send({
          sessionUpdate: "tool_call",
          toolCallId: "call-1",
          title: "Bash",
          rawInput: { command: "ls" },
        });
        await send(textUpdate("<promise>COMPLETE</promise>"));
      }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do work",
      }).pipe(
        Effect.provide(
          Layer.mergeAll(mockLayer.factoryLayer, displayLayer, emitterLayer),
        ),
      ),
    );

    const textEvents = events.filter((e) => e.type === "text");
    const toolCallEvents = events.filter((e) => e.type === "toolCall");

    expect(textEvents.length).toBeGreaterThan(0);
    expect(textEvents[0]!.message).toContain("Working now");
    expect(textEvents[0]!.iteration).toBe(1);
    expect(textEvents[0]!.timestamp).toBeInstanceOf(Date);

    expect(toolCallEvents).toHaveLength(1);
    expect(toolCallEvents[0]).toMatchObject({
      type: "toolCall",
      name: "Bash",
      formattedArgs: JSON.stringify({ command: "ls" }),
      iteration: 1,
    });
    expect(toolCallEvents[0]!.timestamp).toBeInstanceOf(Date);
  });

  it("swallows errors thrown by the callback", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-stream-err-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = SilentDisplay.layer(ref);

    const emitterLayer = agentStreamEmitterLayer(() => {
      throw new Error("callback intentionally broken");
    });

    const mockLayer = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        await send(textUpdate("Hello there"));
        await send(textUpdate("<promise>COMPLETE</promise>"));
      }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do work",
      }).pipe(
        Effect.provide(
          Layer.mergeAll(mockLayer.factoryLayer, displayLayer, emitterLayer),
        ),
      ),
    );

    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
  });

  it("emits raw events for every session/update, including ones the parser drops", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-stream-raw-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const events: AgentStreamEvent[] = [];
    const emitterLayer = agentStreamEmitterLayer((e) => {
      events.push(e);
    });

    const droppedUpdate: SessionUpdate = {
      sessionUpdate: "current_mode_update",
      currentModeId: "code",
    };
    const messageUpdate = textUpdate("<promise>COMPLETE</promise>");

    const mockLayer = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        await send(droppedUpdate);
        await send(messageUpdate);
      }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do work",
      }).pipe(
        Effect.provide(
          Layer.mergeAll(
            mockLayer.factoryLayer,
            SilentDisplay.layer(
              Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]),
            ),
            emitterLayer,
          ),
        ),
      ),
    );

    const rawEvents = events.filter((e) => e.type === "raw");
    // Compare parsed: the ACP SDK re-serializes updates, so key order differs.
    expect(rawEvents.map((e) => JSON.parse(e.line))).toEqual([
      droppedUpdate,
      messageUpdate,
    ]);
    expect(rawEvents[0]!.iteration).toBe(1);
    expect(rawEvents[0]!.timestamp).toBeInstanceOf(Date);
  });
});

describe("Orchestrator error handling", () => {
  it("propagates AgentError when agent exits with non-zero code", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-err-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async () => {}, { exitCode: 1 }),
    );

    const exit = await runWithHostExit(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(exit._tag).toBe("Failure");
    if (exit._tag === "Failure") {
      const err = Cause.squash(exit.cause);
      expect(err).toBeInstanceOf(AgentError);
      expect((err as AgentError).message).toContain("non-zero code 1");
    }
  });

  it("preserves iteration 1 work when agent fails on iteration 2", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-partial-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let callCount = 0;

    // Iteration 1 commits; iteration 2's prompt request fails.
    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ cwd, send }) => {
        callCount++;
        if (callCount > 1) throw new Error("Agent segfault");
        await writeFile(join(cwd, "iter1.txt"), "iteration 1 data");
        await execAsync("git add -A", { cwd });
        await execAsync('git config user.email "agent@test.com"', { cwd });
        await execAsync('git config user.name "Agent"', { cwd });
        await execAsync('git commit -m "RALPH: iteration 1"', { cwd });
        await send(textUpdate("Finished iteration 1."));
      }),
    );

    const exit = await runWithHostExit(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 3,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Should have failed on iteration 2
    expect(exit._tag).toBe("Failure");
    expect(callCount).toBe(2);

    // But iteration 1's commit should be preserved on host
    const content = await readFile(join(hostDir, "iter1.txt"), "utf-8");
    expect(content).toBe("iteration 1 data");
  });

  it("propagates error when syncIn fails (invalid host repo)", async () => {
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      "/nonexistent/repo",
      (dir) => makeMockAgentLayer(dir, async () => "done"),
    );

    const exit = await runWithHostExit(
      orchestrate({
        provider: testProvider,
        hostRepoDir: "/nonexistent/repo",

        iterations: 1,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(exit._tag).toBe("Failure");
  });

  it("propagates error when sandbox branch resolution fails", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-nohead-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Layer that sabotages branch resolution in the sandbox
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) => {
        const real = makeLocalSandbox(dir);
        return {
          exec: (command, options) => {
            if (command === "git rev-parse --abbrev-ref HEAD") {
              return Effect.succeed({
                stdout: "",
                stderr: "fatal: ambiguous argument 'HEAD'",
                exitCode: 128,
              });
            }
            return real.exec(command, options);
          },
          copyIn: (hostPath, sandboxPath) => real.copyIn(hostPath, sandboxPath),
          copyFileOut: (sandboxPath, hostPath) =>
            real.copyFileOut(sandboxPath, hostPath),
        };
      },
    );

    const exit = await runWithHostExit(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(exit._tag).toBe("Failure");
  });
});

describe("Orchestrator streaming", () => {
  it("launches bob in ACP mode", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-stream-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let launchArgs: string[] = [];

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(
        dir,
        async ({ send }) => {
          await send(textUpdate("Done."));
        },
        { onLaunch: (args) => (launchArgs = args) },
      ),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(launchArgs.slice(0, 2)).toEqual(["bob", "acp"]);
  });

  it("extracts completion signal from agent message text", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-result-host-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent that emits completion in its message text
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. <promise>COMPLETE</promise>";
        }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,

        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
  });

  it("launches the agent with the flags baked into the provider", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-defmodel-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let launchArgs: string[] = [];

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(
        dir,
        async ({ send }) => {
          await send(textUpdate("Done."));
        },
        { onLaunch: (args) => (launchArgs = args) },
      ),
    );

    await runWithHost(
      orchestrate({
        provider: bob("default", { disableMcp: true }),
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(launchArgs).toEqual(expect.arrayContaining(["--disable-mcp"]));
  });

  it("launches the agent with a different provider's own flags", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-custmodel-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let launchArgs: string[] = [];

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(
        dir,
        async ({ send }) => {
          await send(textUpdate("Done."));
        },
        { onLaunch: (args) => (launchArgs = args) },
      ),
    );

    await runWithHost(
      orchestrate({
        provider: bob("default", { disableSubagents: true }),
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(launchArgs).toEqual(expect.arrayContaining(["--disable-subagents"]));
    expect(launchArgs).not.toContain("--disable-mcp");
  });
});

describe("Orchestrator prompt preprocessing", () => {
  it("preprocesses !`command` expressions in the prompt before invoking agent", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-preproc-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let capturedPrompt = "";

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ prompt, send }) => {
        capturedPrompt = prompt;
        await send(textUpdate("Done."));
      }),
    );

    // In production the prompt is always run through substitutePromptArgs
    // before reaching orchestrate (which marks template shell blocks).
    const marked = await runWithHost(
      substitutePromptArgs(
        "Context: !`echo hello-from-sandbox`\n\nDo the work.",
        {},
      ).pipe(Effect.provide(testDisplayLayer)),
    );
    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: marked,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // The prompt should have !`echo hello-from-sandbox` replaced with "hello-from-sandbox"
    expect(capturedPrompt).toContain("hello-from-sandbox");
    expect(capturedPrompt).not.toContain("!`echo");
  });

  it("passes prompt through unchanged when no !`command` expressions", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-nopreproc-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let capturedPrompt = "";

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ prompt, send }) => {
        capturedPrompt = prompt;
        await send(textUpdate("Done."));
      }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "Just a plain prompt with no commands.",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(capturedPrompt).toContain("Just a plain prompt with no commands.");
  });

  it("passes prompt through literally when skipPromptExpansion is true", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-skipexp-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let capturedPrompt = "";

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ prompt, send }) => {
        capturedPrompt = prompt;
        await send(textUpdate("Done."));
      }),
    );

    const literalPrompt =
      "Context: !`echo hello-from-sandbox`\n\n{{ISSUE_NUMBER}} should pass through.";

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: literalPrompt,
        skipPromptExpansion: true,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Both the shell expression and the {{KEY}} placeholder are delivered verbatim.
    expect(capturedPrompt).toContain("!`echo hello-from-sandbox`");
    expect(capturedPrompt).toContain("{{ISSUE_NUMBER}}");
    expect(capturedPrompt).not.toContain("hello-from-sandbox\n");
  });
});

describe("Orchestrator Display integration", () => {
  it("emits iteration header, spinner, and completion status", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-display-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(ref),
      noopAgentStreamEmitterLayer,
    );

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. <promise>COMPLETE</promise>";
        }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 5,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, displayLayer))),
    );

    const entries = await runWithHost(Ref.get(ref));

    // Iteration header
    const statusEntries = entries.filter((e) => e._tag === "status");
    expect(statusEntries.some((e) => e.message.includes("Iteration 1/5"))).toBe(
      true,
    );

    // Task log for sandbox setup
    const taskLogEntries = entries.filter((e) => e._tag === "taskLog");
    expect(
      taskLogEntries.some((e) => e.title.includes("Setting up sandbox")),
    ).toBe(true);

    // No spinner for sync-out when agent produces no commits
    const spinnerEntries = entries.filter((e) => e._tag === "spinner");
    expect(
      spinnerEntries.some((e) =>
        e.message.includes("Syncing commits back to host"),
      ),
    ).toBe(false);

    // No usage summary emitted
    const summaryEntries = entries.filter((e) => e._tag === "summary");
    expect(summaryEntries).toHaveLength(0);

    // Completion status
    expect(
      statusEntries.some(
        (e) =>
          e.message.includes("completion") || e.message.includes("complete"),
      ),
    ).toBe(true);
  });

  it("labels iteration header and max-reached message with 'max'", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-maxlabel-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(ref),
      noopAgentStreamEmitterLayer,
    );

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          // Never signals completion
          return "Nothing to do.";
        }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 2,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, displayLayer))),
    );

    const entries = await runWithHost(Ref.get(ref));
    const statusEntries = entries.filter((e) => e._tag === "status");

    // Iteration header should NOT include "(max)" — the summary already communicates the max
    expect(statusEntries.some((e) => e.message.includes("Iteration 1/2"))).toBe(
      true,
    );
    expect(statusEntries.every((e) => !e.message.includes("(max)"))).toBe(true);

    // Completion message when max is reached should say "max iterations"
    expect(
      statusEntries.some((e) => e.message.includes("max iterations")),
    ).toBe(true);
  });

  it("uses 10 minutes as the default idle timeout", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-timeout-default-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) => makeMockAgentLayer(dir, async () => "done"),
    );

    // Verify indirectly: a run that completes quickly should not time out.
    // The default idle timeout is 600s (10 minutes) — far longer than any mock agent delay.
    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "test",
        // No idleTimeoutSeconds — should default to 10 minutes (600s)
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, testDisplayLayer)),
        Effect.exit,
      ),
    );

    // The run completes successfully — default idle timeout is large enough
    expect(exitResult._tag).toBe("Success");
  }, 10_000);

  it("prefixes status messages with [name] when name is provided", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-name-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(ref),
      noopAgentStreamEmitterLayer,
    );

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. <promise>COMPLETE</promise>";
        }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "do some work",
        name: "issue-42",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, displayLayer))),
    );

    const entries = await runWithHost(Ref.get(ref));
    const statusEntries = entries.filter((e) => e._tag === "status");

    // All status messages should be prefixed with [issue-42]
    expect(statusEntries.every((e) => e.message.startsWith("[issue-42]"))).toBe(
      true,
    );
    // Iteration message should still be readable
    expect(statusEntries.some((e) => e.message.includes("Iteration 1/1"))).toBe(
      true,
    );
  });

  it("does not prefix status messages when no name is provided", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-noname-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(ref),
      noopAgentStreamEmitterLayer,
    );

    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          return "All done. <promise>COMPLETE</promise>";
        }),
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, displayLayer))),
    );

    const entries = await runWithHost(Ref.get(ref));
    const statusEntries = entries.filter((e) => e._tag === "status");

    // No status messages should be prefixed with brackets
    expect(statusEntries.every((e) => !e.message.startsWith("["))).toBe(true);
  });

  it("fails with AgentIdleTimeoutError when idleTimeoutSeconds is exceeded with no output", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-timeout-"));

    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Mock agent: takes 2 seconds to respond and produces no output during that time
    const { factoryLayer, sandboxRepoDir } = makeTestSandboxFactory(
      hostDir,
      (dir) =>
        makeMockAgentLayer(dir, async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return "done";
        }),
    );

    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,

        iterations: 1,
        prompt: "test",
        idleTimeoutSeconds: 0.1, // 100ms — well below the 2s agent delay with no output
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, testDisplayLayer)),
        Effect.exit,
      ),
    );

    expect(exitResult._tag).toBe("Failure");
    if (exitResult._tag === "Failure") {
      const err = Cause.squash(exitResult.cause);
      expect(err).toBeInstanceOf(AgentIdleTimeoutError);
      if (err instanceof AgentIdleTimeoutError) {
        expect(err.timeoutMs).toBe(100);
        expect(err.message).toContain("idle");
        expect(err.message).toContain("idleTimeoutSeconds");
      }
    }
  }, 10_000);

  it("resets the idle timer on each text/tool_call output", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-idle-reset-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Text at t=100ms resets the 150ms idle timer to t=250ms, so the turn
    // ending at t=200ms completes before it fires.
    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        await sleep(100);
        await send(textUpdate("working..."));
        await sleep(100);
      }),
    );

    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "test",
        idleTimeoutSeconds: 0.15,
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, testDisplayLayer)),
        Effect.exit,
      ),
    );

    expect(exitResult._tag).toBe("Success");
  }, 10_000);

  it("resets the idle timer on updates the parser drops", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-idle-raw-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // An update that yields no typed event at t=100ms must still reset the
    // 150ms idle timer, so the turn ending at t=200ms completes.
    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        await sleep(100);
        await send({
          sessionUpdate: "current_mode_update",
          currentModeId: "code",
        });
        await sleep(100);
      }),
    );

    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "test",
        idleTimeoutSeconds: 0.15,
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, testDisplayLayer)),
        Effect.exit,
      ),
    );

    expect(exitResult._tag).toBe("Success");
  }, 10_000);

  it("logs periodic idle warnings every IDLE_WARNING_INTERVAL_MS of inactivity", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-idle-warn-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        // Idle for 250ms — ~2 warnings at a 100ms interval
        await sleep(250);
        await send(textUpdate("done"));
      }),
    );

    const displayEntries = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(displayEntries),
      noopAgentStreamEmitterLayer,
    );

    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "test",
        idleTimeoutSeconds: 10, // high enough not to kill
        _idleWarningIntervalMs: 100, // fire warnings every 100ms for testing
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, displayLayer)),
        Effect.exit,
      ),
    );

    expect(exitResult._tag).toBe("Success");

    const allEntries = await runWithHost(Ref.get(displayEntries));
    const warningEntries = allEntries.filter(
      (e) => e._tag === "status" && e.severity === "warn",
    ) as { message: string }[];

    expect(warningEntries.length).toBeGreaterThanOrEqual(2);
    // Warnings count "minutes" even though the test interval is 100ms
    expect(warningEntries[0]!.message).toContain("Agent idle for 1 minute");
    expect(warningEntries[1]!.message).toContain("Agent idle for 2 minutes");
  }, 10_000);

  it("resets idle warning counter when agent produces output", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-idle-warn-reset-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        // Warning at ~100ms; text at ~150ms resets the counter; warning again at ~250ms
        await sleep(150);
        await send(textUpdate("working..."));
        await sleep(150);
        await send(textUpdate("done"));
      }),
    );

    const displayEntries = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(displayEntries),
      noopAgentStreamEmitterLayer,
    );

    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "test",
        idleTimeoutSeconds: 10, // high enough not to kill
        _idleWarningIntervalMs: 100, // fire warnings every 100ms for testing
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, displayLayer)),
        Effect.exit,
      ),
    );

    expect(exitResult._tag).toBe("Success");

    const allEntries = await runWithHost(Ref.get(displayEntries));
    const warningEntries = allEntries.filter(
      (e) => e._tag === "status" && e.severity === "warn",
    ) as { message: string }[];

    expect(warningEntries.length).toBeGreaterThanOrEqual(2);
    // Both say "1 minute" because the text event reset the counter
    expect(warningEntries[0]!.message).toContain("Agent idle for 1 minute");
    expect(warningEntries[1]!.message).toContain("Agent idle for 1 minute");
  }, 10_000);
});

describe("Orchestrator signal (AbortSignal)", () => {
  it("rejects with pre-aborted signal before running any iteration", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    let agentCalled = false;
    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeMockAgentLayer(dir, async () => {
        agentCalled = true;
        return "Done.";
      }),
    );

    const ac = new AbortController();
    ac.abort("pre-aborted");

    await expect(
      runWithHost(
        orchestrate({
          provider: testProvider,
          hostRepoDir: hostDir,
          iterations: 1,
          prompt: "do some work",
          signal: ac.signal,
        }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
      ),
    ).rejects.toThrow("pre-aborted");

    expect(agentCalled).toBe(false);
  });

  it("aborts mid-iteration and rejects", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ac = new AbortController();

    // Mock agent that takes a while — abort fires while it's running
    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeMockAgentLayer(dir, async () => {
        // Simulate slow agent: abort mid-flight
        ac.abort("cancelled mid-iteration");
        // Give the abort a tick to propagate
        await new Promise((r) => setTimeout(r, 10));
        return "Done.";
      }),
    );

    await expect(
      runWithHost(
        orchestrate({
          provider: testProvider,
          hostRepoDir: hostDir,
          iterations: 1,
          prompt: "do some work",
          signal: ac.signal,
        }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
      ),
    ).rejects.toThrow("cancelled mid-iteration");
  });

  it("aborts between iterations and does not start the next one", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ac = new AbortController();
    let iterationCount = 0;

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeMockAgentLayer(dir, async () => {
        iterationCount++;
        if (iterationCount === 1) {
          // After first iteration completes, abort before second starts
          ac.abort("cancelled between iterations");
        }
        return `Iteration ${iterationCount} done.`;
      }),
    );

    await expect(
      runWithHost(
        orchestrate({
          provider: testProvider,
          hostRepoDir: hostDir,
          iterations: 5,
          prompt: "do some work",
          signal: ac.signal,
        }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
      ),
    ).rejects.toThrow("cancelled between iterations");

    expect(iterationCount).toBe(1);
  });

  it("abort after completion is a no-op", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const ac = new AbortController();

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeMockAgentLayer(dir, async () => {
        return "All done. <promise>COMPLETE</promise>";
      }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        signal: ac.signal,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Abort after completion — should not throw or affect result
    ac.abort("too late");

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
  });

  it("works normally when no signal is provided", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-host-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeMockAgentLayer(dir, async () => {
        return "Done. <promise>COMPLETE</promise>";
      }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        // no signal
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.iterations.length).toBe(1);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
  });
});

describe("Orchestrator completion timeout (hanging process)", () => {
  /** An ACP agent that streams `texts`, then never ends its turn. */
  const makeHangingAgentSandbox = (
    sandboxDir: string,
    texts: string[],
  ): SandboxOps =>
    makeAcpAgentSandbox(sandboxDir, async ({ send }) => {
      for (const text of texts) await send(textUpdate(text));
      await hangForever();
    });

  it("succeeds with completionSignal set when the agent hangs after emitting the signal", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-comp-hang-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeHangingAgentSandbox(dir, ["All done. <promise>COMPLETE</promise>"]),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        completionTimeoutSeconds: 0.2, // 200ms grace window for the test
        idleTimeoutSeconds: 30, // way larger than the test runtime
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    expect(result.iterations.length).toBe(1);
  }, 10_000);

  it("falls through to the idle timeout when the agent hangs WITHOUT emitting the signal", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-comp-noidle-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeHangingAgentSandbox(dir, ["still thinking..."]),
    );

    const exitResult = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        idleTimeoutSeconds: 0.15, // 150ms — fires because no signal was seen
        completionTimeoutSeconds: 0.05, // would-be grace window, must not apply
      }).pipe(
        Effect.provide(Layer.merge(factoryLayer, testDisplayLayer)),
        Effect.exit,
      ),
    );

    expect(exitResult._tag).toBe("Failure");
    if (exitResult._tag === "Failure") {
      const err = Cause.squash(exitResult.cause);
      expect(err).toBeInstanceOf(AgentIdleTimeoutError);
    }
  }, 10_000);

  it("resets the completion timer on trailing output and includes it in stdout", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-comp-trailing-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    // Trailing output ~120ms after the signal lands inside the 200ms grace
    // window and must reset it, so the run succeeds with the trailing text.
    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeAcpAgentSandbox(dir, async ({ send }) => {
        await send(textUpdate("Plan ready. <promise>COMPLETE</promise>"));
        await sleep(120);
        await send(textUpdate("\nTRAILING_TOKEN"));
        await hangForever();
      }),
    );

    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        completionTimeoutSeconds: 0.2,
        idleTimeoutSeconds: 30,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    expect(result.stdout).toContain("TRAILING_TOKEN");
  }, 10_000);

  it("adds no latency when the agent exits cleanly after the signal", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-comp-fast-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeMockAgentLayer(
        dir,
        async () => "All done. <promise>COMPLETE</promise>",
      ),
    );

    const start = Date.now();
    const result = await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        // Large completion timeout — clean exit must NOT wait for it.
        completionTimeoutSeconds: 30,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );
    const elapsedMs = Date.now() - start;

    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    // Clean exit beats the grace window — no waiting added.
    expect(elapsedMs).toBeLessThan(2_000);
  }, 10_000);

  it("emits a warning when the completion timeout fires", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-comp-warn-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial commit");

    const { factoryLayer } = makeTestSandboxFactory(hostDir, (dir) =>
      makeHangingAgentSandbox(dir, [
        "Final answer <promise>COMPLETE</promise>",
      ]),
    );

    const ref = Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([]);
    const displayLayer = Layer.merge(
      SilentDisplay.layer(ref),
      noopAgentStreamEmitterLayer,
    );

    await runWithHost(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
        completionTimeoutSeconds: 0.1,
        idleTimeoutSeconds: 30,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, displayLayer))),
    );

    const entries = await runWithHost(Ref.get(ref));
    const warnEntries = entries.filter(
      (e) => e._tag === "status" && e.severity === "warn",
    ) as { _tag: "status"; message: string; severity: "warn" }[];
    expect(
      warnEntries.some((e) => /hang|completion timeout/i.test(e.message)),
    ).toBe(true);
  }, 10_000);
});
