/**
 * 08-run.ts
 *
 * Layer 7 — run(), the outermost preset. Everything below this file —
 * worktree, hooks, iteration, sessions, presets — collapses into one call.
 *
 * run({ agent, sandbox, prompt, ... }) is exactly the README's Quick Start.
 * Under the hood it's the same orchestration as 07-presets.ts's
 * createWorktree() + Worktree.runAgent() + close(), done in a single call for the
 * common case: one worktree, one run, then done.
 *
 * Part B also shows the built-in `output` option — the same structured-output
 * extraction 03d-structured-output.ts did by hand (regex + Zod), done for you
 * via `Output.object({ tag, schema })`.
 *
 * Run:
 *   npx tsx examples/08-run.ts
 */

import "../_setup.js";
import { bob, noSandbox, run, Output } from "../../src/index.js";
import { z } from "zod";

const provider = bob("default", { disableMcp: true });

// ---------------------------------------------------------------------------
// Part A: run() — the one-liner.
// ---------------------------------------------------------------------------
console.log("=== Part A: run() ===\n");

const result = await run({
  agent: provider,
  sandbox: noSandbox(),
  branchStrategy: { type: "merge-to-head" },
  prompt: "In one sentence, what is the purpose of this repository?",
});

console.log("Branch   :", result.branch);
console.log("Commits  :", result.commits.length);
console.log("Result   :", result.stdout.trim());

// ---------------------------------------------------------------------------
// Part B: run() with built-in structured output — compare to
// 03d-structured-output.ts, which did this extraction by hand.
// ---------------------------------------------------------------------------
console.log("\n=== Part B: run() with Output.object() ===\n");

const RepoSummarySchema = z.object({
  name: z.string(),
  purpose: z.string(),
  mainEntryPoint: z.string(),
});

const TAG = "repo-summary";

const structured = await run({
  agent: provider,
  sandbox: noSandbox(),
  branchStrategy: { type: "merge-to-head" },
  prompt: `
Analyse this repository and produce a summary.

Wrap your answer in <${TAG}></${TAG}> tags as a JSON object with these fields:
- name: the package name from package.json
- purpose: one sentence describing what this library does
- mainEntryPoint: the primary source entry point file

Output only the JSON inside the tags, no extra commentary outside them.
`.trim(),
  output: Output.object({ tag: TAG, schema: RepoSummarySchema }),
});

// structured.output is typed — no manual regex, no manual JSON.parse.
console.log("Name       :", structured.output.name);
console.log("Purpose    :", structured.output.purpose);
console.log("Main entry :", structured.output.mainEntryPoint);
