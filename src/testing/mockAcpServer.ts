import { Readable, Writable } from "node:stream";
import {
  agent,
  ndJsonStream,
  type AgentHandlerContext,
  type StopReason,
} from "@agentclientprotocol/sdk";
import type { InteractiveExecOptions } from "../spi/types.js";

const DEFAULT_SESSION_ID = "mock-session-id";

export interface MockAcpAgentOptions {
  sessionId?: string;
  onPrompt?: (
    prompt: string,
    client: AgentHandlerContext<unknown>["client"],
  ) => Promise<void> | void;
  output?: string;
  stopReason?: StopReason;
  /** Exit code reported when the client closes the connection. Static config only. */
  exitCode?: number;
}

/** Static options, or a per-prompt factory returning options or plain output text. */
export type MockAcpAgentConfig =
  | MockAcpAgentOptions
  | ((
      cwd: string,
    ) => Promise<string | MockAcpAgentOptions> | string | MockAcpAgentOptions);

/** Resolve the config for one prompt, invoking a factory exactly once. */
const resolveOptions = async (
  config: MockAcpAgentConfig,
  cwd: string,
): Promise<MockAcpAgentOptions> => {
  if (typeof config !== "function") return config;
  const resolved = await config(cwd);
  return typeof resolved === "string" ? { output: resolved } : resolved;
};

/** Flatten an ACP prompt (content blocks) into its text. */
const promptToText = (prompt: unknown): string => {
  if (typeof prompt === "string") return prompt;
  if (!Array.isArray(prompt)) return JSON.stringify(prompt);
  return prompt
    .map((block: { type?: string; text?: string }) =>
      block.type === "text" ? (block.text ?? "") : "",
    )
    .join("");
};

/**
 * Creates an interactiveExec implementation that connects a real @agentclientprotocol/sdk `agent()`
 * to the caller's stdin/stdout streams.
 */
export const createMockInteractiveExec = (config: MockAcpAgentConfig = {}) => {
  return async (
    _args: string[],
    execOptions: InteractiveExecOptions,
  ): Promise<{ exitCode: number }> => {
    const cwd = execOptions.cwd ?? process.cwd();

    const input = Readable.toWeb(
      execOptions.stdin as NodeJS.ReadableStream,
    ) as ReadableStream<Uint8Array>;
    const output = Writable.toWeb(execOptions.stdout as NodeJS.WritableStream);
    const stream = ndJsonStream(output, input);

    const staticConfig = typeof config === "function" ? {} : config;
    const sessionId = staticConfig.sessionId ?? DEFAULT_SESSION_ID;
    const exitCode = staticConfig.exitCode ?? 0;

    agent({ name: "mock-agent" })
      .onRequest("initialize", () => ({
        protocolVersion: 1,
        capabilities: {},
      }))
      .onRequest("session/new", () => ({ sessionId }))
      .onRequest("session/prompt", async (ctx) => {
        const options = await resolveOptions(config, cwd);

        if (options.onPrompt) {
          await options.onPrompt(promptToText(ctx.params.prompt), ctx.client);
        } else {
          await ctx.client.notify("session/update", {
            sessionId: ctx.params.sessionId,
            update: {
              sessionUpdate: "agent_message_chunk",
              content: {
                type: "text",
                text: options.output ?? "mock agent output",
              },
            },
          });
        }
        return { stopReason: options.stopReason ?? "end_turn" };
      })
      .onNotification("session/cancel", () => {})
      .connect(stream);

    // The client ending or closing stdin is the process "exiting".
    return new Promise((resolve) => {
      const stdin = execOptions.stdin as NodeJS.ReadableStream;
      stdin.on("end", () => resolve({ exitCode }));
      stdin.on("close", () => resolve({ exitCode }));
    });
  };
};
