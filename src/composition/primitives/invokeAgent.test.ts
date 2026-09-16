import { describe, expect, it } from "vitest";
import { bob } from "../../agents/bob/bob.js";
import { AgentError } from "../../errors/errors.js";
import { invokeAgent } from "./invokeAgent.js";
import { localExecutor } from "../../platform/node/localExecutor.js";

describe("invokeAgent (public Promise API)", () => {
  const provider = bob("default");

  it("rejects with the tagged AgentError itself, not an Effect wrapper", async () => {
    const rejection = await invokeAgent({
      executor: {},
      cwd: process.cwd(),
      prompt: "hi",
      provider,
    }).catch((e: unknown) => e);

    expect(rejection).toBeInstanceOf(AgentError);
    expect((rejection as AgentError).message).toContain("interactiveExec");
  });

  it("rejects with the abort reason when the signal is already aborted", async () => {
    const controller = new AbortController();
    const reason = new Error("stop");
    controller.abort(reason);

    const rejection = await invokeAgent({
      executor: localExecutor(process.cwd()),
      cwd: process.cwd(),
      prompt: "hi",
      provider,
      signal: controller.signal,
    }).catch((e: unknown) => e);

    expect(rejection).toBe(reason);
  });
});

describe("localExecutor", () => {
  it("exec resolves with stdout and exit code as a Promise", async () => {
    const result = await localExecutor(process.cwd()).exec!("echo hi");
    expect(result).toEqual({ stdout: "hi\n", stderr: "", exitCode: 0 });
  });
});
