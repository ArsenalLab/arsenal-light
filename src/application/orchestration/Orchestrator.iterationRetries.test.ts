/**
 * Tests for the iterationRetries feature in Orchestrator.ts.
 *
 * These tests verify that:
 * - A failing agent is retried the configured number of times
 * - Success on a retry counts as iteration success
 * - Exhausting retries propagates the final AgentError
 * - Lifecycle (git/sandbox) errors are never retried
 * - Default (omitted) iterationRetries = 0 means no retries
 */
import { Cause, Effect, Layer, Ref } from "effect";
import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it, vi } from "vitest";
import { bob } from "../../agents/bob/bob.js";
import { orchestrate } from "./Orchestrator.js";
import { AgentError } from "../../errors/errors.js";
import type { SandboxOps } from "../../ports/SandboxOps.js";
import { SandboxFactory } from "../sandbox/lifecycle/SandboxFactory.js";
import { makeLocalSandbox } from "../../testing/testSandbox.js";
import { agentStreamEmitterLayer } from "../display/AgentStreamEmitter.js";
import { SilentDisplay } from "../../platform/node/displays.js";
import type { DisplayEntry } from "../../ports/Display.js";
import { createMockInteractiveExec } from "../../testing/mockAcpServer.js";
import type { DockerError } from "../../errors/errors.js";
import { nodeHostLayer } from "../../testing/hostProcess.js";

// Every test here does at least one real sandbox-lifecycle cycle (worktree
// creation + git identity + commit collection), some with retry backoff on
// top; under full-suite parallel load that can exceed vitest's 5s default,
// same class of flake fixed for syncOut.test.ts elsewhere in this repo.
vi.setConfig({ testTimeout: 30000 });

const execAsync = promisify(exec);

const testProvider = bob("default");

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

/** Minimal SandboxFactory layer that creates a real git worktree per call. */
const makeTestSandboxFactory = (
  hostRepoDir: string,
  buildSandbox: (sandboxDir: string) => SandboxOps,
): Layer.Layer<SandboxFactory> => {
  const sandboxBaseDir = join(tmpdir(), `orch-retry-${randomUUID()}`);
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
          const branchName = `arsenal/retry-test-${++branchCounter}`;
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

describe("Orchestrator iterationRetries", () => {
  it("retries once and succeeds when agent fails on first attempt", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-retry-ok-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial");

    let callCount = 0;

    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) => {
      const real = makeLocalSandbox(dir);
      return {
        exec: real.exec,
        copyIn: real.copyIn,
        copyFileOut: real.copyFileOut,
        interactiveExec: async (args, options) => {
          callCount++;
          if (callCount === 1) {
            const mock = createMockInteractiveExec({ output: "fail" });
            await mock(args, options);
            return { exitCode: 255 };
          }
          const mock = createMockInteractiveExec({
            output: "Done. <promise>COMPLETE</promise>",
          });
          return mock(args, options);
        },
      };
    });

    const result = await Effect.runPromise(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do work",
        iterationRetries: 1,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    expect(callCount).toBe(2);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    expect(result.iterations.length).toBe(1);
  });

  it("fails after exhausting all retry attempts", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-retry-exhaust-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial");

    let callCount = 0;

    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) => {
      const real = makeLocalSandbox(dir);
      return {
        exec: real.exec,
        copyIn: real.copyIn,
        copyFileOut: real.copyFileOut,
        interactiveExec: async (args, options) => {
          callCount++;
          const mock = createMockInteractiveExec({ output: "fail" });
          await mock(args, options);
          return { exitCode: 1 };
        },
      };
    });

    const exit = await Effect.runPromiseExit(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do work",
        iterationRetries: 2, // 1 initial + 2 retries = 3 total attempts
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // 3 total attempts consumed, then hard failure
    expect(callCount).toBe(3);
    expect(exit._tag).toBe("Failure");
    if (exit._tag === "Failure") {
      const err = Cause.squash(exit.cause);
      expect(err).toBeInstanceOf(AgentError);
    }
  });

  it("does not retry when iterationRetries is omitted (default 0)", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-retry-zero-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial");

    let callCount = 0;

    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) => {
      const real = makeLocalSandbox(dir);
      return {
        exec: real.exec,
        copyIn: real.copyIn,
        copyFileOut: real.copyFileOut,
        interactiveExec: async (args, options) => {
          callCount++;
          const mock = createMockInteractiveExec({ output: "fail" });
          await mock(args, options);
          return { exitCode: 1 };
        },
      };
    });

    const exit = await Effect.runPromiseExit(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 1,
        prompt: "do work",
        // iterationRetries not set — default 0
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // Exactly one attempt, immediate failure
    expect(callCount).toBe(1);
    expect(exit._tag).toBe("Failure");
  });

  it("retries across multiple iterations independently", async () => {
    const hostDir = await mkdtemp(join(tmpdir(), "orch-retry-multi-iter-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "hello.txt", "hello", "initial");

    // agent call sequence:
    //   iter1 attempt1 → fail
    //   iter1 attempt2 → succeed (no completion signal)
    //   iter2 attempt1 → fail
    //   iter2 attempt2 → succeed + COMPLETE
    let callCount = 0;

    const factoryLayer = makeTestSandboxFactory(hostDir, (dir) => {
      const real = makeLocalSandbox(dir);
      return {
        exec: real.exec,
        copyIn: real.copyIn,
        copyFileOut: real.copyFileOut,
        interactiveExec: async (args, options) => {
          callCount++;
          if (callCount % 2 === 1) {
            const mock = createMockInteractiveExec({ output: "fail" });
            await mock(args, options);
            return { exitCode: 255 };
          }
          const isLastIteration = callCount === 4;
          const text = isLastIteration
            ? "all done <promise>COMPLETE</promise>"
            : "partial progress";
          const mock = createMockInteractiveExec({ output: text });
          return mock(args, options);
        },
      };
    });

    const result = await Effect.runPromise(
      orchestrate({
        provider: testProvider,
        hostRepoDir: hostDir,
        iterations: 2,
        prompt: "do work",
        iterationRetries: 1,
      }).pipe(Effect.provide(Layer.merge(factoryLayer, testDisplayLayer))),
    );

    // 4 calls total: 2 per iteration (1 fail + 1 succeed)
    expect(callCount).toBe(4);
    expect(result.completionSignal).toBe("<promise>COMPLETE</promise>");
    expect(result.iterations.length).toBe(2);
  });
});
