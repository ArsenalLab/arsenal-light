/**
 * 01-invoke.ts
 *
 * Layer 0 (the core) — invokeAgent() alone.
 *
 * This is the innermost primitive in Arsenal. There is no sandbox, no git
 * worktree, no hooks, no iteration loop — just a bare `localExecutor`
 * (spawns `bob` directly on the host, in the host's own working directory)
 * and one call to invokeAgent().
 *
 * Every other example in this set is this same call with one more layer
 * wrapped around it. Read this file first; it's the thing everything else
 * builds on.
 *
 * Run:
 *   npx tsx examples/01-invoke.ts
 */

import "../_setup.js";
import { bob, localExecutor, invokeAgent } from "../../src/index.js";

const provider = bob("default");
const cwd = process.cwd();

// No worktree, no sandbox — the agent runs directly in this repo's working
// directory. Keep prompts read-only at this layer; nothing here isolates
// or undoes a write.
const executor = localExecutor(cwd, provider.env);

const result = await invokeAgent({
  executor,
  cwd,
  prompt: "In one sentence, what is the purpose of this repository?",
  provider,
});

console.log("\n--- Done ---");
console.log("Session :", result.sessionId ?? "(none)");
console.log("Result  :", result.result.trim());
