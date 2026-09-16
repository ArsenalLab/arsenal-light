/**
 * AgentSession — a persistent ACP process handle.
 *
 * Owns a live agent process and an active ACP session. Holds context
 * across multiple prompt turns — the process stays alive between calls.
 *
 * The process launched is whatever the given `AgentProvider` asks for via
 * `buildAcpArgs()`, so how the agent is configured (model, tool gating,
 * permissions, binary path) lives on the provider and nowhere else. Obtain a
 * session via `AgentSession.create(provider)` or from `BobAcpSession` (which
 * wraps this with a Bob-flavored permission handler).
 *
 * Pass to `invokeAgent({ session })` to reuse this process instead of
 * spawning a fresh one per call.
 */

import { spawn, type ChildProcess } from "node:child_process";
import { Readable, Writable } from "node:stream";
import {
  client,
  ndJsonStream,
  type ActiveSession,
  type ClientConnection,
  type ClientApp,
  type RequestPermissionRequest,
  type RequestPermissionResponse,
} from "@agentclientprotocol/sdk";
import type { AgentProvider } from "../../spi/AgentProvider.js";

/**
 * Per-session options.
 *
 * Everything about *which* agent runs and how it is configured comes from the
 * `AgentProvider` passed to `create()` — only session lifetime concerns live
 * here.
 */
export interface AgentSessionOptions {
  /** Workspace root. Defaults to `process.cwd()`. */
  readonly cwd?: string;
  /** Extra env vars, layered over the provider's own `env`. */
  readonly env?: Record<string, string>;
  /** Resume a prior session by ID instead of starting fresh. */
  readonly resumeSessionId?: string;
  /**
   * Called for each `session/request_permission` from the agent.
   * Return a selected optionId to approve, or undefined to cancel.
   */
  readonly onPermissionRequest?: (
    params: RequestPermissionRequest,
  ) => Promise<string | undefined>;
}

/**
 * A live ACP session — spawned process + active session.
 * Always call `close()` when done, or use `await using`.
 */
export class AgentSession {
  /** The ACP session ID. Pass as `resumeSessionId` to reload later. */
  get sessionId(): string {
    return this.activeSession.sessionId;
  }

  /** The active ACP session — use to send prompts and consume updates. */
  readonly activeSession: ActiveSession;

  /**
   * Tracks tool call ID → name across turns.
   * `AcpSession` populates this during `parseAcpUpdate` so that result
   * events can be correlated back to their originating call name.
   */
  readonly toolCallNames: Map<string, string> = new Map();

  private constructor(
    private readonly proc: ChildProcess,
    readonly conn: ClientConnection,
    activeSession: ActiveSession,
  ) {
    this.activeSession = activeSession;
  }

  /** Launch the provider's ACP server, connect, and open a session. */
  static async create(
    provider: AgentProvider,
    options: AgentSessionOptions = {},
  ): Promise<AgentSession> {
    const cwd = options.cwd ?? process.cwd();

    const [command, ...acpArgs] = provider.buildAcpArgs();
    if (!command) {
      throw new Error(
        `Agent provider "${provider.name}" returned an empty argv from buildAcpArgs(). ` +
          `It must return the full argv, e.g. ["bob", "acp"].`,
      );
    }

    const proc = spawn(command, acpArgs, {
      cwd,
      env: { ...process.env, ...provider.env, ...(options.env ?? {}) },
      stdio: ["pipe", "pipe", "inherit"],
    });

    const stream = ndJsonStream(
      Writable.toWeb(proc.stdin as NodeJS.WritableStream as Writable),
      Readable.toWeb(
        proc.stdout as NodeJS.ReadableStream as Readable,
      ) as ReadableStream<Uint8Array>,
    );

    const app: ClientApp = client({ name: "arsenal" });

    const permissionHandler = options.onPermissionRequest;
    app.onRequest(
      "session/request_permission",
      async (context: {
        params: RequestPermissionRequest;
      }): Promise<RequestPermissionResponse> => {
        if (permissionHandler) {
          const optionId = await permissionHandler(context.params);
          if (optionId !== undefined) {
            return { outcome: { outcome: "selected", optionId } };
          }
        }
        return { outcome: { outcome: "cancelled" } };
      },
    );

    const conn = app.connect(stream);

    let activeSession: ActiveSession;
    if (options.resumeSessionId) {
      const loadResp = await conn.agent.request("session/load", {
        sessionId: options.resumeSessionId,
        cwd,
        mcpServers: [],
      });
      activeSession = (
        conn.agent as unknown as {
          attachSession: (r: {
            sessionId: string;
            modes?: unknown;
            configOptions?: unknown;
          }) => ActiveSession;
        }
      ).attachSession({
        ...(loadResp ?? {}),
        sessionId: options.resumeSessionId,
      });
    } else {
      activeSession = await conn.agent.buildSession(cwd).start();
    }

    return new AgentSession(proc, conn, activeSession);
  }

  /** Cancel the current in-flight prompt (best-effort). */
  async cancel(): Promise<void> {
    try {
      await this.conn.agent.notify("session/cancel", {
        sessionId: this.activeSession.sessionId,
      });
    } catch {
      /* best-effort */
    }
  }

  /** Kill the process and wait for exit. */
  async close(): Promise<void> {
    try {
      this.activeSession.dispose();
    } catch {
      /* best-effort */
    }
    this.proc.kill();
    await new Promise<void>((resolve) => {
      if (this.proc.exitCode !== null || this.proc.signalCode !== null)
        resolve();
      else this.proc.once("exit", () => resolve());
    });
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.close();
  }
}
