import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLogFilename, resolveLogging } from "./RunDisplay.js";

describe("resolveLogging", () => {
  it("returns the caller's logging option unchanged when given", () => {
    const logging = { type: "stdout" } as const;
    expect(resolveLogging({ logging, hostRepoDir: "/repo", branch: "b" })).toBe(
      logging,
    );
  });

  it("defaults to a log file under .arsenal/logs named by buildLogFilename", () => {
    expect(
      resolveLogging({
        logging: undefined,
        hostRepoDir: "/repo",
        branch: "arsenal/tmp-1",
        targetBranch: "main",
        name: "fixer",
      }),
    ).toEqual({
      type: "file",
      path: join(
        "/repo",
        ".arsenal",
        "logs",
        buildLogFilename("arsenal/tmp-1", "main", "fixer"),
      ),
    });
  });
});
