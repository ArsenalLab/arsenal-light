import { describe, it, expect } from "vitest";
import { bob } from "./bob.js";

describe("bob provider", () => {
  it("buildAcpArgs includes defaults (--trust and --accept-license)", () => {
    const provider = bob("default");
    expect(provider.buildAcpArgs()).toEqual([
      "bob",
      "acp",
      "--trust",
      "--accept-license",
    ]);
  });

  it("buildAcpArgs renders disableMcp as --disable-mcp", () => {
    const provider = bob("default", { disableMcp: true });
    expect(provider.buildAcpArgs()).toContain("--disable-mcp");
  });

  it("buildAcpArgs renders disableSubagents as --disable-subagents", () => {
    const provider = bob("default", { disableSubagents: true });
    expect(provider.buildAcpArgs()).toContain("--disable-subagents");
  });

  it("buildAcpArgs renders autoApprove and logLevel", () => {
    const args = bob("default", {
      autoApprove: true,
      logLevel: "debug",
    }).buildAcpArgs();
    expect(args).toContain("--auto-approve");
    expect(args).toEqual(expect.arrayContaining(["--log-level", "debug"]));
  });

  it.each([
    ["a non-default model", () => bob("agent-mode"), /model "agent-mode"/],
    ["the model option", () => bob("default", { model: "ask" }), /model "ask"/],
    ["maxTurns", () => bob("default", { maxTurns: 12 }), /maxTurns/],
    ["maxCost", () => bob("default", { maxCost: 5 }), /maxCost/],
    [
      "disableToolGroups",
      () => bob("default", { disableToolGroups: ["mcp"] }),
      /disableToolGroups/,
    ],
    ["workspace", () => bob("default", { workspace: "/w" }), /workspace/],
  ] as const)(
    "throws for %s, which bob acp does not support",
    (_, make, message) => {
      expect(make).toThrow(message);
      expect(make).toThrow("not supported by `bob acp`");
    },
  );

  it("lists every unsupported option in one error", () => {
    expect(() => bob("default", { maxTurns: 1, maxCost: 2 })).toThrow(
      "maxTurns, maxCost not supported",
    );
  });

  it("allows an empty disableToolGroups list", () => {
    expect(() => bob("default", { disableToolGroups: [] })).not.toThrow();
  });

  it("buildAcpArgs respects trust: false and acceptLicense: false", () => {
    const provider = bob("default", { trust: false, acceptLicense: false });
    expect(provider.buildAcpArgs()).not.toContain("--trust");
    expect(provider.buildAcpArgs()).not.toContain("--accept-license");
  });
});

// ---------------------------------------------------------------------------
// ACP integration — parseAcpUpdate
// ---------------------------------------------------------------------------

