/**
 * User-facing alerts and error-attachment helpers shared by every
 * acquire/release-style sandbox lifecycle: `SandboxFactory.ts`'s
 * `WorktreeDockerSandboxFactory`, and `composition/createSandbox.ts` /
 * `createWorktree.ts`'s own close()/error-path cleanup. Split out of
 * `SandboxFactory.ts` so those `composition/` composition roots don't need to
 * import its much larger `acquireSandbox`/`withSandbox` orchestration just
 * for these three leaf functions.
 */

import { Effect } from "effect";
import { Display } from "../../../ports/Display.js";
import {
  AgentError,
  AgentIdleTimeoutError,
  type SandboxError,
} from "../../../errors/errors.js";
import type { SyncOutResult } from "../../sync/syncOut.js";

/**
 * Alert the user about a preserved worktree, with review and cleanup
 * instructions.
 */
export const alertWorktreePreserved = (
  worktreePath: string,
  reason: string,
): Effect.Effect<void, never, Display> =>
  Effect.flatMap(Display, (display) =>
    display.alert(
      [
        `\n${reason}`,
        `  To review: cd ${worktreePath}`,
        `  To clean up: git worktree remove --force ${worktreePath}`,
      ].join("\n"),
    ),
  );

/** Alert the user with `syncOut`'s recovery instructions, if it returned any. */
export const alertSyncOutRecovery = ({
  recoveryMessage,
}: SyncOutResult): Effect.Effect<void, never, Display> =>
  recoveryMessage === undefined
    ? Effect.void
    : Effect.flatMap(Display, (display) =>
        display.alert(`\n${recoveryMessage}`),
      );

/**
 * Attach the preserved worktree path to AgentIdleTimeoutError and AgentError
 * so programmatic callers can build on top of the preserved worktree.
 */
export const attachPreservedPath = <E>(
  path: string | undefined,
  e: E | SandboxError,
): E | SandboxError => {
  if (path !== undefined) {
    if (e instanceof AgentIdleTimeoutError) {
      return new AgentIdleTimeoutError({
        message: e.message,
        timeoutMs: e.timeoutMs,
        preservedWorktreePath: path,
      }) as unknown as E | SandboxError;
    }
    if (e instanceof AgentError) {
      return new AgentError({
        message: e.message,
        preservedWorktreePath: path,
      }) as unknown as E | SandboxError;
    }
  }
  return e;
};
