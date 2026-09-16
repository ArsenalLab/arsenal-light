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

import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";
import {
  type ActiveSessionMessage,
  type RequestPermissionRequest,
  type PermissionOption,
} from "@agentclientprotocol/sdk";
import type { IterationUsage } from "../../spi/AgentProvider.js";
import { AgentSession } from "../../platform/node/AgentSession.js";
import { bob } from "./bob.js";
import { parseAcpUpdate } from "../../application/acp/parseAcpUpdate.js";

/** A permission request Bob sends before executing a tool call. */
export interface AcpPermissionRequest {
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
export async function interactivePermissionHandler(
  req: AcpPermissionRequest,
): Promise<void> {
  process.stdout.write(
    `\nBob requests approval: ${req.toolCall.title ?? "(no title)"}\n`,
  );
  req.options.forEach((opt, i) =>
    process.stdout.write(`  ${i + 1}) ${opt.name}\n`),
  );
  const answer = await _readTty(`Choose [1-${req.options.length}]: `);
  req.approve(req.options[parseInt(answer.trim(), 10) - 1]?.optionId);
}

/** Read one line from /dev/tty (works even when process.stdin is consumed). */
function _readTty(question: string): Promise<string> {
  return new Promise((resolve) => {
    const tty = createReadStream("/dev/tty");
    const rl = createInterface({ input: tty, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      tty.destroy();
      resolve(answer);
    });
  });
}

export interface BobAcpOptions {
  /** Workspace root Bob reads and modifies. Defaults to `process.cwd()`. */
  readonly cwd?: string;
  /** Path to the `bob` binary. Defaults to `"bob"` (from PATH). */
  readonly bobPath?: string;
  /** Extra env vars for the `bob acp` process. Set `BOB_API_KEY` here for headless auth. */
  readonly env?: Record<string, string>;
  /** Pass `--auto-approve`: approve every tool call silently, ignoring settings.json. CI use. */
  readonly autoApprove?: boolean;
  /** Called for each `RequestPermission` Bob sends. Omit to cancel unapproved requests. */
  readonly onPermissionRequest?: (
    request: AcpPermissionRequest,
  ) => void | Promise<void>;
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
export type AcpSessionEvent =
  | {
      readonly type: "text";
      readonly text: string;
      readonly assertive?: boolean;
    }
  | { readonly type: "tool_call"; readonly name: string; readonly args: string }
  | { readonly type: "usage"; readonly usage: IterationUsage };

/** @deprecated Use `AcpSessionEvent` instead. */
export type AcpTextChunk = AcpSessionEvent & { readonly type: "text" };

/**
 * A persistent Bob ACP session.
 * Create with `BobAcpSession.create(options)`. Always `close()` when done,
 * or use `await using session = await BobAcpSession.create(...)`.
 */
export class BobAcpSession {
  /** ACP session ID — pass as `resumeSessionId` to reload this session later. */
  get sessionId(): string {
    return this._session.sessionId;
  }

  private constructor(private readonly _session: AgentSession) {}

  /** Spawn `bob acp` and open a session. Returns when ready to accept prompts. */
  static async create(options: BobAcpOptions = {}): Promise<BobAcpSession> {
    const permissionHandler = options.onPermissionRequest;
    const provider = bob("default", {
      env: options.env,
      bobPath: options.bobPath,
      autoApprove: options.autoApprove,
      trust: options.trust,
      acceptLicense: options.acceptLicense,
      disableMcp: options.disableMcp,
      disableSubagents: options.disableSubagents,
      logLevel: options.logLevel,
    });
    const inner = await AgentSession.create(provider, {
      cwd: options.cwd,
      resumeSessionId: options.resumeSessionId,
      onPermissionRequest: permissionHandler
        ? async (params) => {
            let resolvedOptionId: string | undefined;
            await permissionHandler({
              toolCall: params.toolCall,
              options: params.options,
              approve: (id) => {
                resolvedOptionId = id;
              },
            });
            return resolvedOptionId;
          }
        : undefined,
    });
    return new BobAcpSession(inner);
  }

  /** Send a prompt and return the full text response. Pass `signal` to cancel mid-flight. */
  async prompt(
    text: string,
    options?: { signal?: AbortSignal },
  ): Promise<string> {
    const signal = options?.signal;
    if (signal?.aborted) throw signal.reason;

    let onAbort: (() => void) | undefined;
    const cancelOnAbort = signal
      ? new Promise<never>((_, reject) => {
          onAbort = () => {
            void this._session.cancel();
            reject(signal.reason);
          };
          signal.addEventListener("abort", onAbort, { once: true });
        })
      : undefined;

    try {
      const activeSession = this._session.activeSession;
      return cancelOnAbort
        ? await Promise.race([
            activeSession.prompt(text).then(() => activeSession.readText()),
            cancelOnAbort,
          ])
        : (await activeSession.prompt(text), await activeSession.readText());
    } finally {
      if (onAbort && signal) signal.removeEventListener("abort", onAbort);
    }
  }

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
  async *promptStream(
    text: string,
    options?: { signal?: AbortSignal },
  ): AsyncGenerator<AcpSessionEvent> {
    const signal = options?.signal;
    if (signal?.aborted) throw signal.reason;

    const activeSession = this._session.activeSession;
    const promptDone = activeSession.prompt(text);

    let onAbort: (() => void) | undefined;
    if (signal) {
      onAbort = () => {
        void this._session.cancel();
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }

    // Set once the turn ends on its own (a "stop" message arrives). If the
    // consumer instead stops iterating early — e.g. `break`s out of a
    // `for await` loop — the async generator's `.return()` jumps straight to
    // `finally` without ever reaching the `stop` check below, so this stays
    // false and the turn must be cancelled explicitly. Otherwise it keeps
    // running in the background and can race with the next prompt/promptStream call.
    let stopped = false;

    try {
      while (true) {
        if (signal?.aborted) throw signal.reason;
        const msg: ActiveSessionMessage = await activeSession.nextUpdate();
        if (msg.kind === "stop") {
          stopped = true;
          break;
        }
        if (msg.kind === "session_update") {
          for (const event of parseAcpUpdate(
            msg.update,
            this._session.toolCallNames,
          )) {
            if (
              event.type === "text" ||
              event.type === "tool_call" ||
              event.type === "usage"
            ) {
              yield event;
            }
          }
        }
      }
      await promptDone;
    } finally {
      if (onAbort && signal) signal.removeEventListener("abort", onAbort);
      if (!stopped) {
        await this._session.cancel().catch(() => {});
        await promptDone.catch(() => {});
      }
    }
  }

  /** Kill the `bob acp` process and wait for exit. */
  async close(): Promise<void> {
    await this._session.close();
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.close();
  }
}
