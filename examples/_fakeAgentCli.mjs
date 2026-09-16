#!/usr/bin/env node
/**
 * A minimal ACP-speaking "agent" process, used only by
 * 01b-custom-provider.ts and 03e-custom-sandbox-provider.ts.
 *
 * Real agent CLIs (bob, and whatever else you point AgentProvider at)
 * implement the full ACP surface — tool calls, permissions, thoughts, usage
 * reporting, and so on. This implements just enough of the protocol —
 * initialize, session/new, session/prompt, one agent_message_chunk — to
 * prove out AgentProvider's two required methods without needing a real
 * CLI or API key installed. It never calls out to any model; the "reply"
 * is a canned string built from the prompt text.
 */
import { agent, ndJsonStream } from "@agentclientprotocol/sdk";
import { Readable, Writable } from "node:stream";

const input = Readable.toWeb(process.stdin);
const output = Writable.toWeb(process.stdout);
const stream = ndJsonStream(output, input);

/** Flatten an ACP prompt (an array of content blocks) into plain text. */
const flattenPrompt = (prompt) => {
  if (typeof prompt === "string") return prompt;
  if (!Array.isArray(prompt)) return JSON.stringify(prompt);
  return prompt
    .map((block) => (block.type === "text" ? (block.text ?? "") : ""))
    .join("");
};

agent({ name: "fake-agent" })
  .onRequest("initialize", () => ({ protocolVersion: 1, capabilities: {} }))
  .onRequest("session/new", () => ({ sessionId: "fake-session" }))
  .onRequest("session/prompt", async (ctx) => {
    const promptText = flattenPrompt(ctx.params.prompt);
    await ctx.client.notify("session/update", {
      sessionId: ctx.params.sessionId,
      update: {
        sessionUpdate: "agent_message_chunk",
        content: {
          type: "text",
          text:
            `You asked: "${promptText}". ` +
            "This canned reply comes from examples/_fakeAgentCli.mjs, not a real model.",
        },
      },
    });
    return { stopReason: "end_turn" };
  })
  .onNotification("session/cancel", () => {})
  .connect(stream);
