/**
 * ACP client driver — runs a single prompt turn via the Agent Client Protocol.
 *
 * Two modes:
 *   - spawn mode  (interactiveExec provided): spawns `bob acp` fresh per call
 *   - session mode (session provided):        reuses a persistent AgentSession
 *
 * Protocol flow (spawn mode):
 *   1. interactiveExec spawns `bob acp` with in-process PassThrough streams
 *   2. ndJsonStream wraps stdin/stdout for the SDK transport
 *   3. client() + buildSession().start() performs initialize + session/new
 *   4. activeSession.prompt() sends session/prompt
 *   5. nextUpdate() loop consumes session/update notifications → onEvent
 *   6. stop message resolves the turn
 *
 * Protocol flow (session mode):
 *   1. Use provided activeSession directly — no spawn, no connect
 *   2. activeSession.prompt() sends session/prompt
 *   3. nextUpdate() loop consumes session/update notifications → onEvent
 *   4. stop message resolves the turn
 *   5. Process stays alive — caller owns the session lifetime
 */

import { Readable, Writable, PassThrough } from "node:stream";
import {
  client,
  ndJsonStream,
  type ActiveSession,
  type ActiveSessionMessage,
  type ClientApp,
} from "@agentclientprotocol/sdk";
import type {
  AgentProvider,
  ParsedStreamEvent,
} from "../../spi/AgentProvider.js";
import type { InteractiveExecOptions } from "../../spi/types.js";
import { parseAcpUpdate } from "./parseAcpUpdate.js";

/**
 * What session mode needs from a long-lived ACP session. `AgentSession`
 * (`src/platform/node/AgentSession.ts`) satisfies it; the engine depends on
 * this shape rather than on the process-owning class.
 */
export interface PersistentAcpSession {
  readonly activeSession: ActiveSession;
  /** Correlates tool-call announcements with their results across one turn. */
  readonly toolCallNames: Map<string, string>;
  /** Cancel the in-flight prompt turn. */
  cancel(): Promise<void>;
}

/** Result returned by `runAcpSession` when the prompt turn completes. */
export interface AcpSessionResult {
  /** The ACP stop reason. */
  readonly stopReason: string;
  /** Exit code of the `bob acp` process. */
  readonly exitCode: number;
  /** The ACP session ID. */
  readonly sessionId: string;
}

/** Options for `runAcpSession`. */
export interface AcpSessionOptions {
  /**
   * The agent provider — must have `buildAcpArgs` and `parseAcpUpdate`.
   * Only required in spawn mode; ignored in session mode.
   */
  readonly provider?: AgentProvider;
  /**
   * Spawn mode: launch the ACP server process per call.
   * Mutually exclusive with `session`.
   */
  readonly interactiveExec?: (
    args: string[],
    options: InteractiveExecOptions,
  ) => Promise<{ exitCode: number }>;
  /**
   * Session mode: reuse a persistent session (e.g. `AgentSession`) instead of spawning.
   * Mutually exclusive with `interactiveExec`.
   */
  readonly session?: PersistentAcpSession;
  /** Absolute path to the repository root — passed as the ACP session cwd. */
  readonly cwd: string;
  /** Prompt text to send. */
  readonly prompt: string;
  /** Called for each ParsedStreamEvent from session/update notifications. */
  readonly onEvent: (event: ParsedStreamEvent) => void;
  /**
   * Called with every raw `session/update` payload before parsing — including
   * updates the parser drops (mode changes, command lists, …).
   */
  readonly onRawUpdate?: (update: unknown) => void;
  /** AbortSignal to cancel mid-flight. */
  readonly signal?: AbortSignal;
}

/**
 * Run a single prompt turn via the ACP protocol.
 *
 * Spawn mode:  provide `interactiveExec` + `provider` — spawns fresh per call.
 * Session mode: provide `session` — reuses the persistent process.
 */
