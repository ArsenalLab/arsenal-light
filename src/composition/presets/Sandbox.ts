/**
 * Public types for `createSandbox()` and the long-lived `Sandbox` handle.
 */

import { Ref } from "effect";
import type { AgentProvider } from "../../spi/AgentProvider.js";
import { Display } from "../../ports/Display.js";
import { type IterationResult } from "../../application/orchestration/Orchestrator.js";
import { type PromptArgs } from "../../application/prompts/PromptArgumentSubstitution.js";
import type { LoggingOption } from "../../application/orchestration/RunConfig.js";
import type { SandboxHooks, Timeouts } from "../../ports/lifecycleConfig.js";
import { type SandboxOps } from "../../ports/SandboxOps.js";
import type {
  SandboxProvider,
  SandboxHandle,
  ExecResult,
} from "../../spi/SandboxProvider.js";
import { copyToWorktree } from "../../application/sandbox/worktree/CopyToWorktree.js";

export interface CreateSandboxOptions {
  /** Explicit branch for the worktree (required). */
  readonly branch: string;
  /**
   * Ref to fork from when `branch` does not yet exist. Ignored when the branch
   * already exists. Defaults to `HEAD`.
   */
  readonly baseBranch?: string;
  /** Sandbox provider (e.g. docker({ imageName: "arsenal:myrepo" })). */
  readonly sandbox: SandboxProvider;
  /**
   * Host repo directory. Replaces `process.cwd()` as the anchor for
   * `.arsenal/worktrees/`, `.arsenal/.env`, and git operations.
   *
   * - Relative paths are resolved against `process.cwd()`.
   * - Absolute paths are used as-is.
   * - Defaults to `process.cwd()` when omitted.
   */
  readonly cwd?: string;
  /** Lifecycle hooks grouped by execution location (host or sandbox). */
  readonly hooks?: SandboxHooks;
  /** Paths relative to the host repo root to copy into the worktree at creation time. */
  readonly copyToWorktree?: string[];
  /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
  readonly timeouts?: Timeouts;
  /** @internal Test-only overrides to bypass the sandbox provider. */
  readonly _test?: {
    readonly buildSandbox?: (sandboxDir: string) => SandboxOps;
  };
}

export interface SandboxRunOptions {
  /** Key-value map for {{KEY}} placeholder substitution in prompts. */
  readonly promptArgs?: PromptArgs;
  /** Substring(s) the agent emits to stop the iteration loop early. */
  readonly completionSignal?: string | string[];
  /** Idle timeout in seconds. Default: 600. */
  readonly idleTimeoutSeconds?: number;
  /** Grace window in seconds after a completion signal is observed but the agent process has not exited — e.g. a spawned `gh`/git subprocess or long-lived MCP server inherited the exec's stdout pipe and is keeping it open. Default: 60. */
  readonly completionTimeoutSeconds?: number;
  /** Display name for this run. */
  readonly name?: string;
  /** Logging mode. */
  readonly logging?: LoggingOption;
  /**
   * Number of additional attempts per iteration when the agent fails with an
   * agent error or idle timeout. Each retry spins up a completely fresh
   * sandbox. Default: 0 (no retries — fail immediately on first error). See
   * `OrchestrateOptions.iterationRetries` for full semantics.
   */
  readonly iterationRetries?: number;
  /**
   * An `AbortSignal` that cancels the run when aborted.
   *
   * - Pre-aborted signal rejects immediately without setup.
   * - Mid-iteration abort kills the in-flight agent subprocess.
   * - The rejected promise surfaces `signal.reason` verbatim.
   * - The `Sandbox` handle remains usable after abort — call `.runAgent()`
   *   again with a fresh signal, or `.close()` to tear down.
   */
  readonly signal?: AbortSignal;
  /** Agent provider to use (e.g. bob("default")). */
  readonly agent: AgentProvider;
  /** Inline prompt string (mutually exclusive with promptFile). */
  readonly prompt?: string;
  /** Path to a prompt file (mutually exclusive with prompt). */
  readonly promptFile?: string;
  /** Maximum iterations to run (default: 1). */
  readonly maxIterations?: number;
}

