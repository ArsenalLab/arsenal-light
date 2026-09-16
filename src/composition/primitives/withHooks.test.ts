import { describe, expect, it, vi } from "vitest";
import { ExecError } from "../../errors/errors.js";
import type { SandboxCommands } from "../../ports/SandboxOps.js";
import { withHooks } from "./withHooks.js";

const fakeSandbox = (
  exitCode = 0,
): SandboxCommands & { commands: string[] } => {
  const commands: string[] = [];
  return {
    commands,
    exec: vi.fn(async (command: string) => {
      commands.push(command);
      return { stdout: "", stderr: "boom", exitCode };
    }),
    copyIn: async () => {},
    copyFileOut: async () => {},
  };
};

describe("withHooks", () => {
  it("runs sandbox hooks through Promise-based SandboxCommands, then the work", async () => {
    const sandbox = fakeSandbox();
    const result = await withHooks(
      { sandbox: { onSandboxReady: [{ command: "npm ci" }] } },
      { cwd: "/repo", sandbox },
      async () => "done",
    );

    expect(sandbox.commands).toEqual(["npm ci"]);
    expect(result).toBe("done");
  });

  it("rejects with ExecError itself when a sandbox hook exits non-zero", async () => {
    const work = vi.fn(async () => "never");
    const rejection = await withHooks(
      { sandbox: { onSandboxReady: [{ command: "false" }] } },
      { cwd: "/repo", sandbox: fakeSandbox(1) },
      work,
    ).catch((e: unknown) => e);

    expect(rejection).toBeInstanceOf(ExecError);
    expect(work).not.toHaveBeenCalled();
  });

  it("rejects when sandbox hooks are configured without a sandbox", async () => {
    await expect(
      withHooks(
        { sandbox: { onSandboxReady: [{ command: "npm ci" }] } },
        { cwd: "/repo" },
        async () => "never",
      ),
    ).rejects.toThrow("sandbox is required");
  });
});
