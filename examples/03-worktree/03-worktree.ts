/**
 * 03-worktree.ts
 *
 * Layer 2 — withWorktree() wrapped around the same invokeAgent call.
 *
 * Compare to 01-invoke.ts: the invokeAgent call is unchanged — same prompt,
 * same shape. What changed is where `executor` and `cwd` come from. Instead
 * of a bare `localExecutor` on the host's own working directory, they now
 * come from `ctx`, which withWorktree builds by creating a fresh git branch
 * (a "worktree"), running the callback inside it, then merging/collecting
 * commits and cleaning up.
 *
 * withWorktree knows nothing about what the agent does; invokeAgent knows
 * nothing about git. This is what "independent, opt-in layers" means in
 * practice — you could put withHooks (02-hooks.ts) around this same call
 * too; the two layers don't interact.
 *
 * Run:
 *   npx tsx examples/03-worktree.ts
 */

import "../_setup.js";
import { bob, noSandbox, invokeAgent, withWorktree } from "../../src/index.js";

const provider = bob("default");

const result = await withWorktree(
  { agent: provider, sandbox: noSandbox() },
  (ctx) =>
    invokeAgent({
      executor: ctx.executor,
      cwd: ctx.cwd,
      prompt: "In one sentence, what is the purpose of this repository?",
      provider,
    }),
);

console.log("\n--- Done ---");
console.log("Branch   :", result.branch);
console.log("Commits  :", result.commits.length);
console.log("Result   :", result.value.result.trim());
