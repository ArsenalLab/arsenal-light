import { Effect, Exit, Layer } from "effect";
import { describe, expect, it } from "vitest";
import {
  HostCommandError,
  HostProcess,
  type HostProcessService,
} from "../../ports/HostProcess.js";
import { ExecError } from "../../errors/errors.js";
import { runHostHooks } from "../../application/sandbox/lifecycle/hooks.js";
import { nodeHostProcess } from "./NodeHostProcess.js";

describe("nodeHostProcess", () => {
  it("shell resolves with stdout and layers env over the host environment", async () => {
    const { stdout } = await Effect.runPromise(
      nodeHostProcess.shell(
        'printf "%s:%s" "$ARSENAL_TEST_VAR" "${HOME:+home}"',
        {
          env: { ARSENAL_TEST_VAR: "set" },
        },
      ),
    );
    expect(stdout).toBe("set:home");
  });

  it("run fails with HostCommandError carrying stderr and the exit code", async () => {
    const exit = await Effect.runPromiseExit(
      nodeHostProcess.run("sh", ["-c", "echo oops >&2; exit 3"]),
    );
    expect(Exit.isFailure(exit)).toBe(true);
    if (Exit.isFailure(exit) && exit.cause._tag === "Fail") {
      const error = exit.cause.error;
      expect(error).toBeInstanceOf(HostCommandError);
      expect(error.stderr.trim()).toBe("oops");
      expect(error.exitCode).toBe(3);
    }
  });
});

describe("HostProcess port", () => {
  it("lets engine code run against a substituted implementation", async () => {
    const commands: string[] = [];
    const fake: HostProcessService = {
      platform: "test",
      shell: (command) =>
        command === "fail"
          ? Effect.fail(
              new HostCommandError({
                message: "boom",
                stdout: "",
                stderr: "",
                exitCode: 1,
              }),
            )
          : Effect.sync(() => {
              commands.push(command);
              return { stdout: "", stderr: "" };
            }),
      run: () => Effect.die("not used"),
    };
    const layer = Layer.succeed(HostProcess, fake);

    await Effect.runPromise(
      runHostHooks([{ command: "a" }, { command: "b" }], "/repo").pipe(
        Effect.provide(layer),
      ),
    );
    expect(commands).toEqual(["a", "b"]);

    const exit = await Effect.runPromiseExit(
      runHostHooks([{ command: "fail" }], "/repo").pipe(Effect.provide(layer)),
    );
    expect(
      Exit.isFailure(exit) &&
        exit.cause._tag === "Fail" &&
        exit.cause.error instanceof ExecError,
    ).toBe(true);
  });
});
