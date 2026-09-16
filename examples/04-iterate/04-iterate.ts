/**
 * 04-iterate.ts
 *
 * Layer 3 — iterate() wrapped around 03-worktree.ts, stateless.
 *
 * Each iteration gets its own withWorktree call (fresh branch, fresh git
 * base) AND its own fresh agent process. There is no context carry-over
 * between iterations — each one starts cold with only the prompt text.
 *
 * This is the right model when iterations are independent: each one either
 * finds work to do (commits + continues) or signals completion.
 *
 * For stateful iteration where each prompt builds on prior context, see
 * 05-session.ts — same withWorktree + iterate shape, but a shared
 * AgentSession replaces the fresh-process-per-call default.
 *
 * Run:
 *   npx tsx examples/04-iterate.ts
 */

import "../_setup.js";
import {
  bob,
  noSandbox,
  invokeAgent,
  withWorktree,
  iterate,
} from "../../src/index.js";

const COMPLETION_SIGNAL = "<promise>COMPLETE</promise>";
const provider = bob("default", { disableMcp: true });

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
          completionSignal: COMPLETION_SIGNAL,
        }),
    ),
);

console.log(
  "\n--- Iteration summary (stateless — fresh process per iteration) ---",
);
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
