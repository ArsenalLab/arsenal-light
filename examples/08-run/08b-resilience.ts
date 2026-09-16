/**
 * 08b-resilience.ts
 *
 * Layer 7 side quest — the run() options that matter once an agent runs
 * unattended instead of watched in a terminal: idle/completion timeouts,
 * lifecycle-step timeouts, and automatic retries.
 *
 * A single interactive session forgives a slow git operation or a stuck
 * agent because a human is watching and can just wait or Ctrl+C. A fleet of
 * scheduled jobs can't — one hung run should fail fast and get retried
 * instead of blocking a queue forever. These options are what make that
 * possible:
 *
 *   idleTimeoutSeconds       — fail the iteration if the agent produces no
 *                              output for this long (default 600s/10min).
 *   completionTimeoutSeconds — grace period after the completion signal is
 *                              seen, for a lingering child process (a `gh`
 *                              call, an MCP server) to actually exit
 *                              (default 60s).
 *   timeouts                 — per-lifecycle-step budgets (copying files
 *                              into the worktree, git setup inside the
 *                              sandbox, collecting commits, merging back) —
 *                              independent of the agent's own timeouts above.
 *   iterationRetries         — extra attempts per iteration, each on a
 *                              completely fresh sandbox, if the agent
 *                              process itself errors or idles out (default
 *                              0 — fail immediately).
 *
 * `signal` (an AbortSignal) is the other resilience primitive — see
 * 01a-abort.ts — and works identically when passed to run().
 *
 * This wires all of them into one call with reasonable unattended-job
 * values; it doesn't force any of them to fire. In production, the usual
 * move is to *raise* idleTimeoutSeconds for a slow codebase or a big
 * install step, not lower it.
 *
 * Run:
 *   npx tsx examples/08b-resilience.ts
 */

import "../_setup.js";
import { bob, noSandbox, run } from "../../src/index.js";

const provider = bob("default", { disableMcp: true });

const result = await run({
  agent: provider,
  sandbox: noSandbox(),
  branchStrategy: { type: "merge-to-head" },
  prompt: "In one sentence, what is the purpose of this repository?",

  idleTimeoutSeconds: 300,
  completionTimeoutSeconds: 30,
  iterationRetries: 2,
  timeouts: {
    gitSetupMs: 15_000,
    commitCollectionMs: 20_000,
  },
});

console.log("\n--- Done ---");
console.log("Iterations run :", result.iterations.length);
console.log("Result         :", result.stdout.trim());
