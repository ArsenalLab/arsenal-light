import { bob, parseAcpUpdate } from './chunk-236ZH5LO.js';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import { spawn } from 'child_process';
import { Writable, Readable } from 'stream';
import { ndJsonStream, client } from '@agentclientprotocol/sdk';

var AgentSession = class _AgentSession {
  constructor(proc, conn, activeSession) {
    this.proc = proc;
    this.conn = conn;
    this.activeSession = activeSession;
  }
  /** The ACP session ID. Pass as `resumeSessionId` to reload later. */
  get sessionId() {
    return this.activeSession.sessionId;
  }
  /** The active ACP session — use to send prompts and consume updates. */
  activeSession;
  /**
   * Tracks tool call ID → name across turns.
   * `AcpSession` populates this during `parseAcpUpdate` so that result
   * events can be correlated back to their originating call name.
   */
  toolCallNames = /* @__PURE__ */ new Map();
  /** Launch the provider's ACP server, connect, and open a session. */
  static async create(provider, options = {}) {
    const cwd = options.cwd ?? process.cwd();
    const [command, ...acpArgs] = provider.buildAcpArgs();
    if (!command) {
      throw new Error(
        `Agent provider "${provider.name}" returned an empty argv from buildAcpArgs(). It must return the full argv, e.g. ["bob", "acp"].`
      );
    }
    const proc = spawn(command, acpArgs, {
      cwd,
      env: { ...process.env, ...provider.env, ...options.env ?? {} },
      stdio: ["pipe", "pipe", "inherit"]
    });
    const stream = ndJsonStream(
      Writable.toWeb(proc.stdin),
      Readable.toWeb(
        proc.stdout
      )
    );
    const app = client({ name: "arsenal" });
    const permissionHandler = options.onPermissionRequest;
    app.onRequest(
      "session/request_permission",
      async (context) => {
        if (permissionHandler) {
          const optionId = await permissionHandler(context.params);
          if (optionId !== void 0) {
            return { outcome: { outcome: "selected", optionId } };
          }
        }
        return { outcome: { outcome: "cancelled" } };
      }
    );
    const conn = app.connect(stream);
    let activeSession;
    if (options.resumeSessionId) {
      const loadResp = await conn.agent.request("session/load", {
        sessionId: options.resumeSessionId,
        cwd,
        mcpServers: []
      });
      activeSession = conn.agent.attachSession({
        ...loadResp ?? {},
        sessionId: options.resumeSessionId
      });
    } else {
      activeSession = await conn.agent.buildSession(cwd).start();
    }
    return new _AgentSession(proc, conn, activeSession);
  }
  /** Cancel the current in-flight prompt (best-effort). */
  async cancel() {
    try {
      await this.conn.agent.notify("session/cancel", {
        sessionId: this.activeSession.sessionId
      });
    } catch {
    }
  }
  /** Kill the process and wait for exit. */
  async close() {
    try {
      this.activeSession.dispose();
    } catch {
    }
    this.proc.kill();
    await new Promise((resolve) => {
      if (this.proc.exitCode !== null || this.proc.signalCode !== null)
        resolve();
      else this.proc.once("exit", () => resolve());
    });
  }
  async [Symbol.asyncDispose]() {
    await this.close();
  }
};

// src/agents/bob/bobAcp.ts
async function interactivePermissionHandler(req) {
  process.stdout.write(
    `
Bob requests approval: ${req.toolCall.title ?? "(no title)"}
`
  );
  req.options.forEach(
    (opt, i) => process.stdout.write(`  ${i + 1}) ${opt.name}
`)
  );
  const answer = await _readTty(`Choose [1-${req.options.length}]: `);
  req.approve(req.options[parseInt(answer.trim(), 10) - 1]?.optionId);
}
function _readTty(question) {
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
var BobAcpSession = class _BobAcpSession {
  constructor(_session) {
    this._session = _session;
  }
  /** ACP session ID — pass as `resumeSessionId` to reload this session later. */
  get sessionId() {
    return this._session.sessionId;
  }
  /** Spawn `bob acp` and open a session. Returns when ready to accept prompts. */
  static async create(options = {}) {
    const permissionHandler = options.onPermissionRequest;
    const provider = bob("default", {
      env: options.env,
      bobPath: options.bobPath,
      autoApprove: options.autoApprove,
      trust: options.trust,
      acceptLicense: options.acceptLicense,
      disableMcp: options.disableMcp,
      disableSubagents: options.disableSubagents,
      logLevel: options.logLevel
    });
    const inner = await AgentSession.create(provider, {
      cwd: options.cwd,
      resumeSessionId: options.resumeSessionId,
      onPermissionRequest: permissionHandler ? async (params) => {
        let resolvedOptionId;
        await permissionHandler({
          toolCall: params.toolCall,
          options: params.options,
          approve: (id) => {
            resolvedOptionId = id;
          }
        });
        return resolvedOptionId;
      } : void 0
    });
    return new _BobAcpSession(inner);
  }
  /** Send a prompt and return the full text response. Pass `signal` to cancel mid-flight. */
  async prompt(text, options) {
    const signal = options?.signal;
    if (signal?.aborted) throw signal.reason;
    let onAbort;
    const cancelOnAbort = signal ? new Promise((_, reject) => {
      onAbort = () => {
        void this._session.cancel();
        reject(signal.reason);
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }) : void 0;
    try {
      const activeSession = this._session.activeSession;
      return cancelOnAbort ? await Promise.race([
        activeSession.prompt(text).then(() => activeSession.readText()),
        cancelOnAbort
      ]) : (await activeSession.prompt(text), await activeSession.readText());
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
  async *promptStream(text, options) {
    const signal = options?.signal;
    if (signal?.aborted) throw signal.reason;
    const activeSession = this._session.activeSession;
    const promptDone = activeSession.prompt(text);
    let onAbort;
    if (signal) {
      onAbort = () => {
        void this._session.cancel();
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }
    let stopped = false;
    try {
      while (true) {
        if (signal?.aborted) throw signal.reason;
        const msg = await activeSession.nextUpdate();
        if (msg.kind === "stop") {
          stopped = true;
          break;
        }
        if (msg.kind === "session_update") {
          for (const event of parseAcpUpdate(
            msg.update,
            this._session.toolCallNames
          )) {
            if (event.type === "text" || event.type === "tool_call" || event.type === "usage") {
              yield event;
            }
          }
        }
      }
      await promptDone;
    } finally {
      if (onAbort && signal) signal.removeEventListener("abort", onAbort);
      if (!stopped) {
        await this._session.cancel().catch(() => {
        });
        await promptDone.catch(() => {
        });
      }
    }
  }
  /** Kill the `bob acp` process and wait for exit. */
  async close() {
    await this._session.close();
  }
  async [Symbol.asyncDispose]() {
    await this.close();
  }
};

export { AgentSession, BobAcpSession, interactivePermissionHandler };
//# sourceMappingURL=chunk-MNYUFY6G.js.map
//# sourceMappingURL=chunk-MNYUFY6G.js.map