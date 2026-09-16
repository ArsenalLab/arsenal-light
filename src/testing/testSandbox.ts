/**
 * Test helper: creates a local (filesystem-based) SandboxOps for unit tests.
 * This replaces FilesystemSandbox which has been removed.
 */
import { Effect } from "effect";
import { spawn } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline";
import { BoundedTail, MAX_TAIL_CHARS } from "../utils/boundedTail.js";
import { CopyError, ExecError } from "../errors/errors.js";
import type { ExecResult, SandboxOps } from "../ports/SandboxOps.js";
import { createMockInteractiveExec } from "./mockAcpServer.js";

/**
 * Creates an isolated git global config env so that test sandbox
 * `git config --global` writes don't corrupt the developer's real ~/.gitconfig.
 */
const createIsolatedGitEnv = (): Record<string, string> => {
  const tmpDir = mkdtempSync(join(tmpdir(), "test-gitconfig-"));
  const globalConfigPath = join(tmpDir, ".gitconfig");
  writeFileSync(globalConfigPath, "");
  return { GIT_CONFIG_GLOBAL: globalConfigPath };
};

export const makeLocalSandbox = (sandboxDir: string): SandboxOps => {
  const gitEnv = createIsolatedGitEnv();
  const env = { ...process.env, ...gitEnv };

  return {
    exec: (command, options) => {
      return Effect.async<ExecResult, ExecError>((resume) => {
        const proc = spawn("sh", ["-c", command], {
          cwd: options?.cwd ?? sandboxDir,
          stdio: [
            options?.stdin !== undefined ? "pipe" : "ignore",
            "pipe",
            "pipe",
          ],
          env,
        });

        if (options?.stdin !== undefined) {
          proc.stdin!.write(options.stdin);
          proc.stdin!.end();
        }

        proc.on("error", (error) => {
          resume(
            Effect.fail(
              new ExecError({
                command,
                message: `Failed to exec: ${error.message}`,
              }),
            ),
          );
        });

        if (options?.onLine) {
          const onLine = options.onLine;
          const stdoutTail = new BoundedTail(MAX_TAIL_CHARS, "\n");
          const stderrTail = new BoundedTail(MAX_TAIL_CHARS, "");
          const rl = createInterface({ input: proc.stdout! });
          rl.on("line", (line) => {
            stdoutTail.push(line);
            onLine(line);
          });
          proc.stderr!.on("data", (chunk: Buffer) => {
            stderrTail.push(chunk.toString());
          });
          proc.on("close", (code) => {
            resume(
              Effect.succeed({
                stdout: stdoutTail.toString(),
                stderr: stderrTail.toString(),
                exitCode: code ?? 0,
              }),
            );
          });
        } else {
          const stdoutChunks: string[] = [];
          const stderrChunks: string[] = [];
          proc.stdout!.on("data", (chunk: Buffer) => {
            stdoutChunks.push(chunk.toString());
          });
          proc.stderr!.on("data", (chunk: Buffer) => {
            stderrChunks.push(chunk.toString());
          });
          proc.on("close", (code) => {
            resume(
              Effect.succeed({
                stdout: stdoutChunks.join(""),
                stderr: stderrChunks.join(""),
                exitCode: code ?? 0,
              }),
            );
          });
        }
      });
    },

    copyIn: (hostPath, sandboxPath) =>
      Effect.tryPromise({
        try: async () => {
          await mkdir(dirname(sandboxPath), { recursive: true });
          await copyFile(hostPath, sandboxPath);
        },
        catch: (e) =>
          new CopyError({
            message: `Failed to copy ${hostPath} -> ${sandboxPath}: ${e}`,
          }),
      }),

    copyFileOut: (sandboxPath, hostPath) =>
      Effect.tryPromise({
        try: async () => {
          await mkdir(dirname(hostPath), { recursive: true });
          await copyFile(sandboxPath, hostPath);
        },
        catch: (e) =>
          new CopyError({
            message: `Failed to copy ${sandboxPath} -> ${hostPath}: ${e}`,
          }),
      }),

    interactiveExec: async (args, options) => {
      const [cmd, ...rest] = args;
      // If the binary doesn't exist on PATH (e.g. mock unit tests invoking `bob acp`),
      // fall back to mock ACP agent behavior.
      return new Promise((resolve, reject) => {
        let spawned = false;
        // Set once the ENOENT fallback below takes over: the mock agent's own
        // promise then owns resolving this Promise, not the failed process's
        // `close` event (which otherwise wins the race and resolves first —
        // see the `close` handler below).
        let usingMockFallback = false;
        try {
          const proc = spawn(cmd!, rest, {
            cwd: options.cwd ?? sandboxDir,
            env,
            stdio: ["pipe", "pipe", "pipe"],
          });
          spawned = true;
          // Don't pipe stdin into proc.stdin until we know the process
          // actually launched. Node's 'spawn' and 'error' events are mutually
          // exclusive and 'spawn' fires before any data can flow — piping
          // eagerly instead would let a client's very first write race the
          // ENOENT failure: `.pipe()` puts options.stdin in flowing mode and
          // drains it into proc.stdin regardless of whether that write ever
          // lands anywhere, so by the time the fallback below creates the
          // mock, the request that should have reached it is already gone.
          // Leaving options.stdin unconsumed until then is safe — a Node
          // stream just buffers writes for whoever reads it first.
          proc.once("spawn", () => {
            (options.stdin as NodeJS.ReadableStream).pipe(proc.stdin!);
          });
          // `end: false` on both: a spawn that fails to launch (ENOENT) still
          // closes proc's stdio immediately, which would otherwise end the
          // caller's stdout/stderr streams via the default pipe() behavior —
          // before the ENOENT fallback below gets a chance to hand stdout to
          // the mock agent. stdout is ended explicitly in the `close` handler
          // once we know this wasn't a failed spawn; stderr (commonly the
          // long-lived `process.stderr`) is never ended by us — it's drained
          // here only so a chatty child can't block on a full pipe buffer.
          proc.stdout!.pipe(options.stdout as NodeJS.WritableStream, {
            end: false,
          });
          proc.stderr!.pipe(options.stderr as NodeJS.WritableStream, {
            end: false,
          });
          proc.on("error", async (e: any) => {
            if (e.code === "ENOENT") {
              usingMockFallback = true;
              const mock = createMockInteractiveExec({
                output: "mock agent output",
              });
              resolve(await mock(args, options));
            } else {
              reject(new Error(`exec failed: ${e.message}`));
            }
          });
          proc.on("close", (code) => {
            // A failed spawn fires `close` right after `error`; once the
            // ENOENT branch above has taken over, let its own promise decide
            // the result and leave options.stdout open for the mock to use.
            if (usingMockFallback) return;
            (options.stdout as NodeJS.WritableStream).end();
            resolve({ exitCode: code ?? 0 });
          });
        } catch (e: any) {
          if (!spawned && e.code === "ENOENT") {
            const mock = createMockInteractiveExec({
              output: "mock agent output",
            });
            mock(args, options).then(resolve, reject);
          } else {
            reject(e);
          }
        }
      });
    },
  };
};
