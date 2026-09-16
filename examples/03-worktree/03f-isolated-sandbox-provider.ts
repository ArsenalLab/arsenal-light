/**
 * 03f-isolated-sandbox-provider.ts
 *
 * Layer 2 side quest — implementing an *isolated* SandboxProvider, the other
 * half of 03e-custom-sandbox-provider.ts's bind-mount example.
 *
 * `noSandbox()` and 03e's `toy-local` provider share the host filesystem —
 * the worktree just *is* a directory Arsenal can see, so `transfer` is never
 * called. A real cloud sandbox (E2B, Daytona, a fresh Firecracker VM, a
 * from-scratch Docker container with no bind mount) has its own, independent
 * filesystem instead: Arsenal can't see inside it, so it reaches the
 * worktree only through the two methods on `SandboxHandle.transfer` that a
 * bind-mount provider never implements:
 *
 *   copyIn(hostPath, sandboxPath)      — used once, at startup, to ship a
 *                                        `git bundle` of the host repo in
 *                                        (see application/sync/syncIn.ts)
 *   copyFileOut(sandboxPath, hostPath) — used once, at the end, to copy each
 *                                        `git format-patch` file (and any
 *                                        untracked files) back out
 *                                        (see application/sync/syncOut.ts)
 *
 * You never call `copyIn`/`copyFileOut` yourself — `withWorktree()`/`run()`
 * call them automatically because this provider's `tag` is `"isolated"`
 * rather than `"bind-mount"`. This toy fakes "independent filesystem" with a
 * second temp directory instead of a real remote box, but the shape below —
 * `create()` returns a handle with no pre-existing worktree content, and
 * `transfer` moves bytes in and out explicitly — is exactly what a real E2B
 * or Daytona integration looks like.
 *
 * Also note the branch strategy: isolated providers can never use `"head"`
 * (there's no host working directory to write into), so `withWorktree()`
 * defaults to `"merge-to-head"` here without being told — see
 * 07a-named-branch.ts for pairing a named branch with an isolated-style
 * workflow instead.
 *
 * Uses the fake AgentProvider from 01b-custom-provider.ts, so — like
 * 03e — this runs with no BOB_API_KEY and no `bob` CLI.
 *
 * Run:
 *   npx tsx examples/03f-isolated-sandbox-provider.ts
 */

import { spawn } from "node:child_process";
import { copyFile, cp, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  createIsolatedSandboxProvider,
  invokeAgent,
  withWorktree,
} from "../../src/index.js";
import type { ExecResult, SandboxHandle } from "../../src/index.js";
import { createFakeAgentProvider } from "../_fakeAgentProvider.js";

const provider = createFakeAgentProvider();

const toyIsolatedSandbox = createIsolatedSandboxProvider({
  name: "toy-isolated",
  create: async (): Promise<SandboxHandle> => {
    // A directory unrelated to the host repo — this stands in for the
    // independent filesystem a real cloud sandbox would give you. syncIn()
    // populates it a moment from now via `git clone` into `worktreePath`.
    const remoteRoot = await mkdtemp(join(tmpdir(), "arsenal-isolated-"));
    const worktreePath = join(remoteRoot, "repo");

    console.log("[toy-isolated] create() — remote root at", remoteRoot);

    return {
      worktreePath,

      exec: (command, opts) =>
        new Promise<ExecResult>((resolve, reject) => {
          // Fall back to remoteRoot, not worktreePath: syncIn() runs `mktemp`,
          // `git clone`, `mv`, etc. against this handle *before* worktreePath
          // exists (it's created by that very clone) — spawning with a
          // nonexistent cwd fails with a misleading ENOENT. remoteRoot always
          // exists for the life of the sandbox.
          const proc = spawn("sh", ["-c", command], {
            cwd: opts?.cwd ?? remoteRoot,
          });
          const stdoutChunks: string[] = [];
          const stderrChunks: string[] = [];
          proc.stdout.on("data", (chunk: Buffer) => {
            const text = chunk.toString();
            stdoutChunks.push(text);
            if (opts?.onLine) {
              for (const line of text.split("\n")) opts.onLine(line);
            }
          });
          proc.stderr.on("data", (chunk: Buffer) =>
            stderrChunks.push(chunk.toString()),
          );
          proc.on("error", reject);
          proc.on("close", (code) =>
            resolve({
              stdout: stdoutChunks.join(""),
              stderr: stderrChunks.join(""),
              exitCode: code ?? 0,
            }),
          );
        }),

      // What invokeAgent()/run() actually calls — spawns the agent's ACP
      // argv and wires its stdio to the streams Arsenal drives the JSON-RPC
      // handshake over. Identical to 03e's — transport isn't what changes
      // between a bind-mount and an isolated provider, file access is.
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

      // The part 03e's bind-mount provider doesn't need: explicit, one-shot
      // file transfer in and out of the isolated filesystem. A real provider
      // would implement these over the cloud API's own upload/download calls
      // instead of a local `cp`.
      transfer: {
        copyIn: async (hostPath, sandboxPath) => {
          console.log("[toy-isolated] copyIn:", hostPath, "->", sandboxPath);
          await mkdir(dirname(sandboxPath), { recursive: true });
          await cp(hostPath, sandboxPath, { recursive: true });
        },
        copyFileOut: async (sandboxPath, hostPath) => {
          console.log(
            "[toy-isolated] copyFileOut:",
            sandboxPath,
            "->",
            hostPath,
          );
          await mkdir(dirname(hostPath), { recursive: true });
          await copyFile(sandboxPath, hostPath);
        },
      },

      close: async () => {
        console.log("[toy-isolated] close() — removing", remoteRoot);
        await rm(remoteRoot, { recursive: true, force: true });
      },
    };
  },
});

const result = await withWorktree(
  { agent: provider, sandbox: toyIsolatedSandbox },
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
