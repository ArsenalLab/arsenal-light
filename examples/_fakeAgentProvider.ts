/**
 * Shared fake AgentProvider for 01b-custom-provider.ts and
 * 03e-custom-sandbox-provider.ts.
 *
 * See _fakeAgentCli.mjs for the process this drives, and
 * 01b-custom-provider.ts for the walkthrough of what each method does.
 */

import { fileURLToPath } from "node:url";
import type { AgentProvider, ParsedStreamEvent } from "../src/index.js";

const fakeCliPath = fileURLToPath(
  new URL("./_fakeAgentCli.mjs", import.meta.url),
);

export const createFakeAgentProvider = (): AgentProvider => ({
  name: "fake-agent",
  env: {},

  buildAcpArgs(): string[] {
    // Launch the fake CLI with the same Node binary running this script,
    // rather than assuming `node` is on PATH under that exact name.
    return [process.execPath, fakeCliPath];
  },

  parseAcpUpdate(update: unknown): ParsedStreamEvent[] {
    if (typeof update !== "object" || update === null) return [];
    const u = update as Record<string, unknown>;
    if (u.sessionUpdate !== "agent_message_chunk") return [];

    const content = u.content as Record<string, unknown> | undefined;
    if (
      typeof content !== "object" ||
      content === null ||
      content.type !== "text" ||
      typeof content.text !== "string"
    ) {
      return [];
    }
    return [{ type: "text", text: content.text }];
  },
});
