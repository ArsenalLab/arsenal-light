import { existsSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { Effect } from "effect";
import {
  CopyToWorktreeError,
  CopyToWorktreeTimeoutError,
  withTimeout,
} from "../../../errors/errors.js";
import { HostProcess } from "../../../ports/HostProcess.js";

const COPY_TO_WORKTREE_TIMEOUT_MS = 60_000;

/**
 * Returns cp flags for copy-on-write support:
 * - macOS (darwin): `-cR` uses APFS clonefile
 * - Other (Linux, etc.): `-R --reflink=auto` uses GNU coreutils reflink
 */
export const getCopyOnWriteFlags = (platform: string): string[] =>
  platform === "darwin" ? ["-cR"] : ["-R", "--reflink=auto"];

/** True if `child` resolves to `parent` itself or somewhere underneath it. */
const isWithin = (parent: string, child: string): boolean => {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
};

/**
 * Copy files and directories from the host repo root to the worktree root,
 * using copy-on-write when the filesystem supports it.
 * Missing paths are silently skipped.
 */
export const copyToWorktree = (
  paths: string[],
  hostRepoDir: string,
  worktreePath: string,
  timeoutMs?: number,
): Effect.Effect<
  void,
  CopyToWorktreeTimeoutError | CopyToWorktreeError,
  HostProcess
> => {
  const effectiveTimeout = timeoutMs ?? COPY_TO_WORKTREE_TIMEOUT_MS;
  return Effect.gen(function* () {
    const host = yield* HostProcess;
    const cowFlags = getCopyOnWriteFlags(host.platform);
    // Killed when the timeout below interrupts this Effect, so a `cp`
    // (or the `rm -rf`/`mkdir -p` steps around it) can't keep mutating the
    // worktree after CopyToWorktreeTimeoutError has already been returned.
    const controller = new AbortController();

    // Each path's copy is independent (distinct source/dest), so they run
    // concurrently instead of one at a time. Each runs via `Effect.either`
    // so a failure doesn't interrupt the others — `Effect.all` preserves
    // input order in its results regardless of completion order, so scanning
    // for the first failure below always reports the same path's error the
    // original sequential loop would have (the first failing path *in the
    // caller's list*), even though completion order is now concurrent.
    const copyResults = yield* Effect.all(
      paths.flatMap((relativePath) => {
        const src = join(hostRepoDir, relativePath);
        const dest = join(worktreePath, relativePath);
        // Reject any path that escapes its root (e.g. via `..` segments)
        // before it ever reaches a shell-executed `cp`/`rm`/`mkdir`.
        if (!isWithin(hostRepoDir, src) || !isWithin(worktreePath, dest)) {
          return [
            Effect.fail(
              new CopyToWorktreeError({
                message: `Refusing to copy '${relativePath}': resolves outside the worktree`,
                path: relativePath,
                stderr: "",
                exitCode: null,
              }),
            ).pipe(Effect.either),
          ];
        }
        if (!existsSync(src)) {
          return [];
        }
        const runOpts = { signal: controller.signal };
        return [
          // Replace the destination outright rather than `cp`-ing into it:
          // `cp -R src dest` nests as dest/<basename(src)> when dest already
          // exists, so clear it first and recreate its parent directory
          // (paths can be nested under a directory the checkout doesn't have
          // yet) so `cp` always creates `dest` fresh as an exact copy of `src`.
          host.run("rm", ["-rf", dest], runOpts).pipe(
            Effect.andThen(() =>
              host.run("mkdir", ["-p", dirname(dest)], runOpts),
            ),
            Effect.andThen(() =>
              host
                .run("cp", [...cowFlags, src, dest], runOpts)
                // Fall back to a regular copy if copy-on-write is not supported
                .pipe(
                  Effect.catchAll(() =>
                    host.run("cp", ["-R", src, dest], runOpts),
                  ),
                ),
            ),
            Effect.mapError(
              (error) =>
                new CopyToWorktreeError({
                  message: `Failed to copy ${relativePath} to worktree: ${error.stderr || error.message}`,
                  path: relativePath,
                  stderr: error.stderr || error.message,
                  exitCode: error.exitCode,
                }),
            ),
            Effect.either,
          ),
        ];
      }),
      { concurrency: "unbounded" },
    ).pipe(Effect.onInterrupt(() => Effect.sync(() => controller.abort())));
    for (const result of copyResults) {
      if (result._tag === "Left") {
        yield* Effect.fail(result.left);
      }
    }
  }).pipe(
    withTimeout(
      effectiveTimeout,
      () =>
        new CopyToWorktreeTimeoutError({
          message: `Copying files to worktree timed out after ${effectiveTimeout}ms`,
          timeoutMs: effectiveTimeout,
          paths,
        }),
    ),
  );
};
