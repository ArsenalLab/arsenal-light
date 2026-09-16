/**
 * 01b-custom-provider.ts
 *
 * Layer 0 side quest — implementing AgentProvider from scratch, on top of
 * 01-invoke.ts.
 *
 * Every other example in this set imports `bob` — Arsenal's only built-in
 * AgentProvider, wrapping IBM's Bob-Shell CLI. This file implements the
 * interface directly instead, against a tiny fake ACP agent
 * (_fakeAgentCli.mjs) that never calls out to any real model. That makes
 * this the one example in this set that runs with no BOB_API_KEY and no
 * `bob` CLI installed — useful for seeing the shape of the interface
 * without either.
 *
 * An AgentProvider is two methods:
 *   buildAcpArgs()     — argv to launch the CLI as an ACP server over stdio
 *   parseAcpUpdate(u)  — turn one ACP `session/update` notification into
 *                        zero or more ParsedStreamEvent ("text", "tool_call", ...)
 *
 * Arsenal owns everything else: spawning the process, the JSON-RPC
 * handshake (initialize -> session/new -> session/prompt), idle timeouts,
 * abort wiring, and completion-signal matching over the "text" events your
 * parseAcpUpdate returns. A provider only has to speak for its own CLI at
 * those two seams.
 *
 * The parseAcpUpdate below handles exactly one ACP event kind
 * (agent_message_chunk) because that's all _fakeAgentCli.mjs emits.
 * Compare with bob()'s real one (src/application/acp/parseAcpUpdate.ts) —
 * it also handles agent_thought_chunk (chain-of-thought), tool_call /
 * tool_call_update (with result correlation), and usage_update.
 *
 * Run:
 *   npx tsx examples/01b-custom-provider.ts
 */

import { localExecutor, invokeAgent } from "../../src/index.js";
import { createFakeAgentProvider } from "../_fakeAgentProvider.js";

const provider = createFakeAgentProvider();
const cwd = process.cwd();
const executor = localExecutor(cwd, provider.env);

const result = await invokeAgent({
  executor,
  cwd,
  prompt: "What is the purpose of this repository?",
  provider,
});

console.log("\n--- Done ---");
console.log("Session :", result.sessionId ?? "(none)");
console.log("Result  :", result.result.trim());
