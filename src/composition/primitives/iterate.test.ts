import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import { AgentError, ExecError } from "../../errors/errors.js";
import { iterate } from "./iterate.js";

const failWith = (error: AgentError | ExecError) =>
  Effect.runPromise(Effect.fail(error));

describe("iterate", () => {
  it("runs the callback once per iteration with 1-based numbers", async () => {
    const outcomes = await iterate({ maxIterations: 3 }, async (i) => i * 10);

    expect(outcomes).toEqual([
      { iteration: 1, result: 10 },
      { iteration: 2, result: 20 },
      { iteration: 3, result: 30 },
    ]);
  });

  it("stops early when shouldStop returns true, keeping that outcome", async () => {
    const shouldStop = vi.fn((result: string) => result === "done");
    let calls = 0;

    const outcomes = await iterate(
      { maxIterations: 5, shouldStop },
      async (i) => {
        calls++;
        return i === 2 ? "done" : "working";
      },
    );

    expect(calls).toBe(2);
    expect(outcomes).toEqual([
      { iteration: 1, result: "working" },
      { iteration: 2, result: "done" },
    ]);
    expect(shouldStop).toHaveBeenLastCalledWith("done", 2);
  });

  it("retries an AgentError surfaced through Effect.runPromise", async () => {
    const onRetry = vi.fn();
    let calls = 0;

    const outcomes = await iterate(
      { iterationRetries: 2, onRetry },
      async () => {
        calls++;
        if (calls === 1) await failWith(new AgentError({ message: "boom" }));
        return "ok";
      },
    );

    expect(calls).toBe(2);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(outcomes).toEqual([{ iteration: 1, result: "ok" }]);
  });

  it("retries a plain thrown tagged error", async () => {
    let calls = 0;

    await iterate({ iterationRetries: 1 }, async () => {
      calls++;
      if (calls === 1) throw new AgentError({ message: "boom" });
      return "ok";
    });

    expect(calls).toBe(2);
  });

  it("rethrows once retries are exhausted", async () => {
    let calls = 0;

    await expect(
      iterate({ iterationRetries: 1 }, async () => {
        calls++;
        return failWith(new AgentError({ message: "boom" }));
      }),
    ).rejects.toThrow("boom");
    expect(calls).toBe(2);
  });

  it("does not retry non-agent errors", async () => {
    let calls = 0;

    await expect(
      iterate({ iterationRetries: 3 }, async () => {
        calls++;
        return failWith(new ExecError({ command: "git", message: "nope" }));
      }),
    ).rejects.toThrow("nope");
    expect(calls).toBe(1);
  });

  it("stops before the next iteration when aborted", async () => {
    const controller = new AbortController();
    let calls = 0;

    await expect(
      iterate({ maxIterations: 3, signal: controller.signal }, async () => {
        calls++;
        controller.abort();
      }),
    ).rejects.toThrow();
    expect(calls).toBe(1);
  });
});