describe("bob ACP integration", () => {
  it("parseAcpUpdate returns empty array for null/non-object input", () => {
    const provider = bob("default");
    expect(provider.parseAcpUpdate(null)).toEqual([]);
    expect(provider.parseAcpUpdate("string")).toEqual([]);
    expect(provider.parseAcpUpdate(42)).toEqual([]);
  });

  it("parseAcpUpdate maps agent_message_chunk with text content to a text event", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "agent_message_chunk",
      messageId: "msg_1",
      content: { type: "text", text: "Hello from agent" },
    };
    expect(provider.parseAcpUpdate(update)).toEqual([
      { type: "text", text: "Hello from agent" },
    ]);
  });

  it("parseAcpUpdate drops agent_message_chunk with empty text", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "agent_message_chunk",
      content: { type: "text", text: "" },
    };
    expect(provider.parseAcpUpdate(update)).toEqual([]);
  });

  it("parseAcpUpdate drops agent_message_chunk with non-text content", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "agent_message_chunk",
      content: { type: "image", url: "data:image/png;base64,abc" },
    };
    expect(provider.parseAcpUpdate(update)).toEqual([]);
  });

  it("parseAcpUpdate maps tool_call to a tool_call event, never to text", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call",
      toolCallId: "call_001",
      title: "Analyzing Python code",
      kind: "other",
      status: "pending",
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      {
        type: "tool_call",
        name: "other: Analyzing Python code",
        args: "pending",
      },
    ]);
    expect(events.some((e) => e.type === "text")).toBe(false);
  });

  it("parseAcpUpdate maps tool_call with rawInput — args carries the parameters", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call",
      toolCallId: "call_002",
      title: "Running ls",
      kind: "execute",
      rawInput: { command: "ls" },
      status: "pending",
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      {
        type: "tool_call",
        name: "execute: Running ls",
        args: '{"command":"ls"}',
      },
    ]);
    expect(events.some((e) => e.type === "text")).toBe(false);
  });

  it("parseAcpUpdate maps tool_call without toolCallId or kind using title only", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call",
      title: "Running tests",
      status: "pending",
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      { type: "tool_call", name: "Running tests", args: "pending" },
    ]);
  });

  it("parseAcpUpdate maps tool_call_update in_progress to a tool_call:result event", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call_update",
      toolCallId: "call_001",
      status: "in_progress",
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      { type: "tool_call", name: "call_001:result", args: "in_progress" },
    ]);
    expect(events.some((e) => e.type === "text")).toBe(false);
  });

  it("parseAcpUpdate maps tool_call_update with rawOutput — args carries the tool response", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call_update",
      toolCallId: "call_002",
      status: "completed",
      rawOutput: "abc\n",
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      { type: "tool_call", name: "call_002:result", args: "completed: abc\n" },
    ]);
  });

  it("parseAcpUpdate serializes non-string rawOutput as JSON", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call_update",
      toolCallId: "call_003",
      status: "completed",
      rawOutput: { files: ["a.ts", "b.ts"] },
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      {
        type: "tool_call",
        name: "call_003:result",
        args: 'completed: {"files":["a.ts","b.ts"]}',
      },
    ]);
  });

  it("parseAcpUpdate falls back to content text when rawOutput is absent", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call_update",
      toolCallId: "call_001",
      status: "completed",
      content: [
        {
          type: "content",
          content: { type: "text", text: "Analysis complete" },
        },
      ],
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      {
        type: "tool_call",
        name: "call_001:result",
        args: "completed: Analysis complete",
      },
    ]);
  });

  it("parseAcpUpdate includes diff path in content fallback", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "tool_call_update",
      toolCallId: "call_004",
      status: "completed",
      content: [
        {
          type: "diff",
          path: "/project/src/main.ts",
          oldText: "a",
          newText: "b",
        },
      ],
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      {
        type: "tool_call",
        name: "call_004:result",
        args: "completed: diff: /project/src/main.ts",
      },
    ]);
  });

  it("parseAcpUpdate maps agent_thought_chunk with text content to a non-assertive text event", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "agent_thought_chunk",
      content: { type: "text", text: "Let me think about this..." },
    };
    expect(provider.parseAcpUpdate(update)).toEqual([
      { type: "text", text: "Let me think about this...", assertive: false },
    ]);
  });

  it("parseAcpUpdate drops agent_thought_chunk with empty text", () => {
    const provider = bob("default");
    expect(
      provider.parseAcpUpdate({
        sessionUpdate: "agent_thought_chunk",
        content: { type: "text", text: "" },
      }),
    ).toEqual([]);
  });

  it("parseAcpUpdate maps usage_update to a usage event with contextTokens (not inputTokens)", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "usage_update",
      used: 53000,
      size: 200000,
    };
    expect(provider.parseAcpUpdate(update)).toEqual([
      {
        type: "usage",
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          cacheCreationInputTokens: 0,
          cacheReadInputTokens: 0,
          contextTokens: 53000,
        },
      },
    ]);
  });

  it("parseAcpUpdate omits contextTokens when `used` is missing", () => {
    const provider = bob("default");
    const update = { sessionUpdate: "usage_update" };
    expect(provider.parseAcpUpdate(update)).toEqual([
      {
        type: "usage",
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          cacheCreationInputTokens: 0,
          cacheReadInputTokens: 0,
        },
      },
    ]);
  });

  it("parseAcpUpdate maps plan to a tool_call event with entry summary", () => {
    const provider = bob("default");
    const update = {
      sessionUpdate: "plan",
      entries: [
        { status: "completed", content: "Read source files" },
        { status: "in_progress", content: "Analyse dependencies" },
        { status: "pending", content: "Write summary" },
      ],
    };
    const events = provider.parseAcpUpdate(update);
    expect(events).toEqual([
      {
        type: "tool_call",
        name: "plan",
        args: "[completed] Read source files; [in_progress] Analyse dependencies; [pending] Write summary",
      },
    ]);
    expect(events.some((e) => e.type === "text")).toBe(false);
  });

  it("parseAcpUpdate maps plan with empty entries to a tool_call with empty args", () => {
    const provider = bob("default");
    expect(
      provider.parseAcpUpdate({ sessionUpdate: "plan", entries: [] }),
    ).toEqual([{ type: "tool_call", name: "plan", args: "" }]);
  });

  it("parseAcpUpdate silently drops unknown sessionUpdate types (mode_change, etc.)", () => {
    const provider = bob("default");
    expect(
      provider.parseAcpUpdate({ sessionUpdate: "mode_change", mode: "auto" }),
    ).toEqual([]);
    expect(
      provider.parseAcpUpdate({ sessionUpdate: "unknown_future_type" }),
    ).toEqual([]);
  });
});
