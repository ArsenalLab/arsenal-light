/**
 * 06-acp-session.ts
 *
 * Layer 5 — BobAcpSession, the packaged alternative to 05-session.ts.
 *
 * 05-session.ts hand-rolled a persistent session: create an AgentSession,
 * pass it into invokeAgent, wrap it in iterate + withWorktree yourself.
 * BobAcpSession is the same underlying idea — one bob process that stays
 * alive across multiple calls, accumulating context between turns — but
 * packaged as a single class with its own `.prompt()` method and built-in
 * permission handling. It does not use withWorktree/iterate at all; it's a
 * separate, higher-level entry point for interactive/conversational use.
 *
 * This example also shows permission approval patterns:
 *   (default)                — honours ~/.bob/settings/settings.json
 *   autoApprove: true        — CI/headless, approve everything
 *   onPermissionRequest: ... — interactive terminal menu or custom policy
 *
 * Run:
 *   npx tsx examples/06-acp-session.ts
 */

import "../_setup.js"; // loads BOB_API_KEY from .env
import { BobAcpSession, interactivePermissionHandler } from "../../src/index.js";

// ---------------------------------------------------------------------------
// Part A: default — Bob uses ~/.bob/settings/settings.json.
// ---------------------------------------------------------------------------
console.log("=== Part A: default (settings file) ===\n");

{
  const session = await BobAcpSession.create({ cwd: process.cwd() });
  try {
    console.log(
      "Bob:",
      await session.prompt(
        "In two sentences, what does this repository do and who would use it?",
      ),
    );
  } finally {
    await session.close();
  }
}

console.log("\n---\n");

// ---------------------------------------------------------------------------
// Part B: interactive terminal menu for requests not pre-approved by settings.
// ---------------------------------------------------------------------------
console.log(
  "=== Part B: onPermissionRequest: interactivePermissionHandler ===\n",
);

{
  const session = await BobAcpSession.create({
    cwd: process.cwd(),
    onPermissionRequest: interactivePermissionHandler,
  });
  try {
    const response = await session.prompt(
      "Read the first 5 lines of README.md, then append the line '<!-- arsenal -->' to the end of it.",
    );
    console.log("\nBob:", response);
  } finally {
    await session.close();
  }
}

console.log("\n---\n");

// ---------------------------------------------------------------------------
// Part C: CI/headless — autoApprove bypasses settings entirely.
// ---------------------------------------------------------------------------
console.log("=== Part C: autoApprove: true (CI/headless) ===\n");

{
  const session = await BobAcpSession.create({
    cwd: process.cwd(),
    autoApprove: true,
  });
  try {
    console.log(
      "Bob:",
      await session.prompt(
        "List the files in src/agents/ and describe each one in one line.",
      ),
    );
  } finally {
    await session.close();
  }
}

console.log("\nDone.");
