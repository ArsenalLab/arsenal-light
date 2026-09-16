/**
 * 03c-prompt-template.ts
 *
 * Layer 2 variant — {{PLACEHOLDER}} template substitution, on top of
 * 03-worktree.ts.
 *
 * Template substitution is a plain string operation done before the call.
 * The outer composition — withWorktree, invokeAgent — is unchanged from
 * 03-worktree.ts; only the prompt text varies per loop iteration here.
 *
 * Run:
 *   npx tsx examples/03c-prompt-template.ts
 */

import "../_setup.js";
import { bob, noSandbox, invokeAgent, withWorktree } from "../../src/index.js";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Use a uniquely-named file under the OS temp dir rather than a fixed path
// under examples/ — a fixed name could collide with (and clobber) a
// pre-existing file of the same name.
const templatePath = join(
  tmpdir(),
  `arsenal-example-03c-tmp-template-${process.pid}-${randomUUID()}.md`,
);

writeFileSync(
  templatePath,
  `Look at the file {{FILE}} in this repository.
In 2-3 sentences, summarize what it does and why it exists.`,
);

const filesToDescribe = [
  "src/index.ts",
  "src/agents/bob.ts",
  "src/sandboxes/no-sandbox.ts",
];

const provider = bob("default", { disableMcp: true });
const template = readFileSync(templatePath, "utf8");

try {
  for (const file of filesToDescribe) {
    console.log(`\n=== Describing ${file} ===`);

    const prompt = template.replace(/\{\{FILE\}\}/g, file);

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

    console.log(result.value.result.trim());
    console.log("--- commits:", result.commits.length);
  }
} finally {
  unlinkSync(templatePath);
}
