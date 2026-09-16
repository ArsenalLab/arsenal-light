/**
 * Sync-in: transfer a host git repo into an isolated sandbox via git bundle.
 *
 * Creates a git bundle capturing all refs from the host repo,
 * copies it into the sandbox via the provider's copyIn, and
 * clones from the bundle inside the sandbox.
 */

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Effect } from "effect";
import type { SandboxHandle } from "../../spi/SandboxProvider.js";
import { SyncError } from "../../errors/errors.js";
import type { HostProcess } from "../../ports/HostProcess.js";
import { execHandleOk, execHost } from "./syncExec.js";

/**
 * Sync a host git repo into an isolated sandbox.
 *
 * 1. `git bundle create --all` on the host
 * 2. `copyIn` the bundle to the sandbox
 * 3. `git clone` from the bundle inside the sandbox
 * 4. Verify HEAD matches
 *
 * @returns The branch name that was checked out
 */
export const syncIn = (
  hostRepoDir: string,
  handle: SandboxHandle,
): Effect.Effect<{ branch: string }, SyncError, HostProcess> =>
  Effect.gen(function* () {
    // Get current branch from host
    const branch = (yield* execHost(
      "git rev-parse --abbrev-ref HEAD",
      hostRepoDir,
    )).trim();

    // Create git bundle on host capturing all refs
    const bundleDir = yield* Effect.tryPromise({
      try: () => mkdtemp(join(tmpdir(), "arsenal-bundle-")),
      catch: (e) =>
        new SyncError({
          message: `Failed to create temp dir: ${e instanceof Error ? e.message : String(e)}`,
        }),
    });
    const bundleHostPath = join(bundleDir, "repo.bundle");

    yield* Effect.ensuring(
      Effect.gen(function* () {
        yield* execHost(
          `git bundle create "${bundleHostPath}" --all`,
          hostRepoDir,
        );

        // Create temp dir in sandbox and copy bundle in
        const mkTempResult = yield* execHandleOk(
          handle,
          "mktemp -d -t arsenal-XXXXXX",
        );
        const sandboxTmpDir = mkTempResult.stdout.trim();
        const bundleSandboxPath = `${sandboxTmpDir}/repo.bundle`;

        yield* Effect.tryPromise({
          // `transfer` is guaranteed present — syncIn is only ever called
          // with an isolated provider's handle.
          try: () => handle.transfer!.copyIn(bundleHostPath, bundleSandboxPath),
          catch: (e) =>
            new SyncError({
              message: `Failed to copy bundle into sandbox: ${e instanceof Error ? e.message : String(e)}`,
            }),
        });

        // Clone from bundle into the worktree
        const worktreePath = handle.worktreePath;
        yield* execHandleOk(
          handle,
          `git clone "${bundleSandboxPath}" "${worktreePath}_clone"`,
        );

        // Move contents from clone into worktree (git clone requires empty target)
        yield* execHandleOk(
          handle,
          `rm -rf "${worktreePath}" && mv "${worktreePath}_clone" "${worktreePath}"`,
        );

        // Checkout the correct branch
        yield* execHandleOk(handle, `git checkout "${branch}"`, {
          cwd: worktreePath,
        });

        // Clean up sandbox temp files
        yield* Effect.tryPromise({
          try: () => handle.exec(`rm -rf "${sandboxTmpDir}"`),
          catch: () =>
            new SyncError({ message: "Failed to clean up sandbox temp dir" }),
        });

        // Verify sync succeeded
        const hostHead = (yield* execHost(
          "git rev-parse HEAD",
          hostRepoDir,
        )).trim();
        const sandboxHead = (yield* execHandleOk(handle, "git rev-parse HEAD", {
          cwd: worktreePath,
        })).stdout.trim();

        if (hostHead !== sandboxHead) {
          yield* Effect.fail(
            new SyncError({
              message: `HEAD mismatch after sync-in: host=${hostHead} sandbox=${sandboxHead}`,
            }),
          );
        }
      }),
      // Clean up host-side bundle temp dir (runs regardless of success/failure)
      Effect.promise(() => rm(bundleDir, { recursive: true, force: true })),
    );

    return { branch };
  });
