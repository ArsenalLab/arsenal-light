/**
 * 03e-custom-sandbox-provider.ts
 *
 * Layer 2 side quest — implementing a SandboxProvider from scratch, on top
 * of 03-worktree.ts.
 *
 * `noSandbox()` is Arsenal's only built-in sandbox provider. Everything
 * else — Docker, Podman, a remote box over SSH, a cloud sandbox like E2B or
 * Daytona — is something you write yourself against the `SandboxProvider`
 * contract, via one of two factories:
 *
 *   createBindMountSandboxProvider() — shared filesystem (like noSandbox);
 *     the worktree is visible inside the sandbox through a mount, so
 *     `transfer` is never called.
 *   createIsolatedSandboxProvider()  — independent filesystem; code only
 *     reaches the sandbox via `transfer.copyIn`/`copyFileOut`, which the
 *     provider must implement.
 *
 * This file shows the bind-mount shape. The provider below is a toy: its
 * `exec`/`interactiveExec` just spawn commands with plain `child_process`
 * on the host — exactly what `noSandbox()` does internally — but written
 * against `createBindMountSandboxProvider()`'s `create(options)` contract
 * instead of hand-building a raw SandboxHandle, and with logging added so
 * you can see when Arsenal calls in. A real provider would send `exec`'s
 * command over SSH/gRPC/`docker exec`/etc. instead of spawning locally, and
 * would use `options.mounts` (host:sandbox path pairs) and
 * `options.hostRepoPath` to configure the container/remote box's bind
 * mounts before it starts — this toy ignores both because it already
 * shares the host filesystem.
 *
 * `interactiveExec` specifically is what makes the sandbox usable by
 * invokeAgent()/run() — it's how Arsenal spawns the agent's ACP argv
 * (AgentProvider.buildAcpArgs()) inside the sandbox. `exec` alone is enough
 * for `Sandbox.exec()` and lifecycle hooks, but not for running an agent.
 *
 * Uses the fake AgentProvider from 01b-custom-provider.ts too, so — like
 * that example — this one runs with no BOB_API_KEY and no `bob` CLI.
 *
 * Run:
 *   npx tsx examples/03e-custom-sandbox-provider.ts
 */

import { spawn } from "node:child_process";
import {
  createBindMountSandboxProvider,
  invokeAgent,
  withWorktree,
} from "../../src/index.js";
import type { ExecResult, SandboxHandle } from "../../src/index.js";
import { createFakeAgentProvider } from "../_fakeAgentProvider.js";

const provider = createFakeAgentProvider();

const toyLocalSandbox = createBindMountSandboxProvider({
  name: "toy-local",
  create: async ({ worktreePath }): Promise<SandboxHandle> => {
    console.log("[toy-local] create() — worktree at", worktreePath);

    return {
      worktreePath,

      exec: (command, opts) =>
        new Promise<ExecResult>((resolve, reject) => {
          // PowerShell and cmd.exe don't ship `sh` on a standard Windows
          // install, so route the command string through cmd.exe there
          // instead — same per-platform shell selection noSandbox() uses
          // internally (see src/sandboxes/no-sandbox/no-sandbox.ts).
          const isWindows = process.platform === "win32";
          const shellCmd = isWindows ? "cmd.exe" : "sh";
          const shellArgs = isWindows
            ? ["/d", "/s", "/c", command]
            : ["-c", command];

          const proc = spawn(shellCmd, shellArgs, {
            cwd: opts?.cwd ?? worktreePath,
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

          const stdoutChunks: string[] = [];
          const stderrChunks: string[] = [];
          // Buffer partial lines across `data` chunks — a chunk boundary can
          // land mid-line, so only emit to onLine once a full line (up to
          // and including the trailing "\n") has arrived.
          let lineBuffer = "";
          proc.stdout.on("data", (chunk: Buffer) => {
            const text = chunk.toString();
            stdoutChunks.push(text);
            if (opts?.onLine) {
              lineBuffer += text;
              const lines = lineBuffer.split("\n");
              lineBuffer = lines.pop() ?? "";
              for (const line of lines) opts.onLine(line);
            }
          });
          proc.stderr.on("data", (chunk: Buffer) =>
            stderrChunks.push(chunk.toString()),
          );
          proc.on("error", reject);
          proc.on("close", (code) => {
            // Flush a trailing partial line that never got a "\n".
            if (opts?.onLine && lineBuffer.length > 0) {
              opts.onLine(lineBuffer);
            }
            resolve({
              stdout: stdoutChunks.join(""),
              stderr: stderrChunks.join(""),
              exitCode: code ?? 0,
            });
          });
        }),

      // What invokeAgent()/run() actually calls — spawns the agent's ACP
      // argv and wires its stdio to the streams Arsenal drives the JSON-RPC
      // handshake over.
      interactiveExec: (args, opts) =>
        new Promise((resolve, reject) => {
          const [cmd, ...rest] = args;
          const proc = spawn(cmd!, rest, {
            cwd: opts.cwd ?? worktreePath,
            stdio: ["pipe", "pipe", "inherit"],
          });
          (opts.stdin as NodeJS.ReadableStream).pipe(proc.stdin!);
          proc.stdout!.pipe(opts.stdout as NodeJS.WritableStream);
          proc.on("error", reject);
          proc.on("close", (code) => resolve({ exitCode: code ?? 0 }));
        }),

      close: async () => {
        console.log("[toy-local] close()");
      },
    };
  },
});

const result = await withWorktree(
  { agent: provider, sandbox: toyLocalSandbox },
  (ctx) =>
    invokeAgent({
      executor: ctx.executor,
      cwd: ctx.cwd,
      prompt: "What is the purpose of this repository?",
      provider,
    }),
);

console.log("\n--- Done ---");
console.log("Branch   :", result.branch);
console.log("Result   :", result.value.result.trim());
