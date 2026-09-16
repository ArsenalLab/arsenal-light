import type { ExecResult, InteractiveExecOptions } from "../spi/types.js";

/**
 * The minimal execution contract `invokeAgent` needs.
 *
 * This is intentionally narrow — just enough to run an interactive ACP process.
 * Obtain one via:
 *   - `localExecutor(cwd, env)` — run directly on the host (no sandbox needed)
 *   - `ctx.executor` from `withWorktree` callback — uses that worktree's sandbox
 *   - `sandboxExecutor(sandbox)` — wrap any `SandboxCommands`
 */
export interface AgentExecutor {
  /** Run a command and collect its output (used for setup/checks). Rejects with `ExecError` if the command can't be launched. */
  readonly exec?: (
    command: string,
    options?: {
      onLine?: (line: string) => void;
      cwd?: string;
      stdin?: string;
    },
  ) => Promise<ExecResult>;
  /**
   * Launch an interactive process (ACP transport).
   */
  readonly interactiveExec?: (
    args: string[],
    options: InteractiveExecOptions,
  ) => Promise<{ exitCode: number }>;
}
