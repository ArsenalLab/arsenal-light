/**
 * 03b-prompt-file.ts
 *
 * Layer 2 variant — loading the prompt from a Markdown file, on top of
 * 03-worktree.ts.
 *
 * The prompt is just a string — read it from a file with readFileSync and
 * pass it to invokeAgent. No special API; withWorktree and invokeAgent are
 * unchanged from 03-worktree.ts.
 *
 * Run:
 *   npx tsx examples/03b-prompt-file.ts
 */

import "../_setup.js";
import { bob, noSandbox, invokeAgent, withWorktree } from "../../src/index.js";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const promptPath = join(process.cwd(), "examples", "_tmp-prompt.md");
writeFileSync(
  promptPath,
  `
# Task

List every exported function in \`src/index.ts\`.
Format the output as a bullet list with the function name and a one-line description.
`.trim(),
);

const provider = bob("default", { disableMcp: true });

try {
  const prompt = readFileSync(promptPath, "utf8");

  const result = await withWorktree(
    { agent: provider, sandbox: noSandbox() },
    (ctx) =>
      invokeAgent({
        executor: ctx.executor,
        cwd: ctx.cwd,
        prompt,
        provider,
      }),
  );

  console.log("\n--- Done ---");
  console.log("Commits  :", result.commits.length);
  console.log(result.value.result.trim());
} finally {
  unlinkSync(promptPath);
}
