/**
 * 01a-abort.ts
 *
 * Layer 0 variant — cancelling invokeAgent mid-flight with AbortSignal.
 *
 * Same shape as 01-invoke.ts (bare localExecutor, no worktree) plus one
 * thing: an AbortController whose signal we pass in and fire on a timer.
 *
 * Abort is a Layer-0 concern on purpose. withWorktree (03-worktree.ts) runs
 * git lifecycle — setup, commit collection, cleanup — around the callback;
 * if the abort fires mid-setup, that lifecycle keeps running. Here there is
 * no lifecycle: invokeAgent is the only thing running, so the abort
 * terminates it immediately.
 *
 * When the signal fires, invokeAgent rejects with the signal's reason as-is;
 * check signal.aborted after catching to tell an abort from a real failure.
 *
 * Run:
 *   npx tsx examples/01a-abort.ts
 */

import "../_setup.js";
import { bob, localExecutor, invokeAgent } from "../../src/index.js";

const ac = new AbortController();
const abortTimer = setTimeout(() => {
  console.log("\n[example] Aborting after 8 seconds...");
  ac.abort("timeout-demo");
}, 8_000);

const provider = bob("default", { disableMcp: true });
const cwd = process.cwd();
const executor = localExecutor(cwd, provider.env);

try {
  const result = await invokeAgent({
    executor,
    cwd,
    prompt: `
For every TypeScript file in src/, open it, count its lines, and print the
result as "FILE: N lines". Process each file individually with a separate
read command — do not use wc or any batch tool. After every 5 files, pause
and summarise the running total so far, then continue. Do not stop until
every file has been processed.
`.trim(),
    provider,
    signal: ac.signal,
  });

  clearTimeout(abortTimer);
  console.log("\n--- Finished before abort ---");
  console.log("Session :", result.sessionId);
} catch (err) {
  clearTimeout(abortTimer);
  if (ac.signal.aborted) {
    console.log(`\n--- Aborted as expected (reason: ${ac.signal.reason}) ---`);
  } else {
    throw err;
  }
}
