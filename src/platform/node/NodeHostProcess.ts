/**
 * Node implementation of the `HostProcess` port, backed by `child_process`.
 */

import { exec, execFile } from "node:child_process";
import { Effect, Layer } from "effect";
import {
  HostCommandError,
  HostProcess,
  type HostCommandOptions,
  type HostCommandOutput,
  type HostProcessService,
} from "../../ports/HostProcess.js";

const toNodeOptions = (options: HostCommandOptions | undefined) => ({
  encoding: "utf8" as const,
  ...(options?.cwd !== undefined ? { cwd: options.cwd } : {}),
  ...(options?.env !== undefined
    ? { env: { ...process.env, ...options.env } }
    : {}),
  ...(options?.signal !== undefined ? { signal: options.signal } : {}),
  ...(options?.maxBuffer !== undefined ? { maxBuffer: options.maxBuffer } : {}),
});

const settle =
  (
    resume: (
      effect: Effect.Effect<HostCommandOutput, HostCommandError>,
    ) => void,
  ) =>
  (
    error: { message: string; code?: string | number | null } | null,
    stdout: string | Buffer,
    stderr: string | Buffer,
  ): void => {
    if (error) {
      resume(
        Effect.fail(
          new HostCommandError({
            message: error.message,
            stdout: String(stdout ?? ""),
            stderr: String(stderr ?? ""),
            exitCode: typeof error.code === "number" ? error.code : null,
          }),
        ),
      );
    } else {
      resume(
        Effect.succeed({ stdout: String(stdout), stderr: String(stderr) }),
      );
    }
  };

export const nodeHostProcess: HostProcessService = {
  platform: process.platform,
  shell: (command, options) =>
    Effect.async((resume) => {
      const child = exec(command, toNodeOptions(options), settle(resume));
      // Interruption (e.g. `withTimeout` racing this against a deadline)
      // otherwise leaves the underlying child process running — kill it so a
      // timed-out hook actually stops instead of continuing in the background.
      return Effect.sync(() => {
        child.kill();
      });
    }),
  run: (file, args, options) =>
    Effect.async((resume) => {
      const child = execFile(
        file,
        [...args],
        toNodeOptions(options),
        settle(resume),
      );
      return Effect.sync(() => {
        child.kill();
      });
    }),
};

export const NodeHostProcess = {
  layer: Layer.succeed(HostProcess, nodeHostProcess),
};
