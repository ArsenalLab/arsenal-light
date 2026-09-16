/**
 * Executors — the minimal process-launch contract `invokeAgent` runs through.
 *
 * `localExecutor` runs on the host. The contract itself (`AgentExecutor`) and
 * the sandbox-backed adapter (`sandboxExecutor`) live in `ports/` so
 * this file never depends on the sandbox layer.
 */

import { spawn } from "node:child_process";
import { constants } from "node:os";
import { Effect } from "effect";
import type { ExecResult } from "../../spi/types.js";
import { ExecError } from "../../errors/errors.js";
import type { AgentExecutor } from "../../ports/AgentExecutor.js";
import { runPromiseUnwrapped } from "../../ports/runEffect.js";

export type { AgentExecutor };

/**
 * Node reports `code: null` on `close` when a process was terminated by a
 * signal rather than exiting normally — coercing that straight to `0` would
 * hide a killed/crashed process as a clean exit. Fall back to the shell's own
 * 128+signal convention (e.g. 137 for SIGKILL), matching how exit codes from
 * `sh -c` are already interpreted elsewhere in this codebase.
 */
const toExitCode = (
  code: number | null,
  signal: NodeJS.Signals | null,
): number => code ?? (signal ? 128 + constants.signals[signal] : 0);

/**
 * Build a plain host executor — runs commands directly in the current process,
 * no sandbox or worktree required.
 *
 * Use this for `invokeAgent` at Level 0/1 when you have no `withWorktree` context.
 */
export const localExecutor = (
  cwd: string,
  env: Record<string, string> = {},
): AgentExecutor => {
  const processEnv = { ...process.env, ...env };
  return {
    exec: (command, opts) =>
      runPromiseUnwrapped(
        Effect.tryPromise({
          try: () =>
            new Promise<ExecResult>((resolve, reject) => {
              const isWindows = process.platform === "win32";
              const shellCmd = isWindows ? "cmd.exe" : "sh";
              const shellArgs = isWindows
                ? ["/d", "/s", "/c", command]
                : ["-c", command];
              const proc = spawn(shellCmd, shellArgs, {
                cwd: opts?.cwd ?? cwd,
                env: processEnv,
                stdio: [
                  opts?.stdin !== undefined ? "pipe" : "ignore",
                  "pipe",
                  "pipe",
                ],
                windowsVerbatimArguments: isWindows,
              });
              if (opts?.stdin !== undefined) {
                proc.stdin!.write(opts.stdin);
                proc.stdin!.end();
              }
              proc.on("error", (e) =>
                reject(new Error(`exec failed: ${e.message}`)),
              );
              const stdoutChunks: string[] = [];
              const stderrChunks: string[] = [];
              proc.stdout!.on("data", (chunk: Buffer) =>
                stdoutChunks.push(chunk.toString()),
              );
              proc.stderr!.on("data", (chunk: Buffer) =>
                stderrChunks.push(chunk.toString()),
              );
              proc.on("close", (code, signal) =>
                resolve({
                  stdout: stdoutChunks.join(""),
                  stderr: stderrChunks.join(""),
                  exitCode: toExitCode(code, signal),
                }),
              );
            }),
          catch: (e) =>
            new ExecError({
              command,
              message: `exec failed: ${e instanceof Error ? e.message : String(e)}`,
            }),
        }),
      ),
    interactiveExec: (args, opts) =>
      new Promise((resolve, reject) => {
        const [cmd, ...rest] = args;
        const proc = spawn(cmd!, rest, {
          cwd: opts.cwd ?? cwd,
          env: processEnv,
          stdio: ["pipe", "pipe", "inherit"],
          shell: process.platform === "win32",
        });
        (opts.stdin as NodeJS.ReadableStream).pipe(proc.stdin!);
        proc.stdout!.pipe(opts.stdout as NodeJS.WritableStream);
        proc.on("error", (e) => reject(new Error(`exec failed: ${e.message}`)));
        proc.on("close", (code, signal) =>
          resolve({ exitCode: toExitCode(code, signal) }),
        );
      }),
  };
};
