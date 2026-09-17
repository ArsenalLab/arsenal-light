import { RequestPermissionRequest, PermissionOption } from '@agentclientprotocol/sdk';
import { I as IterationUsage } from '../AgentProvider-DX1k2ouu.js';

/**
 * ACP (Agent Client Protocol) session for Bob Shell.
 *
 * Spawns `bob acp` as a child process and communicates over stdin/stdout
 * using the ACP JSON-RPC protocol. Keeps context between prompts — ideal
 * for multi-turn conversations or iterative tasks on the same repo.
 *
 * For one-shot headless runs use `run()` + `noSandbox()` instead.
 *
 * ### Approvals
 *
 * Bob pre-approves what `~/.bob/settings/settings.json` allows and sends
 * `RequestPermission` only for the rest. Two options control what happens:
 *
 * - `autoApprove: true` — passes `--auto-approve`; approves everything. CI use.
 * - `onPermissionRequest` — called for each request that comes through.
 *   Supply `interactivePermissionHandler` for a terminal menu, or your own
 *   function. Omit to cancel unapproved requests (safe default).
 *
 * @example
 * ```typescript
 * import { BobAcpSession, interactivePermissionHandler } from "@arsenallab/arsenal-light/agents/bobAcp";
 *
 * await using session = await BobAcpSession.create({ cwd: process.cwd() });
 * await using ci = await BobAcpSession.create({ autoApprove: true });
 * await using interactive = await BobAcpSession.create({ onPermissionRequest: interactivePermissionHandler });
 * ```
 */

/** A permission request Bob sends before executing a tool call. */
interface AcpPermissionRequest {
    /** The tool call requiring approval — title and kind describe what Bob wants to do. */
    readonly toolCall: RequestPermissionRequest["toolCall"];
    /** Options Bob offers — allow_once, allow_always, reject_once, reject_always. */
    readonly options: ReadonlyArray<PermissionOption>;
    /** Call with one of the option IDs to respond, or `undefined` to cancel. */
    approve(optionId: string | undefined): void;
}
/**
 * Built-in interactive permission handler.
 * Prints Bob's title and options, reads a numbered choice from /dev/tty.
 */
declare function interactivePermissionHandler(req: AcpPermissionRequest): Promise<void>;
interface BobAcpOptions {
    /** Workspace root Bob reads and modifies. Defaults to `process.cwd()`. */
    readonly cwd?: string;
    /** Path to the `bob` binary. Defaults to `"bob"` (from PATH). */
    readonly bobPath?: string;
    /** Extra env vars for the `bob acp` process. Set `BOB_API_KEY` here for headless auth. */
    readonly env?: Record<string, string>;
    /** Pass `--auto-approve`: approve every tool call silently, ignoring settings.json. CI use. */
    readonly autoApprove?: boolean;
    /** Called for each `RequestPermission` Bob sends. Omit to cancel unapproved requests. */
    readonly onPermissionRequest?: (request: AcpPermissionRequest) => void | Promise<void>;
    /** Pass `--trust`: mark workspace as trusted. Defaults to `true` to avoid headless hang. */
    readonly trust?: boolean;
    /** Pass `--accept-license`: record license acceptance. Defaults to `true`. */
    readonly acceptLicense?: boolean;
    /** Pass `--disable-mcp`: skip MCP server init. Useful to isolate startup failures. */
    readonly disableMcp?: boolean;
    /** Pass `--disable-subagents`: omit subagent tool registration. */
    readonly disableSubagents?: boolean;
    /** Pass `--log-level`. Also settable via `BOB_LOG_LEVEL`. */
    readonly logLevel?: "debug" | "info" | "warn" | "error" | "silent";
    /** Resume a prior session by ID (from `session.sessionId`) instead of starting fresh. */
    readonly resumeSessionId?: string;
}
/**
 * A single event yielded by `BobAcpSession.promptStream()`.
 *
 * - `text`      — a chunk of Bob's response text. `assertive: false` means it
 *                 is chain-of-thought/reasoning commentary, not an assertion.
 * - `tool_call` — a tool call announcement or result update. `name` encodes
 *                 identity (`kind: title[callId]` or `callId:result`); `args`
 *                 carries the raw input/output as JSON.
 * - `usage`     — a running context-window snapshot from `usage_update`.
 */
type AcpSessionEvent = {
    readonly type: "text";
    readonly text: string;
    readonly assertive?: boolean;
} | {
    readonly type: "tool_call";
    readonly name: string;
    readonly args: string;
} | {
    readonly type: "usage";
    readonly usage: IterationUsage;
};
/** @deprecated Use `AcpSessionEvent` instead. */
type AcpTextChunk = AcpSessionEvent & {
    readonly type: "text";
};
/**
 * A persistent Bob ACP session.
 * Create with `BobAcpSession.create(options)`. Always `close()` when done,
 * or use `await using session = await BobAcpSession.create(...)`.
 */
declare class BobAcpSession {
    private readonly _session;
    /** ACP session ID — pass as `resumeSessionId` to reload this session later. */
    get sessionId(): string;
    private constructor();
    /** Spawn `bob acp` and open a session. Returns when ready to accept prompts. */
    static create(options?: BobAcpOptions): Promise<BobAcpSession>;
    /** Send a prompt and return the full text response. Pass `signal` to cancel mid-flight. */
    prompt(text: string, options?: {
        signal?: AbortSignal;
    }): Promise<string>;
    /**
     * Send a prompt and stream all session events via async iteration.
     *
     * Yields every event Bob emits during the turn:
     * - `text`      — Bob's response text (or chain-of-thought with `assertive: false`)
     * - `tool_call` — tool call announcements and result updates (name, args/output)
     * - `usage`     — running context-window token snapshots
     *
     * Pass `signal` to cancel mid-flight.
     * @example
     * ```typescript
     * for await (const event of session.promptStream("Refactor auth", { signal })) {
     *   if (event.type === "text") process.stdout.write(event.text);
     *   else if (event.type === "tool_call") console.log("[tool]", event.name, event.args);
     *   else if (event.type === "usage") console.log("[usage]", event.usage);
     * }
     * ```
     */
    promptStream(text: string, options?: {
        signal?: AbortSignal;
    }): AsyncGenerator<AcpSessionEvent>;
    /** Kill the `bob acp` process and wait for exit. */
    close(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
}

export { type AcpPermissionRequest, type AcpSessionEvent, type AcpTextChunk, type BobAcpOptions, BobAcpSession, interactivePermissionHandler };
