/**
 * Command helpers shared by `syncIn` and `syncOut`. Both fail with
 * `SyncError`, so a failed sync step surfaces as one error type regardless of
 * which side (host or sandbox) the command ran on.
 */

import { Effect } from "effect";
import type { SandboxHandle } from "../../spi/SandboxProvider.js";
import { SyncError } from "../../errors/errors.js";
import { HostProcess } from "../../ports/HostProcess.js";

/**
 * Execute a command on the host side, returning stdout.
 * Fails with SyncError on non-zero exit.
 *
 * Threads an `AbortController` into `host.shell` and aborts it if this
 * Effect is interrupted (e.g. by a caller-supplied `withTimeout`) — without
 * it, a still-running `git bundle`/`git am` keeps mutating files on the host
 * after the timeout has already returned control to the caller.
 */
export const execHost = (
  command: string,
  cwd: string,
): Effect.Effect<string, SyncError, HostProcess> =>
  Effect.flatMap(HostProcess, (host) => {
    const controller = new AbortController();
    return host
      .shell(command, {
        cwd,
        maxBuffer: 10 * 1024 * 1024,
        signal: controller.signal,
      })
      .pipe(
        Effect.map(({ stdout }) => stdout),
        Effect.mapError(
          (e) =>
            new SyncError({
              message: `Host command failed: ${command}\n${e.message}`,
            }),
        ),
        Effect.onInterrupt(() => Effect.sync(() => controller.abort())),
      );
  });

/**
 * Execute a command in the sandbox, failing with SyncError if it exits non-zero.
 */
export const execHandleOk = (
  handle: SandboxHandle,
  command: string,
  options?: { cwd?: string },
): Effect.Effect<
  { stdout: string; stderr: string; exitCode: number },
  SyncError
> =>
  Effect.tryPromise({
    try: () => handle.exec(command, options),
    catch: (e) =>
      new SyncError({
        message: `Sandbox exec failed: ${command}\n${e instanceof Error ? e.message : String(e)}`,
      }),
  }).pipe(
    Effect.flatMap((result) =>
      result.exitCode !== 0
        ? Effect.fail(
            new SyncError({
              message: `Sandbox command failed (exit ${result.exitCode}): ${command}\n${result.stderr}`,
            }),
          )
        : Effect.succeed(result),
    ),
  );
