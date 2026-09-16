/**
 * Single-quote a string for safe inclusion in a POSIX shell command line.
 *
 * Shared by any code that builds a shell command string to hand to
 * `SandboxHandle.exec` — e.g. `worktreeSandbox.ts` quoting a path before
 * passing it to `git config --add safe.directory`.
 */
export const shellQuote = (value: string): string =>
  `'${value.replace(/'/g, `'\\''`)}'`;
