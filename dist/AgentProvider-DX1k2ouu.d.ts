type ParsedStreamEvent = {
    type: "text";
    text: string;
    /**
     * Whether this text is the agent asserting something, eligible for
     * completion-signal matching in Orchestrator.ts. Omitted or `true` is
     * the default — matching every provider's behavior before this field
     * existed. Explicit `false` marks text that should still reach the
     * user (chain-of-thought/reasoning commentary) but must never be
     * scanned for the completion signal, since it can plausibly mention or
     * quote the signal string without the agent actually asserting
     * completion — see `parseAcpUpdate.ts`'s `agent_thought_chunk` handling.
     */
    assertive?: boolean;
} | {
    type: "result";
    result: string;
} | {
    type: "tool_call";
    name: string;
    args: string;
} | {
    type: "session_id";
    sessionId: string;
} | {
    type: "usage";
    usage: IterationUsage;
};
/** Per-iteration token usage snapshot extracted from the agent session. */
interface IterationUsage {
    readonly inputTokens: number;
    readonly cacheCreationInputTokens: number;
    readonly cacheReadInputTokens: number;
    readonly outputTokens: number;
    /**
     * Current context-window fill reported by ACP's `usage_update` (`used` field).
     * This is a running total of tokens consumed so far in the session, not a
     * per-turn input count. Distinct from `inputTokens` which is a per-turn value
     * from the CLI `stream-json` path. Only set by ACP providers.
     */
    readonly contextTokens?: number;
    /** Total cost in USD for the iteration, when the provider reports it (e.g. Bob 2.x). */
    readonly costUsd?: number;
    /** Wall-clock duration in milliseconds for the iteration, when the provider reports it. */
    readonly durationMs?: number;
    /** Number of tool calls made during the iteration, when the provider reports it. */
    readonly toolCalls?: number;
}
interface AgentProvider {
    readonly name: string;
    /** Environment variables injected by this agent provider. Merged at launch time with env resolver and sandbox provider env. */
    readonly env: Record<string, string>;
    /**
     * Build the argv array to launch this agent as an ACP server (local stdio
     * transport).
     *
     * The returned array is the full argv — e.g. `["bob", "acp"]`.
     * Arsenal spawns the process, owns stdin/stdout, and runs the ACP client
     * handshake: `initialize` → `session/new` → `session/prompt` → consumes
     * `session/update` notifications via `parseAcpUpdate` until stop reason.
     */
    buildAcpArgs(): string[];
    /**
     * Parse one ACP `session/update` notification params object into zero or
     * more `ParsedStreamEvent`s.
     *
     * Arsenal calls this for every inbound `session/update` notification it
     * receives while driving an ACP session. The `update` discriminator field
     * (`sessionUpdate`) determines which notification type it is.
     */
    parseAcpUpdate(update: unknown): ParsedStreamEvent[];
}

export type { AgentProvider as A, IterationUsage as I, ParsedStreamEvent as P };