export const runAcpSession = async (
  options: AcpSessionOptions,
): Promise<AcpSessionResult> => {
  const { cwd, prompt, onEvent, onRawUpdate, signal } = options;

  signal?.throwIfAborted();

  // -------------------------------------------------------------------------
  // Session mode — reuse a persistent AgentSession
  // -------------------------------------------------------------------------
  if (options.session) {
    const { session } = options;
    const activeSession = session.activeSession;
    const sessionId = activeSession.sessionId;

    let abortListener: (() => void) | undefined;
    if (signal) {
      abortListener = () => {
        void session.cancel();
      };
      signal.addEventListener("abort", abortListener, { once: true });
    }

    try {
      signal?.throwIfAborted();

      // Reset tool-call correlation state for this turn — the session
      // persists across many turns, but a tool_call_update's callId is only
      // meaningful relative to announcements made during the same turn.
      session.toolCallNames.clear();

      const promptDone = activeSession.prompt(prompt);

      const toolCallNames = session.toolCallNames;
      while (true) {
        if (signal?.aborted) throw signal.reason;
        const msg: ActiveSessionMessage = await activeSession.nextUpdate();
        if (msg.kind === "stop") break;
        if (msg.kind === "session_update") {
          onRawUpdate?.(msg.update);
          for (const event of parseAcpUpdate(msg.update, toolCallNames)) {
            onEvent(event);
          }
        }
      }

      await promptDone;
      onEvent({ type: "session_id", sessionId });
      return { stopReason: "end_turn", exitCode: 0, sessionId };
    } finally {
      if (abortListener && signal)
        signal.removeEventListener("abort", abortListener);
    }
  }

  // -------------------------------------------------------------------------
  // Spawn mode — fresh process per call
  // -------------------------------------------------------------------------
  const { provider, interactiveExec } = options;

  if (!provider || !interactiveExec) {
    throw new Error(
      "runAcpSession: provide either `session` or both `provider` and `interactiveExec`.",
    );
  }
  if (!provider.buildAcpArgs || !provider.parseAcpUpdate) {
    throw new Error(
      `Agent provider "${provider.name}" must implement buildAcpArgs and parseAcpUpdate to use ACP sessions.`,
    );
  }

  const acpArgs = provider.buildAcpArgs();
  const parseUpdate = provider.parseAcpUpdate.bind(provider);

  const toAgent = new PassThrough();
  const fromAgent = new PassThrough();

  const execPromise = interactiveExec(acpArgs, {
    stdin: toAgent as unknown as NodeJS.ReadableStream,
    stdout: fromAgent as unknown as NodeJS.WritableStream,
    stderr: process.stderr,
    cwd,
  });

  const stream = ndJsonStream(
    Writable.toWeb(toAgent),
    Readable.toWeb(fromAgent) as ReadableStream<Uint8Array>,
  );

  const app: ClientApp = client({ name: "arsenal" });
  const conn = app.connect(stream);

  // Registered before the handshake (not after) and cleanup below wraps the
  // handshake too: if `buildSession(cwd).start()` hangs or the caller aborts
  // mid-handshake, there is no session yet to send session/cancel for, but
  // destroying the transport still tears down the spawned process instead of
  // leaking it and the still-open toAgent/fromAgent streams.
  let sessionId: string | undefined;
  let abortListener: (() => void) | undefined;
  if (signal) {
    abortListener = () => {
      if (sessionId !== undefined) {
        try {
          void conn.agent.notify("session/cancel", { sessionId });
        } catch {
          /* best-effort */
        }
      }
      setTimeout(() => {
        if (!toAgent.destroyed) toAgent.destroy();
      }, 500);
    };
    signal.addEventListener("abort", abortListener, { once: true });
  }

  let activeSession: ActiveSession | undefined;
  try {
    signal?.throwIfAborted();
    activeSession = await conn.agent.buildSession(cwd).start();
    sessionId = activeSession.sessionId;

    const promptDone = activeSession.prompt(prompt);

    while (true) {
      if (signal?.aborted) throw signal.reason;
      const msg: ActiveSessionMessage = await activeSession.nextUpdate();
      if (msg.kind === "stop") break;
      if (msg.kind === "session_update") {
        onRawUpdate?.(msg.update);
        for (const event of parseUpdate(msg.update)) {
          onEvent(event);
        }
      }
    }

    await promptDone;
    onEvent({ type: "session_id", sessionId });

    toAgent.end();
    const { exitCode } = await execPromise;
    return { stopReason: "end_turn", exitCode, sessionId };
  } finally {
    if (abortListener && signal)
      signal.removeEventListener("abort", abortListener);
    if (!toAgent.destroyed) toAgent.destroy();
    try {
      activeSession?.dispose();
    } catch {
      /* best-effort */
    }
  }
};
