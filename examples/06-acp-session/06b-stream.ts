/**
 * 06b-stream.ts
 *
 * Layer 5 variant — BobAcpSession.promptStream(), on top of
 * 06-acp-session.ts.
 *
 * promptStream() yields typed events as the agent works:
 *   text      — Bob's response text (assertive: false = chain-of-thought)
 *   tool_call — tool call announcements and results
 *   usage     — running context-window token snapshot
 *
 * This is a BobAcpSession-only feature. invokeAgent exposes onText/onToolCall
 * callbacks for per-event notification but does not stream usage or expose
 * chain-of-thought. The persistent process is what makes richer event
 * exposure possible.
 *
 * Run:
 *   npx tsx examples/06b-stream.ts
 */

import "../_setup.js"; // loads BOB_API_KEY from .env
import { BobAcpSession, type AcpSessionEvent } from "../../src/index.js";

const PROMPT =
  "List every .ts file directly inside src/ (not recursive). Reply with just the file names, one per line.";

function fmtEvent(e: AcpSessionEvent): string {
  switch (e.type) {
    case "text":
      return e.assertive === false
        ? `  [thought]   ${e.text.slice(0, 120).replace(/\n/g, "↵")}`
        : `  [text]      ${e.text.slice(0, 120).replace(/\n/g, "↵")}`;
    case "tool_call":
      return `  [tool_call] name=${JSON.stringify(e.name)}  args=${e.args.slice(0, 80)}`;
    case "usage":
      return (
        `  [usage]     in=${e.usage.inputTokens} out=${e.usage.outputTokens}` +
        (e.usage.contextTokens !== undefined
          ? ` ctx=${e.usage.contextTokens}`
          : "") +
        (e.usage.costUsd !== undefined
          ? ` cost=$${e.usage.costUsd.toFixed(6)}`
          : "") +
        (e.usage.durationMs !== undefined
          ? ` dur=${e.usage.durationMs}ms`
          : "") +
        (e.usage.toolCalls !== undefined ? ` tools=${e.usage.toolCalls}` : "")
      );
  }
}

await using session = await BobAcpSession.create({
  cwd: process.cwd(),
  autoApprove: true,
  disableMcp: true,
  disableSubagents: true,
});

const events: AcpSessionEvent[] = [];

for await (const event of session.promptStream(PROMPT)) {
  events.push(event);
  console.log(fmtEvent(event));
}

console.log(`\n→ total events: ${events.length}`);
const byType = events.reduce<Record<string, number>>((acc, e) => {
  acc[e.type] = (acc[e.type] ?? 0) + 1;
  return acc;
}, {});
console.log("  by type:", JSON.stringify(byType));
console.log(
  "  thoughts (assertive=false):",
  events.filter((e) => e.type === "text" && e.assertive === false).length,
);
