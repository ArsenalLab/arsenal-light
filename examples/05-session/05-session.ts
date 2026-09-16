/**
 * 05-session.ts
 *
 * Layer 4 — AgentSession wrapped around 04-iterate.ts, stateful.
 *
 * This is the ACP-specific capability that has no exec equivalent.
 *
 * When you pass `session` to invokeAgent, it reuses that persistent process
 * for every call instead of spawning a fresh one. Each iteration sees the
 * full context of all prior iterations — Bob remembers what it already did.
 *
 * Compare to 04-iterate.ts:
 *   04-iterate.ts — fresh process per iteration, no context carry-over
 *   05-session.ts — one shared process, full context across iterations
 *
 * The outer layers — withWorktree, iterate, git branch, commit collection —
 * are exactly the same. Only the agent process lifetime changes.
 *
 * Note: the session is created once and shared across all iterations and all
 * withWorktree calls. The worktree (git isolation) is still per-iteration —
 * the session only shares agent context, not the filesystem.
 *
 * Run:
 *   npx tsx examples/05-session.ts
 */

import "../_setup.js";
import {
  bob,
  noSandbox,
  invokeAgent,
  withWorktree,
  iterate,
  AgentSession,
} from "../../src/index.js";

const COMPLETION_SIGNAL = "<promise>COMPLETE</promise>";
const provider = bob("default", { disableMcp: true });

// One session shared across all iterations.
// Bob keeps full context between invokeAgent calls.
// The session spawns whatever `provider` asks for, so provider options
// (here `disableMcp`) apply to the long-lived process too.
await using session = await AgentSession.create(provider, {
  cwd: process.cwd(),
});

const outcomes = await iterate(
  {
    maxIterations: 5,
    // Stop as soon as the agent signals there is nothing left to do.
    shouldStop: (result) => result.value.completionSignal !== undefined,
  },
  (i: number) =>
    withWorktree(
      {
        agent: provider,
        sandbox: noSandbox(),
        branchStrategy: { type: "merge-to-head" },
        name: `iter-${i}`,
      },
      (ctx) =>
        invokeAgent({
          executor: ctx.executor,
          cwd: ctx.cwd,
          prompt: `
Search for any TypeScript TODO comments in src/.
If you find one, add a one-line stub implementation and commit the change.
If there are no TODOs left, output exactly: ${COMPLETION_SIGNAL}
`.trim(),
          provider,
          session, // ← reuse the live process; forces ACP transport
          completionSignal: COMPLETION_SIGNAL,
        }),
    ),
);

console.log(
  "\n--- Iteration summary (stateful — shared session across iterations) ---",
);
console.log("Session ID     :", session.sessionId);
console.log("Iterations run :", outcomes.length);

let totalCommits = 0;

for (const { iteration, result } of outcomes) {
  totalCommits += result.commits.length;
  console.log(
    `  [${iteration}] commits: ${result.commits.length}  signal: ${result.value.completionSignal ?? "(none)"}`,
  );
}

const signalFired =
  outcomes.at(-1)?.result.value.completionSignal !== undefined;
console.log("Stopped by signal:", signalFired);
console.log("Total commits    :", totalCommits);