export interface SandboxRunResult {
  /** Per-iteration results (use `iterations.length` for the count). */
  readonly iterations: IterationResult[];
  /** The matched completion signal string, or undefined if none fired. */
  readonly completionSignal?: string;
  /** Combined stdout output from all agent iterations. */
  readonly stdout: string;
  /** List of commits made by the agent during the run. */
  readonly commits: { sha: string }[];
  /** Path to the log file, if logging was drained to a file. */
  readonly logFilePath?: string;
}

export interface SandboxInteractiveOptions {
  /** Agent provider to use (e.g. bob("default")). */
  readonly agent: AgentProvider;
  /** Inline prompt string (mutually exclusive with promptFile). */
  readonly prompt?: string;
  /** Path to a prompt file (mutually exclusive with prompt). */
  readonly promptFile?: string;
  /** Key-value map for {{KEY}} placeholder substitution in prompts. */
  readonly promptArgs?: PromptArgs;
  /** Display name for this interactive session. */
  readonly name?: string;
  /**
   * An `AbortSignal` that cancels the interactive session when aborted.
   *
   * - Pre-aborted signal rejects immediately without setup.
   * - The rejected promise surfaces `signal.reason` verbatim.
   * - The `Sandbox` handle remains usable after abort.
   */
  readonly signal?: AbortSignal;
}

export interface SandboxInteractiveResult {
  /** List of commits made during the interactive session. */
  readonly commits: { sha: string }[];
  /** Exit code of the interactive process. */
  readonly exitCode: number;
}

export interface CloseResult {
  /** Host path to the preserved worktree, set when the worktree had uncommitted changes. */
  readonly preservedWorktreePath?: string;
}

export interface Sandbox {
  /** The branch the worktree is on. */
  readonly branch: string;
  /** Host path to the worktree. */
  readonly worktreePath: string;
  /**
   * Invoke an agent inside *this* existing sandbox — reuses the
   * worktree/container already set up by `createSandbox()` or
   * `Worktree.attachSandbox()`. Unlike the top-level `run()`, this never
   * creates or tears down a sandbox itself; call `.close()` for that. Safe
   * to call repeatedly against the same `Sandbox` handle. Named `runAgent`
   * (not `run`) precisely so it can't be confused with the top-level `run()`.
   */
  runAgent(options: SandboxRunOptions): Promise<SandboxRunResult>;
  /**
   * Launch an interactive agent session inside *this* existing sandbox —
   * same reuse semantics as `.runAgent()` above, just a live/attached session
   * instead of a one-shot prompt. There is no top-level `interactive()`;
   * this method is the only way to start one.
   */
  interactive(
    options: SandboxInteractiveOptions,
  ): Promise<SandboxInteractiveResult>;
  /**
   * Execute a command inside the existing sandbox.
   *
   * `cwd` defaults to the sandbox repo path (same default `.interactive()`
   * uses), so callers get the same working directory across providers. Pass
   * `cwd` to override.
   *
   * Returns the full `ExecResult` — non-zero `exitCode` is surfaced, not
   * thrown. Callers that want strict semantics should check `result.exitCode`
   * themselves (matching the contract of `SandboxHandle.exec`).
   */
  exec(command: string, options?: SandboxExecOptions): Promise<ExecResult>;
  /**
   * Tear down the sandbox container/handle. For a `Sandbox` returned by
   * top-level `createSandbox()`, this also removes the worktree (or
   * preserves it, reported via `CloseResult`, if it has uncommitted
   * changes). For a `Sandbox` returned by `Worktree.attachSandbox()`, the
   * worktree is owned by that `Worktree` — this call leaves it in place;
   * call the owning `Worktree.close()` to remove it.
   */
  close(): Promise<CloseResult>;
  /** Auto teardown via `await using`. */
  [Symbol.asyncDispose](): Promise<void>;
}

/** Options accepted by `Sandbox.exec()`. Mirrors the provider handle's `exec` options. */
export interface SandboxExecOptions {
  /** Per-line stdout callback for streaming output. */
  readonly onLine?: (line: string) => void;
  /** Working directory for the command. Defaults to the sandbox repo path. */
  readonly cwd?: string;
  /** Run the command with sudo, when the provider supports it. */
  readonly sudo?: boolean;
  /** Stdin payload — piped to the child process and then closed. Avoids the Linux 128 KB per-arg limit. */
  readonly stdin?: string;
}
