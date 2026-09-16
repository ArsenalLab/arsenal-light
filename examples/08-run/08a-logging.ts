/**
 * 08a-logging.ts
 *
 * Layer 7 side quest — the `logging` option on run(), on top of 08-run.ts.
 *
 * Every run() call is already logged somewhere: by default it writes an
 * auto-named file under `.arsenal/logs/`. `logging` lets you take over where
 * that goes, and — via `onAgentStreamEvent` — tap the same text/tool-call
 * stream Arsenal renders internally, so you can forward it to your own
 * observability system (Datadog, a Slack channel, a dashboard tracking many
 * concurrent agent runs) instead of only reading a log file after the fact.
 * This is the piece that turns run() from "one agent, one terminal" into
 * something a fleet of unattended jobs can actually be monitored through.
 *
 * Part A uses `{ type: "file" }` — same as the default, but with an explicit
 * path and a forwarding callback. Part B uses `{ type: "stdout" }` — the
 * same callback, without giving up the interactive terminal UI 08-run.ts
 * showed; you don't have to choose between a human watching and a machine
 * watching.
 *
 * Run:
 *   npx tsx examples/08a-logging.ts
 */

import "../_setup.js";
import { bob, noSandbox, run } from "../../src/index.js";
import type { AgentStreamEvent } from "../../src/index.js";

const provider = bob("default", { disableMcp: true });

// Stand-in for a real observability sink (Datadog, an internal metrics
// endpoint, a Slack webhook...) — here it just tags and prints events.
const forwardToObservability = (event: AgentStreamEvent) => {
  if (event.type === "text") {
    console.log(
      `[telemetry] iter ${event.iteration} text:`,
      event.message.slice(0, 60),
    );
  } else if (event.type === "toolCall") {
    console.log(`[telemetry] iter ${event.iteration} tool:`, event.name);
  }
};

// ---------------------------------------------------------------------------
// Part A: explicit file path + forwarding callback.
// ---------------------------------------------------------------------------
console.log("=== Part A: logging: { type: 'file' } ===\n");

const fileResult = await run({
  agent: provider,
  sandbox: noSandbox(),
  prompt: "In one sentence, what is the purpose of this repository?",
  logging: {
    type: "file",
    path: ".arsenal/logs/08a-example.log",
    onAgentStreamEvent: forwardToObservability,
  },
});

console.log("\nLog file :", fileResult.logFilePath);
console.log("Result   :", fileResult.stdout.trim());

// ---------------------------------------------------------------------------
// Part B: interactive terminal UI *and* the same forwarding callback.
// ---------------------------------------------------------------------------
console.log("\n=== Part B: logging: { type: 'stdout' } ===\n");

const stdoutResult = await run({
  agent: provider,
  sandbox: noSandbox(),
  prompt: "Now name one test framework this repo uses.",
  logging: {
    type: "stdout",
    onAgentStreamEvent: forwardToObservability,
  },
});

console.log("\nResult   :", stdoutResult.stdout.trim());
