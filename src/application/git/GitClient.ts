/**
 * `GitClient` — the seam `SandboxLifecycle.ts` uses for every host-side git
 * operation (identity, current branch, merge, commit collection).
 *
 * `makeGitClient` is generic over how a command actually runs — it only
 * needs a function that executes `git ...` in some `cwd` and resolves with
 * stdout (rejecting on non-zero exit, matching `child_process.exec`'s own
 * contract). `LocalGitClient` below is `makeGitClient` fed the real local
 * `child_process.exec`, and is the only `GitClient` implementation Arsenal
 * ships. The `GitExec` seam mainly exists so tests can inject a different
 * execution channel without changing `GitClientService` or
 * `SandboxLifecycle.ts`.
 *
 * Failure semantics are deliberately per-operation, not homogenized:
 * `currentBranch`/`revParseHead` die on an unexpected rejection;
 * `identity`/`hasCommitsInRange`/`revList`/`deleteBranch` are best-effort and
 * never fail; `mergeBranch` is the one genuinely typed failure, carrying a
 * descriptive recovery message.
 */
import { Context, Effect, Layer } from "effect";
import { HostProcess } from "../../ports/HostProcess.js";
import { runPromiseUnwrapped } from "../../ports/runEffect.js";

export interface GitIdentity {
  readonly name: string;
  readonly email: string;
}

export interface GitClientService {
  /** `git rev-parse --abbrev-ref HEAD` — the current branch name. */
  readonly currentBranch: (cwd: string) => Effect.Effect<string, never>;
  /** `git config user.name` / `user.email`. Best-effort — empty string per field when unset or unavailable. */
  readonly identity: (cwd: string) => Effect.Effect<GitIdentity, never>;
  /** `git rev-parse HEAD` — the current commit SHA. */
  readonly revParseHead: (cwd: string) => Effect.Effect<string, never>;
  /** Whether `range` (e.g. `"<base>..HEAD"`) contains any commits. Best-effort — `false` on failure. */
  readonly hasCommitsInRange: (
    cwd: string,
    range: string,
  ) => Effect.Effect<boolean, never>;
  /** SHAs in `range`, oldest first. Best-effort — empty array on failure. */
  readonly revList: (
    cwd: string,
    range: string,
  ) => Effect.Effect<string[], never>;
  /**
   * `git merge <branch>`. On failure, the error message names both branches
   * and the manual recovery commands — the temp branch is never deleted by
   * this call, so the message's recovery instructions stay valid.
   */
  readonly mergeBranch: (
    cwd: string,
    branch: string,
    targetBranchName: string,
  ) => Effect.Effect<void, Error>;
  /** `git branch -D <branch>`. Best-effort — swallows failure. */
  readonly deleteBranch: (
    cwd: string,
    branch: string,
  ) => Effect.Effect<void, never>;
}

export class GitClient extends Context.Tag("GitClient")<
  GitClient,
  GitClientService
>() {}

/**
 * Runs `command` in `cwd`, resolving with stdout and rejecting on non-zero
 * exit — the minimal contract `makeGitClient` needs from any execution
 * channel.
 */
export type GitExec = (
  command: string,
  cwd: string,
) => Promise<{ stdout: string }>;

/**
 * Build a `GitClientService` against any `GitExec` channel. See the file
 * header for the failure-semantics contract each method preserves.
 */
export const makeGitClient = (gitExec: GitExec): GitClientService => ({
  currentBranch: (cwd) =>
    Effect.promise(async () => {
      const { stdout } = await gitExec("git rev-parse --abbrev-ref HEAD", cwd);
      return stdout.trim();
    }),

  identity: (cwd) =>
    Effect.promise(async () => {
      const [name, email] = await Promise.all([
        gitExec("git config user.name", cwd)
          .then((r) => r.stdout.trim())
          .catch(() => ""),
        gitExec("git config user.email", cwd)
          .then((r) => r.stdout.trim())
          .catch(() => ""),
      ]);
      return { name, email };
    }),

  revParseHead: (cwd) =>
    Effect.promise(async () => {
      const { stdout } = await gitExec("git rev-parse HEAD", cwd);
      return stdout.trim();
    }),

  hasCommitsInRange: (cwd, range) =>
    Effect.promise(async () => {
      try {
        const { stdout } = await gitExec(
          `git rev-list "${range}" --count`,
          cwd,
        );
        return parseInt(stdout.trim(), 10) > 0;
      } catch {
        return false;
      }
    }),

  revList: (cwd, range) =>
    Effect.promise(async () => {
      try {
        const { stdout } = await gitExec(
          `git rev-list "${range}" --reverse`,
          cwd,
        );
        const lines = stdout.trim();
        return lines ? lines.split("\n") : [];
      } catch {
        return [];
      }
    }),

  mergeBranch: (cwd, branch, targetBranchName) =>
    Effect.tryPromise({
      try: async () => {
        try {
          await gitExec(`git merge "${branch}"`, cwd);
        } catch {
          throw new Error(
            `Merge of '${branch}' onto '${targetBranchName}' failed. ` +
              `The temporary branch '${branch}' has been preserved. ` +
              `To retry: git merge ${branch}, ` +
              `then clean up: git branch -D ${branch}`,
          );
        }
      },
      catch: (e) => (e instanceof Error ? e : new Error(String(e))),
    }),

  deleteBranch: (cwd, branch) =>
    Effect.promise(() =>
      gitExec(`git branch -D "${branch}"`, cwd).catch(() => {}),
    ).pipe(Effect.asVoid),
});

/**
 * `makeGitClient` fed the host's shell through the `HostProcess` port — git
 * against the local repo. The only `GitClient` implementation Arsenal ships.
 */
export const LocalGitClient: Layer.Layer<GitClient, never, HostProcess> =
  Layer.effect(
    GitClient,
    Effect.map(HostProcess, (host) =>
      makeGitClient((command, cwd) =>
        runPromiseUnwrapped(host.shell(command, { cwd })),
      ),
    ),
  );
