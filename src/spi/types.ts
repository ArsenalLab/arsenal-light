/**
 * Shared primitive types used across layers.
 *
 * These are intentionally free of sandbox, worktree, or agent concepts so
 * that low-level primitives (e.g. `invokeAgent`, `AcpSession`) can import
 * them without coupling to the sandbox layer.
 */

/** Result returned by a command execution. */
export interface ExecResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
}

/** Streams wired to an interactive process (ACP transport). */
export interface InteractiveExecOptions {
  readonly stdin: NodeJS.ReadableStream;
  readonly stdout: NodeJS.WritableStream;
  readonly stderr: NodeJS.WritableStream;
  readonly cwd?: string;
}
