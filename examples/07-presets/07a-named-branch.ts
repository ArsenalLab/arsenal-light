/**
 * 07a-named-branch.ts
 *
 * Layer 6 side quest — the "branch" strategy on createWorktree(), on top of
 * 07-presets.ts.
 *
 * 07-presets.ts's createWorktree() used `{ type: "merge-to-head" }`: a
 * temporary branch that gets merged into the host's current branch and
 * deleted on close(). Passing `{ type: "branch", branch: "..." }` instead
 * puts every `.runAgent()` call's commits on an explicit, named branch that is
 * never deleted when the worktree closes — the shape most "run an agent
 * unattended, then open a PR for review" pipelines want: push the branch
 * and let a human (or CI) review it before it ever touches the host's own
 * branch.
 *
 * Run this example twice and the second run reuses the same branch and
 * worktree instead of failing — useful for a scheduled job that keeps
 * appending commits to one long-lived branch across multiple invocations.
 *
 * Run:
 *   npx tsx examples/07a-named-branch.ts
 */

import "../_setup.js";
import { bob, noSandbox, createWorktree } from "../../src/index.js";

const provider = bob("default", { disableMcp: true });
const branch = "arsenal/repo-summary";

await using worktree = await createWorktree({
  branchStrategy: { type: "branch", branch },
});

const result = await worktree.runAgent({
  agent: provider,
  sandbox: noSandbox(),
  prompt: "In one sentence, what is the purpose of this repository?",
  maxIterations: 1,
});

console.log("Branch   :", worktree.branch);
console.log("Commits  :", result.commits.length);
console.log("Result   :", result.stdout.trim());

console.log(
  `\n"${branch}" is a real branch in your repo, left in place by`,
  "worktree.close() — push it and open a PR:",
);
console.log(`  git push origin ${branch}`);

// worktree.close() runs automatically via `await using`. It removes the
// .arsenal/worktrees/ checkout directory, but — unlike merge-to-head above —
// leaves the "arsenal/repo-summary" branch itself untouched, since named
// branches are meant to persist across runs.
