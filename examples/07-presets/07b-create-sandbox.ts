/**
 * 07b-create-sandbox.ts
 *
 * Layer 6 side quest — the standalone `createSandbox()` preset, a sibling of
 * `createWorktree()` from 07-presets.ts rather than something built on top
 * of it.
 *
 * 07-presets.ts's `worktree.attachSandbox()` needs a `Worktree` handle to
 * attach to — it reuses a worktree you already created. `createSandbox()`
 * skips that: it creates its own branch + worktree + sandbox in a single
 * call and hands back a `Sandbox` handle directly, for callers who just want
 * "one sandbox, backed by one branch" without a separate `createWorktree()`
 * step first.
 *
 * Two differences from everything in 07-presets.ts/07a-named-branch.ts
 * follow from that:
 *
 *   - `branch` is required and explicit (no `merge-to-head` option) — there
 *     is no separate `Worktree` owner to merge commits back into, so the
 *     branch this call creates *is* the persistent record of what the agent
 *     did.
 *   - `.close()` never deletes that branch, only the worktree checkout under
 *     `.arsenal/worktrees/` — matching `{ type: "branch" }` in
 *     07a-named-branch.ts, not the `merge-to-head` cleanup in 07-presets.ts.
 *
 * Run this example twice and the second run reuses the same branch/worktree
 * instead of failing, same as 07a-named-branch.ts.
 *
 * Run:
 *   npx tsx examples/07b-create-sandbox.ts
 */

import "../_setup.js";
import { bob, noSandbox, createSandbox } from "../../src/index.js";

const provider = bob("default", { disableMcp: true });
const branch = "arsenal/repo-summary-sandbox";

await using sandbox = await createSandbox({
  branch,
  sandbox: noSandbox(),
});

const exec = await sandbox.exec("git log -1 --format=%s");
console.log("Last commit subject:", exec.stdout.trim());

const result = await sandbox.runAgent({
  agent: provider,
  prompt: "In one sentence, what is the purpose of this repository?",
  maxIterations: 1,
});

console.log("Branch   :", sandbox.branch);
console.log("Commits  :", result.commits.length);
console.log("Result   :", result.stdout.trim());

// Same sandbox, a second call — no new branch, no new container.
const second = await sandbox.runAgent({
  agent: provider,
  prompt: "Now name one test framework this repo uses.",
  maxIterations: 1,
});

console.log("\nSecond result:", second.stdout.trim());

console.log(
  `\n"${branch}" is a real branch in your repo, left in place by`,
  "sandbox.close() — push it and open a PR:",
);
console.log(`  git push origin ${branch}`);

// sandbox.close() runs automatically via `await using`. It tears down the
// container and removes the .arsenal/worktrees/ checkout, but — since there
// is no `merge-to-head` option here — leaves the "arsenal/repo-summary-sandbox"
// branch itself untouched.
