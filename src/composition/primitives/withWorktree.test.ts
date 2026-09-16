import { exec } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bob } from "../../agents/bob/bob.js";
import { noSandbox } from "../../sandboxes/no-sandbox/no-sandbox.js";
import { withWorktree } from "./withWorktree.js";

vi.setConfig({ testTimeout: 30000 });

const execAsync = promisify(exec);

describe("withWorktree", () => {
  let hostDir: string;

  beforeEach(async () => {
    hostDir = await mkdtemp(join(tmpdir(), "with-worktree-"));
    await execAsync("git init -b main", { cwd: hostDir });
    await execAsync('git config user.email "test@test.com"', { cwd: hostDir });
    await execAsync('git config user.name "Test"', { cwd: hostDir });
    await writeFile(join(hostDir, "hello.txt"), "hello");
    await execAsync("git add -A && git commit -m init", { cwd: hostDir });
  });

  afterEach(async () => {
    await rm(hostDir, { recursive: true, force: true });
  });

  const options = () => ({
    agent: bob("default"),
    sandbox: noSandbox(),
    cwd: hostDir,
  });

  it("returns the callback's value", async () => {
    const result = await withWorktree(options(), async (ctx) => {
      expect(ctx.cwd).toBeTruthy();
      return 42;
    });

    expect(result.value).toBe(42);
    expect(result.commits).toEqual([]);
  });

  it("rejects with the exact error the callback threw", async () => {
    class CustomError extends Error {}
    const thrown = new CustomError("callback failed");

    const rejection = await withWorktree(options(), async () => {
      throw thrown;
    }).catch((e: unknown) => e);

    expect(rejection).toBe(thrown);
  });
});

describe("withWorktree context", () => {
  let hostDir: string;

  beforeEach(async () => {
    hostDir = await mkdtemp(join(tmpdir(), "with-worktree-ctx-"));
    await execAsync("git init -b main", { cwd: hostDir });
    await execAsync('git config user.email "test@test.com"', { cwd: hostDir });
    await execAsync('git config user.name "Test"', { cwd: hostDir });
    await writeFile(join(hostDir, "hello.txt"), "hello");
    await execAsync("git add -A && git commit -m init", { cwd: hostDir });
  });

  afterEach(async () => {
    await rm(hostDir, { recursive: true, force: true });
  });

  it("exposes Promise-based sandbox and executor exec", async () => {
    const result = await withWorktree(
      { agent: bob("default"), sandbox: noSandbox(), cwd: hostDir },
      async (ctx) => {
        const viaSandbox = await ctx.sandbox.exec("cat hello.txt", {
          cwd: ctx.cwd,
        });
        const viaExecutor = await ctx.executor.exec!("cat hello.txt", {
          cwd: ctx.cwd,
        });
        return [viaSandbox.stdout.trim(), viaExecutor.stdout.trim()];
      },
    );

    expect(result.value).toEqual(["hello", "hello"]);
  });
});
