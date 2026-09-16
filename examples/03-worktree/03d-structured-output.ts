/**
 * 03d-structured-output.ts
 *
 * Layer 2 variant — parsing typed JSON out of the agent's raw text, by hand,
 * on top of 03-worktree.ts.
 *
 * invokeAgent always returns raw text. At this layer there is no built-in
 * structured-output support — you ask the agent to wrap its answer in a tag,
 * then extract and validate that tag yourself.
 *
 * Compare to 08-run.ts, which uses run()'s built-in `output: Output.object(...)`
 * option to do the same extraction/validation for you.
 *
 * Run:
 *   npx tsx examples/03d-structured-output.ts
 */

import "../_setup.js";
import { bob, noSandbox, invokeAgent, withWorktree } from "../../src/index.js";
import { z } from "zod";

const RepoSummarySchema = z.object({
  name: z.string(),
  purpose: z.string(),
  mainEntryPoint: z.string(),
  testFramework: z.string(),
  approximateLoc: z.number(),
});

const TAG = "repo-summary";

const provider = bob("default", { disableMcp: true });

const result = await withWorktree(
  { agent: provider, sandbox: noSandbox() },
  (ctx) =>
    invokeAgent({
      executor: ctx.executor,
      cwd: ctx.cwd,
      prompt: `
Analyse this repository and produce a summary.

Wrap your answer in <${TAG}></${TAG}> tags as a JSON object with these fields:
- name: the package name from package.json
- purpose: one sentence describing what this library does
- mainEntryPoint: the primary source entry point file
- testFramework: the test framework used
- approximateLoc: approximate total lines of code as a number

Output only the JSON inside the tags, no extra commentary outside them.
`.trim(),
      provider,
    }),
);

// Extract the tag content from the raw result and validate with Zod — the
// part run()'s `output` option (08-run.ts) does for you.
const raw = result.value.result;
const match = raw.match(new RegExp(`<${TAG}>([\\s\\S]*?)<\\/${TAG}>`));
if (!match) throw new Error(`Tag <${TAG}> not found in output`);

const output = RepoSummarySchema.parse(JSON.parse(match[1]!));

console.log("\n--- Structured output ---");
console.log("Name           :", output.name);
console.log("Purpose        :", output.purpose);
console.log("Main entry     :", output.mainEntryPoint);
console.log("Test framework :", output.testFramework);
console.log("~Lines of code :", output.approximateLoc);
