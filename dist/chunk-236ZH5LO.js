// src/application/acp/parseAcpUpdate.ts
function parseAcpUpdate(update, toolCallNames) {
  if (typeof update !== "object" || update === null) return [];
  const u = update;
  const kind = u.sessionUpdate;
  if (kind === "agent_message_chunk") {
    const content = u.content;
    if (typeof content === "object" && content !== null && content.type === "text" && typeof content.text === "string" && content.text.length > 0) {
      return [{ type: "text", text: content.text }];
    }
    return [];
  }
  if (kind === "agent_thought_chunk") {
    const content = u.content;
    if (typeof content === "object" && content !== null && content.type === "text" && typeof content.text === "string" && content.text.length > 0) {
      return [{ type: "text", text: content.text, assertive: false }];
    }
    return [];
  }
  if (kind === "tool_call") {
    const title = typeof u.title === "string" ? u.title : "tool_call";
    const toolKind = typeof u.kind === "string" ? u.kind : "";
    const callId = typeof u.toolCallId === "string" ? u.toolCallId : "";
    const name = toolKind ? `${toolKind}: ${title}` : title;
    if (callId) toolCallNames.set(callId, name);
    const rawInput = u.rawInput;
    const args = rawInput !== void 0 && rawInput !== null ? JSON.stringify(rawInput) : String(u.status ?? "");
    return [{ type: "tool_call", name, args }];
  }
  if (kind === "tool_call_update") {
    const callId = typeof u.toolCallId === "string" ? u.toolCallId : "tool_call";
    const status = typeof u.status === "string" ? u.status : "";
    const rawOutput = u.rawOutput;
    let outputText;
    if (rawOutput !== void 0 && rawOutput !== null) {
      outputText = typeof rawOutput === "string" ? rawOutput : JSON.stringify(rawOutput);
    } else {
      const contentItems = Array.isArray(u.content) ? u.content : [];
      const extracted = contentItems.map((c) => {
        if (typeof c !== "object" || c === null) return "";
        const item = c;
        if (item.type === "content" && typeof item.content === "object" && item.content !== null) {
          const inner = item.content;
          return inner.type === "text" && typeof inner.text === "string" ? inner.text : "";
        }
        if (item.type === "diff" && typeof item.path === "string") {
          return `diff: ${item.path}`;
        }
        return "";
      }).filter(Boolean).join("\n");
      if (extracted) outputText = extracted;
    }
    const args = outputText ? `${status}: ${outputText}` : status;
    const resolvedName = toolCallNames.get(callId) ?? callId;
    return [{ type: "tool_call", name: `${resolvedName}:result`, args }];
  }
  if (kind === "usage_update") {
    const contextTokens = typeof u.used === "number" && Number.isFinite(u.used) && u.used > 0 ? u.used : void 0;
    return [
      {
        type: "usage",
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          cacheCreationInputTokens: 0,
          cacheReadInputTokens: 0,
          ...contextTokens !== void 0 && { contextTokens }
        }
      }
    ];
  }
  if (kind === "plan" || kind === "plan_update") {
    const plan = kind === "plan_update" ? u.plan : u;
    const entries = Array.isArray(plan?.entries) ? plan.entries : [];
    const summary = entries.map((e) => {
      if (typeof e !== "object" || e === null) return null;
      const entry = e;
      const status = typeof entry.status === "string" ? entry.status : "unknown";
      const content = typeof entry.content === "string" ? entry.content : "";
      return content ? `[${status}] ${content}` : `[${status}]`;
    }).filter(Boolean).join("; ");
    return [{ type: "tool_call", name: "plan", args: summary }];
  }
  return [];
}

// src/agents/bob/bob.ts
var assertAcpSupported = (resolvedModel, options) => {
  const unsupported = [];
  if (resolvedModel && resolvedModel !== "default") {
    unsupported.push(`model "${resolvedModel}"`);
  }
  if (options?.maxTurns !== void 0) unsupported.push("maxTurns");
  if (options?.maxCost !== void 0) unsupported.push("maxCost");
  if (options?.disableToolGroups && options.disableToolGroups.length > 0) {
    unsupported.push("disableToolGroups");
  }
  if (options?.workspace !== void 0) unsupported.push("workspace");
  if (unsupported.length > 0) {
    throw new Error(
      `bob(): ${unsupported.join(", ")} not supported by \`bob acp\`. Supported options: env, bobPath, autoApprove, logLevel, disableMcp, disableSubagents, trust, acceptLicense; pass "default" as the model.`
    );
  }
};
var bob = (model, options) => {
  const resolvedModel = options?.model ?? model;
  assertAcpSupported(resolvedModel, options);
  const trust = options?.trust ?? true;
  const acceptLicense = options?.acceptLicense ?? true;
  const toolCallNames = /* @__PURE__ */ new Map();
  return {
    name: "bob",
    env: options?.env ?? {},
    /**
     * Build argv to launch Bob Shell as an ACP server (local stdio transport).
     * The process speaks JSON-RPC 2.0 on stdin/stdout; Arsenal drives it as an
     * ACP client: initialize → session/new → session/prompt → session/update
     * notifications → session/prompt response with stop reason.
     */
    buildAcpArgs() {
      toolCallNames.clear();
      const args = [options?.bobPath ?? "bob", "acp"];
      if (options?.autoApprove) {
        args.push("--auto-approve");
      }
      if (options?.disableMcp) {
        args.push("--disable-mcp");
      }
      if (options?.disableSubagents) {
        args.push("--disable-subagents");
      }
      if (trust) {
        args.push("--trust");
      }
      if (acceptLicense) {
        args.push("--accept-license");
      }
      if (options?.logLevel) {
        args.push("--log-level", options.logLevel);
      }
      return args;
    },
    /**
     * Translate one ACP `session/update` notification params object into
     * `ParsedStreamEvent`s.
     */
    parseAcpUpdate(update) {
      return parseAcpUpdate(update, toolCallNames);
    }
  };
};

export { bob, parseAcpUpdate };
//# sourceMappingURL=chunk-236ZH5LO.js.map
//# sourceMappingURL=chunk-236ZH5LO.js.map