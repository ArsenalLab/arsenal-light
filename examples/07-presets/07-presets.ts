/**
 * 07-presets.ts
 *
 * Layer 6 — createWorktree() / createSandbox(), the composition-root
 * presets that wrap the primitives from 01–05 for you.
 *
 * Everything in 03-worktree.ts and 04-iterate.ts — a fresh git branch, an
 * executor to run the agent against it, an iteration loop, commit
 * collection, cleanup — is real work you'd otherwise wire by hand every
 * time. `createWorktree()` does it in one call and gives back a `Worktree`
 * handle whose `.runAgent()` method *is* that whole stack (worktree +
 * iterate), called as many times as you like before `.close()`. It's named
 * `runAgent` rather than `run` specifically so it's never confused with the
 * top-level `run()` in 08-run.ts — that one owns and tears down its own
 * worktree per call; this one always reuses the same one.
 *
 * A `Worktree` can also go one step further with `.attachSandbox()`: it
 * starts a `Sandbox` — the same sandbox/container — eagerly and keeps it
 * alive across multiple `.exec()`/`.runAgent()` calls, instead of tearing it
 * down and rebuilding it each time `.runAgent()` is called. Use it when you
 * want to send several unrelated prompts, or run ad-hoc commands via
 * `.exec()`, against the same long-lived environment.
 *
 * (There's also a standalone `createSandbox()` preset — see
 * 07b-create-sandbox.ts — that creates its own branch + worktree + sandbox
 * in one call instead of reusing an existing `Worktree`. Reach for that when
 * you don't already have a `Worktree` handle to attach to; its own branch is
 * a required, explicit name that — unlike `merge-to-head` below — is not
 * deleted on close(), since named branches are meant to persist.)
 *
 * You're still one layer below the very top — 08-run.ts's run() is a single
 * call that does what this file's first section does in three (create,
 * run, close), for the common case of "one worktree, one run, then done".
 *
 * Run:
 *   npx tsx examples/07-presets.ts
 */

import "../_setup.js";
import { bob, noSandbox, createWorktree } from "../../src/index.js";

const provider = bob("default", { disableMcp: true });

// ---------------------------------------------------------------------------
// createWorktree() — one branch, reusable across multiple runAgent() calls.
// ---------------------------------------------------------------------------
console.log("=== createWorktree() + Worktree.runAgent() ===\n");

await using worktree = await createWorktree({
  branchStrategy: { type: "merge-to-head" },
});

const first = await worktree.runAgent({
  agent: provider,
  sandbox: noSandbox(),
  prompt: "In one sentence, what is the purpose of this repository?",
  maxIterations: 1,
});

console.log("Branch   :", worktree.branch);
console.log("Commits  :", first.commits.length);
console.log("Result   :", first.stdout.trim());

// Same worktree, a second call — no new branch, no new setup.
const second = await worktree.runAgent({
  agent: provider,
  sandbox: noSandbox(),
  prompt: "Now name one test framework this repo uses.",
  maxIterations: 1,
});

console.log("\nSecond result:", second.stdout.trim());

// ---------------------------------------------------------------------------
// worktree.attachSandbox() — a long-lived Sandbox backed by the same
// worktree: one sandbox stays up across an .exec() call and a .runAgent()
// call, instead of a fresh one per call the way Worktree.runAgent() above
// does.
// ---------------------------------------------------------------------------
console.log(
  "\n=== worktree.attachSandbox() + Sandbox.exec()/.runAgent() ===\n",
);

await using sandbox = await worktree.attachSandbox({ sandbox: noSandbox() });

const exec = await sandbox.exec("git log -1 --format=%s");
console.log("Last commit subject:", exec.stdout.trim());

const third = await sandbox.runAgent({
  agent: provider,
  prompt: "In one word: is this repository written in TypeScript or Python?",
  maxIterations: 1,
});
console.log("Third result:", third.stdout.trim());

// sandbox.close() and worktree.close() both run automatically via
// `await using`, innermost-declared-first: the sandbox tears down, then the
// worktree merges its commits back to HEAD and deletes its temp branch.
