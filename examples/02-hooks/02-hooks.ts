/**
 * 02-hooks.ts
 *
 * Layer 1 — withHooks() wrapped around 01-invoke.ts.
 *
 * Everything below is identical to 01-invoke.ts: same bare localExecutor,
 * same cwd, same invokeAgent call. The only thing added is a host hook that
 * runs before the callback.
 *
 * withHooks is setup-only — it runs host `onWorktreeReady` → host
 * `onSandboxReady` → sandbox `onSandboxReady` (in that order) before calling
 * `work`, then returns whatever `work` returns. There is no teardown phase.
 *
 * It's independent of withWorktree (03-worktree.ts) — you can have hooks
 * without git isolation, git isolation without hooks, or (08-run.ts) both
 * at once via the run() preset.
 *
 * Run:
 *   npx tsx examples/02-hooks.ts
 */

import "../_setup.js";
import { bob, localExecutor, invokeAgent, withHooks } from "../../src/index.js";

const provider = bob("default");
const cwd = process.cwd();
const executor = localExecutor(cwd, provider.env);

// Note: onWorktreeReady is a host hook name from the lifecycle API. It runs
// here even though there is no worktree — withHooks executes host hooks
// unconditionally; the name reflects intent, not a requirement.
//
// The hook command is run through the host's shell with `cwd` passed as the
// process's working directory (not interpolated into the command string), so
// it's safe even if `cwd` contains shell metacharacters. Use `pwd` rather
// than interpolating `cwd` into the command text to print the same path.
const result = await withHooks(
  { host: { onWorktreeReady: [{ command: 'echo "[hook] ready at $(pwd)"' }] } },
  { cwd },
  () =>
    invokeAgent({
      executor,
      cwd,
      prompt: "In one sentence, what is the purpose of this repository?",
      provider,
    }),
);

console.log("\n--- Done ---");
console.log("Result :", result.result.trim());
