/**
 * 03a-options.ts
 *
 * Layer 2 variant — BobOptions and usage reporting, on top of 03-worktree.ts.
 *
 * Same withWorktree + invokeAgent shape as 03-worktree.ts. The only addition
 * is configuring the provider itself: BobOptions are passed to bob() and
 * become flags on the `bob acp` process (disableMcp, disableSubagents,
 * logLevel, ...). bob() throws for options `bob acp` has no flag for
 * (maxTurns, maxCost, disableToolGroups, workspace, or a non-default model).
 *
 * This is orthogonal to which layer you're at — the same BobOptions apply
 * whether you're calling invokeAgent bare (01) or through run() (08).
 *
 * Run:
 *   npx tsx examples/03-worktree/03a-options.ts
 */

import "../_setup.js";
import { bob, noSandbox, invokeAgent, withWorktree } from "../../src/index.js";

const provider = bob("default", {
  disableMcp: true,
  disableSubagents: true,
  logLevel: "warn",
});

const result = await withWorktree(
  { agent: provider, sandbox: noSandbox() },
  (ctx) =>
    invokeAgent({
      executor: ctx.executor,
      cwd: ctx.cwd,
      prompt: "List all TypeScript source files in src/ and count them.",
      provider,
    }),
);

console.log("\n--- Done ---");
console.log("Result   :", result.value.result.trim());

const u = result.value.usage;
if (u) {
  const parts: string[] = [];
  if (u.costUsd !== undefined) parts.push(`cost: $${u.costUsd.toFixed(6)}`);
  if (u.durationMs !== undefined)
    parts.push(`duration: ${(u.durationMs / 1000).toFixed(2)}s`);
  if (u.toolCalls !== undefined) parts.push(`tool calls: ${u.toolCalls}`);
  console.log("Usage    :", parts.join("  ") || "(no usage data)");
}
