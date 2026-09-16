/**
 * 06a-multi-turn.ts
 *
 * Layer 5 variant — accumulated context across turns, on top of
 * 06-acp-session.ts.
 *
 * Because the same process stays alive, Bob remembers everything from
 * prior turns. This is the key distinction from invokeAgent: invokeAgent
 * is one-shot by default, with no memory between calls (05-session.ts shows
 * how to opt into that memory manually with a shared AgentSession).
 *
 * Use BobAcpSession when turns genuinely depend on each other.
 * Use invokeAgent when each call is independent.
 *
 * Run:
 *   npx tsx examples/06-acp-session/06a-multi-turn.ts
 */

import "../_setup.js"; // loads BOB_API_KEY from .env
import { BobAcpSession } from "../../src/index.js";

const session = await BobAcpSession.create({
  cwd: process.cwd(),
  autoApprove: true,
});

try {
  console.log("=== Turn 1: repo overview ===\n");
  const t1 = await session.prompt(
    "Give me a one-paragraph overview of this repo's architecture.",
  );
  console.log(t1, "\n");

  console.log("=== Turn 2: follow-up (uses context from turn 1) ===\n");
  const t2 = await session.prompt(
    "Based on what you just described, which single file is the most important? Why?",
  );
  console.log(t2, "\n");

  console.log("=== Turn 3: action (uses context from turns 1 and 2) ===\n");
  const t3 = await session.prompt(
    "Add a one-line JSDoc comment to the top of that file explaining its role. Show me the diff.",
  );
  console.log(t3, "\n");
} finally {
  await session.close();
  console.log("Session closed.");
}
