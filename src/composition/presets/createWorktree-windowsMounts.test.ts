/**
 * Tests that worktree.runAgent() (from createWorktree())
 * calls patchGitMountsForWindows between resolveGitMounts and launchSandboxHandle,
 * mirroring the SandboxFactory pattern.
 */
import { exec } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Effect } from "effect";
import { createMockInteractiveExec } from "../../testing/mockAcpServer.js";

const execAsync = promisify(exec);

const mockPatchGitMountsForWindows = vi.fn(
  (
    gitMounts: Array<{ hostPath: string; sandboxPath: string }>,
    _worktreePath: string,
    _sandboxRepoDir: string,
  ) => gitMounts,
);

vi.mock(
  "../../application/sandbox/mounts/mountUtils.js",
  async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
      ...actual,
      patchGitMountsForWindows: (
        gitMounts: Array<{ hostPath: string; sandboxPath: string }>,
        worktreePath: string,
        sandboxRepoDir: string,
      ) =>
        Effect.succeed(
          mockPatchGitMountsForWindows(gitMounts, worktreePath, sandboxRepoDir),
        ),
    };
  },
);

import { createWorktree } from "./createWorktree.js";
import {
  createBindMountSandboxProvider,
  type SandboxHandle,
  type ExecResult,
} from "../../spi/SandboxProvider.js";
import { SANDBOX_REPO_DIR } from "../../application/sandbox/mounts/mountUtils.js";
import { bob } from "../../agents/bob/bob.js";

/** Format a minimal stream-json response so the orchestrator parses agent output. */
const toStreamJson = (output: string): string => {
  const lines: string[] = [];
  lines.push(
    JSON.stringify({ type: "message", role: "assistant", content: output }),
  );
  lines.push(
    JSON.stringify({ type: "result", status: "success", result: output }),
  );
  return lines.join("\n");
};

const makeRunProvider = () =>
  createBindMountSandboxProvider({
    name: "capture-wt-run",
    create: async (options) => {
      const handle: SandboxHandle = {
        worktreePath: options.worktreePath,
        exec: async (
          command: string,
          execOptions?: {
            cwd?: string;
            onLine?: (line: string) => void;
            sudo?: boolean;
          },
        ): Promise<ExecResult> => {
          if (command.includes("bob run")) {
            const stream = toStreamJson("done");
            if (execOptions?.onLine) {
              for (const line of stream.split("\n")) execOptions.onLine(line);
            }
            return { stdout: stream, stderr: "", exitCode: 0 };
          }
          return { stdout: "", stderr: "", exitCode: 0 };
        },
        close: async () => {},
        interactiveExec: createMockInteractiveExec({ output: "done" }),
      };
      return handle;
    },
  });

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

describe("createWorktree() Windows mount patching", () => {
  let hostDir: string;

  afterEach(async () => {
    mockPatchGitMountsForWindows.mockClear();
    if (hostDir) {
      await rm(hostDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("worktree.runAgent() calls patchGitMountsForWindows with the worktree path", async () => {
    hostDir = await mkdtemp(join(tmpdir(), "wm-test-wt-run-"));
    await initRepo(hostDir);
    await commitFile(hostDir, "init.txt", "init", "initial commit");

    const ws = await createWorktree({
      branchStrategy: { type: "branch", branch: "wt-run-win" },
      cwd: hostDir,
    });

    const provider = makeRunProvider();

    try {
      await ws.runAgent({
        agent: bob("default"),
        sandbox: provider,
        prompt: "test",
        logging: { type: "stdout" },
      });

      expect(mockPatchGitMountsForWindows).toHaveBeenCalledTimes(1);
      const call = mockPatchGitMountsForWindows.mock.calls[0]!;
      const gitMounts = call[0];
      const worktreePath = call[1];
      const sandboxRepoDir = call[2];
      expect(Array.isArray(gitMounts)).toBe(true);
      expect(worktreePath).toBe(ws.worktreePath);
      expect(sandboxRepoDir).toBe(SANDBOX_REPO_DIR);
    } finally {
      await ws.close();
    }
  });
});
