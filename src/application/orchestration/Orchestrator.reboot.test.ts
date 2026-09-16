/**
 * Tests for the reboot-completion fix in Orchestrator.ts:
 * a non-zero exit code is treated as success when the completion signal
 * was already emitted — e.g. the agent ran `sudo reboot` after signalling
 * COMPLETE, dropping the SSH connection with exit 255.
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

const testDisplayLayer = Layer.mergeAll(
  nodeHostLayer,
  SilentDisplay.layer(Ref.unsafeMake<ReadonlyArray<DisplayEntry>>([])),
  agentStreamEmitterLayer(),
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

const makeTestSandboxFactory = (
  hostRepoDir: string,
  buildSandbox: (sandboxDir: string) => SandboxOps,
): Layer.Layer<SandboxFactory> => {
  const sandboxBaseDir = join(tmpdir(), `orch-reboot-${randomUUID()}`);
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
          const branchName = `arsenal/reboot-test-${++branchCounter}`;
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

describe("Orchestrator reboot completion", () => {
  it("treats non-zero exit as success when completion signal was already emitted", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-reboot-ok-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial");

    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) => {
      const real = makeLocalSandbox(dir);
      return {
        exec: real.exec,
        copyIn: real.copyIn,
        copyFileOut: real.copyFileOut,
        interactiveExec: async (args, options) => {
          const mock = createMockInteractiveExec({
            output: "Rebooting now. <promise>COMPLETE</promise>",
          });
          await mock(args, options);
          return { exitCode: 255 };
        },
      };
    });

    const result = await Effect.runPromise(
      orchestrate({
        provider: bob("default"),
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "reboot the machine",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    expect(result.iterations.length).toBe(1);
  });

  it("still fails on non-zero exit when no completion signal was emitted", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-exit255-fail-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial");

    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) => {
      const real = makeLocalSandbox(dir);
      return {
        exec: real.exec,
        copyIn: real.copyIn,
        copyFileOut: real.copyFileOut,
        interactiveExec: async (args, options) => {
          const mock = createMockInteractiveExec({ output: "no signal here" });
          await mock(args, options);
          return { exitCode: 255 };
        },
      };
    });

    const exit = await Effect.runPromiseExit(
      orchestrate({
        provider: bob("default"),
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do some work",
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(exit._tag).toBe("Failure");
  });
});
