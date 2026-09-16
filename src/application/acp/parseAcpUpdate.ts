/**
 * parseAcpUpdate — shared ACP session/update event parser.
 *
 * Converts a raw ACP `session/update` payload into `ParsedStreamEvent[]`.
 * Used by both the `bob()` provider (via `AgentProvider.parseAcpUpdate`) and
 * `BobAcpSession` so the two paths stay in sync.
 *
 * The `toolCallNames` map correlates `tool_call` announcements to their
 * `tool_call_update` results within a single prompt turn — callers must pass
 * the same map instance across calls for a turn, and may clear it between turns.
 *
 * ACP event kinds handled:
 *   agent_message_chunk  → text (assertive)
 *   agent_thought_chunk  → text (assertive: false — chain-of-thought, never signal-matched)
 *   tool_call            → tool_call (announcement, populates toolCallNames)
 *   tool_call_update     → tool_call (result, looks up toolCallNames)
 *   usage_update         → usage (contextTokens only — ACP carries no per-turn split)
 *   plan / plan_update   → tool_call (progress summary, never reaches accumulatedOutput)
 */

import type { ParsedStreamEvent } from "../../spi/AgentProvider.js";

export function parseAcpUpdate(
  update: unknown,
  toolCallNames: Map<string, string>,
): ParsedStreamEvent[] {
  if (typeof update !== "object" || update === null) return [];
  const u = update as Record<string, unknown>;
  const kind = u.sessionUpdate;

  // agent_message_chunk: Bob's primary response text.
  if (kind === "agent_message_chunk") {
    const content = u.content as Record<string, unknown> | undefined;
    if (
      typeof content === "object" &&
      content !== null &&
      content.type === "text" &&
      typeof content.text === "string" &&
      content.text.length > 0
    ) {
      return [{ type: "text", text: content.text }];
    }
    return [];
  }

  // agent_thought_chunk: chain-of-thought / reasoning. Non-assertive — visible
  // in the display but never eligible for completion-signal matching.
  if (kind === "agent_thought_chunk") {
    const content = u.content as Record<string, unknown> | undefined;
    if (
      typeof content === "object" &&
      content !== null &&
      content.type === "text" &&
      typeof content.text === "string" &&
      content.text.length > 0
    ) {
      return [{ type: "text", text: content.text, assertive: false }];
    }
    return [];
  }

  // tool_call: initial announcement.
  // name encodes identity (kind: title); args carries rawInput as JSON.
  if (kind === "tool_call") {
    const title = typeof u.title === "string" ? u.title : "tool_call";
    const toolKind = typeof u.kind === "string" ? u.kind : "";
    const callId = typeof u.toolCallId === "string" ? u.toolCallId : "";
    const name = toolKind ? `${toolKind}: ${title}` : title;
    if (callId) toolCallNames.set(callId, name);
    const rawInput = u.rawInput;
    const args =
      rawInput !== undefined && rawInput !== null
        ? JSON.stringify(rawInput)
        : String(u.status ?? "");
    return [{ type: "tool_call", name, args }];
  }

  // tool_call_update: status change — result correlation via toolCallId.
  if (kind === "tool_call_update") {
    const callId =
      typeof u.toolCallId === "string" ? u.toolCallId : "tool_call";
    const status = typeof u.status === "string" ? u.status : "";

    const rawOutput = u.rawOutput;
    let outputText: string | undefined;
    if (rawOutput !== undefined && rawOutput !== null) {
      outputText =
        typeof rawOutput === "string" ? rawOutput : JSON.stringify(rawOutput);
    } else {
      const contentItems = Array.isArray(u.content) ? u.content : [];
      const extracted = contentItems
        .map((c: unknown) => {
          if (typeof c !== "object" || c === null) return "";
          const item = c as Record<string, unknown>;
          if (
            item.type === "content" &&
            typeof item.content === "object" &&
            item.content !== null
          ) {
            const inner = item.content as Record<string, unknown>;
            return inner.type === "text" && typeof inner.text === "string"
              ? inner.text
              : "";
          }
          if (item.type === "diff" && typeof item.path === "string") {
            return `diff: ${item.path}`;
          }
          return "";
        })
        .filter(Boolean)
        .join("\n");
      if (extracted) outputText = extracted;
    }

    const args = outputText ? `${status}: ${outputText}` : status;
    const resolvedName = toolCallNames.get(callId) ?? callId;
    return [{ type: "tool_call", name: `${resolvedName}:result`, args }];
  }

  // usage_update: running context-window fill snapshot.
  // Maps `used` to contextTokens — ACP carries no per-turn input/output split.
  if (kind === "usage_update") {
    const contextTokens =
      typeof u.used === "number" && Number.isFinite(u.used) && u.used > 0
        ? u.used
        : undefined;
    return [
      {
        type: "usage",
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          cacheCreationInputTokens: 0,
          cacheReadInputTokens: 0,
          ...(contextTokens !== undefined && { contextTokens }),
        },
      },
    ];
  }

  // plan / plan_update: structured task progress. Routed through tool_call
  // (never text) so plan content never reaches accumulatedOutput or matches the
  // completion signal. Entry statuses summarised in args for display.
  if (kind === "plan" || kind === "plan_update") {
    const plan =
      kind === "plan_update"
        ? ((u as Record<string, unknown>).plan as
            | Record<string, unknown>
            | undefined)
        : u;
    const entries = Array.isArray(plan?.entries) ? plan.entries : [];
    const summary = entries
      .map((e: unknown) => {
        if (typeof e !== "object" || e === null) return null;
        const entry = e as Record<string, unknown>;
        const status =
          typeof entry.status === "string" ? entry.status : "unknown";
        const content = typeof entry.content === "string" ? entry.content : "";
        return content ? `[${status}] ${content}` : `[${status}]`;
      })
      .filter(Boolean)
      .join("; ");
    return [{ type: "tool_call", name: "plan", args: summary }];
  }

  // mode_change, available_commands_update, terminal_update, user_message_chunk, etc.
  // — no Arsenal equivalent, silently dropped.
  return [];
}
