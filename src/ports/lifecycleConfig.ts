/** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
export interface Timeouts {
  /** Timeout (ms) for the host-side copy of `copyToWorktree` paths into the worktree. Default: 60_000. */
  readonly copyToWorktreeMs?: number;
  /** Timeout (ms) for each in-sandbox git setup command (safe.directory, user.name/email, branch discovery). Default: 10_000. */
  readonly gitSetupMs?: number;
  /** Timeout (ms) for collecting the commits produced during the run. Default: 30_000. */
  readonly commitCollectionMs?: number;
  /** Timeout (ms) for merging the temp branch back to the host branch (merge-to-head strategy). Default: 30_000. */
  readonly mergeToHostMs?: number;
}

export type SandboxHooks = {
  readonly host?: {
    readonly onWorktreeReady?: ReadonlyArray<{
      readonly command: string;
      readonly timeoutMs?: number;
    }>;
    readonly onSandboxReady?: ReadonlyArray<{
      readonly command: string;
      readonly timeoutMs?: number;
    }>;
  };
  readonly sandbox?: {
    readonly onSandboxReady?: ReadonlyArray<{
      readonly command: string;
      readonly sudo?: boolean;
      readonly timeoutMs?: number;
    }>;
  };
};
