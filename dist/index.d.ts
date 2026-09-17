import { I as IterationUsage, A as AgentProvider } from './AgentProvider-DX1k2ouu.js';
export { P as ParsedStreamEvent } from './AgentProvider-DX1k2ouu.js';
import { E as ExecResult, I as InteractiveExecOptions, S as SandboxProvider, B as BranchStrategy, M as MergeToHeadBranchStrategy, N as NamedBranchStrategy } from './no-sandbox-BQKCoCot.js';
export { A as AnySandboxProvider, a as BindMountBranchStrategy, b as BindMountCreateOptions, c as BindMountSandboxProvider, d as BindMountSandboxProviderConfig, H as HeadBranchStrategy, e as IsolatedBranchStrategy, f as IsolatedCreateOptions, g as IsolatedSandboxProvider, h as IsolatedSandboxProviderConfig, i as NoSandboxBranchStrategy, j as NoSandboxOptions, k as NoSandboxProvider, l as SandboxHandle, m as createBindMountSandboxProvider, n as createIsolatedSandboxProvider, o as noSandbox } from './no-sandbox-BQKCoCot.js';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { ActiveSession, ClientConnection, RequestPermissionRequest } from '@agentclientprotocol/sdk';
export { AcpPermissionRequest, AcpSessionEvent, AcpTextChunk, BobAcpOptions, BobAcpSession, interactivePermissionHandler } from './agents/bobAcp.js';
export { BobOptions, bob } from './agents/bob.js';

/**
 * A single event in the agent's output stream, surfaced to callers of `run()`
 * so they can forward it to their own observability system.
 *
 * Emitted in both `"file"` and `"stdout"` logging modes when an
 * `onAgentStreamEvent` callback is provided via `logging`. See `run()`.
 *
 * The `"raw"` variant carries every ACP `session/update` the agent sends, as a
 * JSON line, before parsing — including updates the provider's parser drops
 * (e.g. mode changes or available-command lists). Intended for debugging when
 * the typed `"text"` / `"toolCall"` events don't surface enough detail.
 */
type AgentStreamEvent = {
    readonly type: "text";
    readonly message: string;
    readonly iteration: number;
    readonly timestamp: Date;
} | {
    readonly type: "toolCall";
    readonly name: string;
    readonly formattedArgs: string;
    readonly iteration: number;
    readonly timestamp: Date;
} | {
    readonly type: "raw";
    readonly line: string;
    readonly iteration: number;
    readonly timestamp: Date;
};

/** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
interface Timeouts {
    /** Timeout (ms) for the host-side copy of `copyToWorktree` paths into the worktree. Default: 60_000. */
    readonly copyToWorktreeMs?: number;
    /** Timeout (ms) for each in-sandbox git setup command (safe.directory, user.name/email, branch discovery). Default: 10_000. */
    readonly gitSetupMs?: number;
    /** Timeout (ms) for collecting the commits produced during the run. Default: 30_000. */
    readonly commitCollectionMs?: number;
    /** Timeout (ms) for merging the temp branch back to the host branch (merge-to-head strategy). Default: 30_000. */
    readonly mergeToHostMs?: number;
}
type SandboxHooks = {
    readonly host?: {
        readonly onWorktreeReady?: ReadonlyArray<{
            readonly command: string;
            readonly timeoutMs?: number;
        }>;
        readonly onSandboxReady?: ReadonlyArray<{
            readonly command: string;
            readonly timeoutMs?: number;
        }>;
    };
    readonly sandbox?: {
        readonly onSandboxReady?: ReadonlyArray<{
            readonly command: string;
            readonly sudo?: boolean;
            readonly timeoutMs?: number;
        }>;
    };
};

/**
 * The minimal execution contract `invokeAgent` needs.
 *
 * This is intentionally narrow — just enough to run an interactive ACP process.
 * Obtain one via:
 *   - `localExecutor(cwd, env)` — run directly on the host (no sandbox needed)
 *   - `ctx.executor` from `withWorktree` callback — uses that worktree's sandbox
 *   - `sandboxExecutor(sandbox)` — wrap any `SandboxCommands`
 */
interface AgentExecutor {
    /** Run a command and collect its output (used for setup/checks). Rejects with `ExecError` if the command can't be launched. */
    readonly exec?: (command: string, options?: {
        onLine?: (line: string) => void;
        cwd?: string;
        stdin?: string;
    }) => Promise<ExecResult>;
    /**
     * Launch an interactive process (ACP transport).
     */
    readonly interactiveExec?: (args: string[], options: InteractiveExecOptions) => Promise<{
        exitCode: number;
    }>;
}

/**
 * SandboxOps — the Effect-based view of a running sandbox that every
 * engine layer (prompts, sync, sandbox lifecycle, orchestration) talks to.
 *
 * Lives in `ports/` so lower layers can depend on the contract without
 * importing `SandboxFactory.ts`'s orchestration code.
 *
 * See `spi/SandboxProvider.ts`'s `Sandbox*` glossary for how this (and
 * `SandboxCommands`, below) relate to `SandboxProvider`, `SandboxHandle`,
 * `SandboxFactory`, and `SandboxLifecycle`.
 */

/**
 * Promise-based commands against a running sandbox — the public counterpart
 * of the internal Effect-based `SandboxOps`, handed to `withWorktree`
 * callbacks as `ctx.sandbox` and accepted by `withHooks`.
 */
interface SandboxCommands {
    /** Run a command in the sandbox. Resolves with its output and exit code (non-zero exits resolve too); rejects with `ExecError` if it can't be launched. */
    readonly exec: (command: string, options?: {
        onLine?: (line: string) => void;
        cwd?: string;
        sudo?: boolean;
        stdin?: string;
    }) => Promise<ExecResult>;
    /** Launch an interactive process inside the sandbox (ACP transport), when supported. */
    readonly interactiveExec?: (args: string[], options: InteractiveExecOptions) => Promise<{
        exitCode: number;
    }>;
    /** Copy a file or directory from the host into the sandbox. Rejects with `CopyError`. */
    readonly copyIn: (hostPath: string, sandboxPath: string) => Promise<void>;
    /** Copy a single file from the sandbox to the host. Rejects with `CopyError`. */
    readonly copyFileOut: (sandboxPath: string, hostPath: string) => Promise<void>;
}
/**
 * Wrap `SandboxCommands` into an `AgentExecutor` for `invokeAgent`.
 * Inside `withWorktree`, `ctx.executor` already is one.
 */
declare const sandboxExecutor: (sandbox: SandboxCommands) => AgentExecutor;

/**
 * User-facing mount configuration for bind-mount sandbox providers.
 *
 * Each entry describes a host directory to mount into the sandbox container.
 */
/** A single bind-mount descriptor for docker()/podman() providers. */
interface MountConfig {
    /**
     * Path on the host. Supports:
     * - Absolute paths (`/data/cache`)
     * - Tilde-expanded paths (`~/data` → `<home>/data`)
     * - Relative paths (`data` or `./data`) — resolved from `process.cwd()`
     */
    readonly hostPath: string;
    /**
     * Path inside the sandbox container. Supports:
     * - Absolute paths (`/mnt/data`)
     * - Tilde-expanded paths (`~/.npm` → `/home/agent/.npm`) — expanded using the provider's sandbox home directory
     * - Relative paths (`data` or `./data`) — resolved from the worktree directory (`/home/agent/workspace`)
     */
    readonly sandboxPath: string;
    /** Mount as read-only. Defaults to `false`. */
    readonly readonly?: boolean;
}

/**
 * Central orchestrator: manages the iteration loop, delegates to
 * sandbox/git/session sub-systems, and applies the branch strategy to
 * produce final commits.
 *
 * This is the internal, Effect-based engine behind the `run`/`createSandbox`/
 * `createWorktree` presets. Its iteration loop is `runIterationLoop`
 * (`iterationLoop.ts`) — the same shared core the public, Promise-based
 * `iterate()` primitive (`composition/primitives/iterate.ts`) wraps.
 *
 * `application/orchestration/` holds only the internal machinery
 * (`Orchestrator`, `RunConfig`, `RunDisplay`, `completionSignal`,
 * `iterationLoop`). The public primitives `invokeAgent` and `iterate` live
 * in `composition/primitives/` alongside `withWorktree`/`withHooks`, making
 * the presets-vs-primitives split visible in the folder structure (see
 * `scripts/check-architecture.mjs`'s header for the full layer order).
 */

/** Per-iteration result carrying an optional session ID. */
interface IterationResult {
    /** ACP session ID reported by the agent, when it reported one. */
    readonly sessionId?: string;
    /** Token usage reported on the agent's stream, when it reported any. */
    readonly usage?: IterationUsage;
}

/**
 * A map of named values used for prompt argument substitution.
 * Each key corresponds to a `{{KEY}}` placeholder in the prompt; the value
 * replaces it before the prompt is passed to the agent.
 */
type PromptArgs = Record<string, string | number | boolean>;

/** Branded output definition for `Output.object({ tag, schema })`. */
interface OutputObjectDefinition<T> {
    readonly _tag: "object";
    readonly tag: string;
    readonly schema: StandardSchemaV1<unknown, T>;
}
/** Branded output definition for `Output.string({ tag })`. */
interface OutputStringDefinition {
    readonly _tag: "string";
    readonly tag: string;
}
/** Union of all output definition shapes accepted by `run()`. */
type OutputDefinition = OutputObjectDefinition<any> | OutputStringDefinition;
/**
 * Helpers for declaring structured output on `run()`.
 *
 * ```ts
 * import { Output, run } from "@arsenallab/arsenal-light";
 * import { z } from "zod";
 *
 * const result = await run({
 *   output: Output.object({ tag: "result", schema: z.object({ answer: z.number() }) }),
 *   // ...
 * });
 * console.log(result.output.answer); // typed as number
 * ```
 */
declare const Output: {
    /**
     * Declare an object-typed structured output extracted from an XML tag in
     * the agent's stdout. The tag contents are JSON-parsed (with fence-aware
     * unwrapping) and validated against the provided Standard Schema validator.
     */
    readonly object: <Schema extends StandardSchemaV1>(opts: {
        tag: string;
        schema: Schema;
    }) => OutputObjectDefinition<StandardSchemaV1.InferOutput<Schema>>;
    /**
     * Declare a string-typed structured output extracted from an XML tag in
     * the agent's stdout. The tag contents are whitespace-trimmed and returned
     * as a plain string — no JSON parsing, no schema validation.
     */
    readonly string: (opts: {
        tag: string;
    }) => OutputStringDefinition;
};
interface StructuredOutputErrorOptions {
    readonly tag: string;
    readonly rawMatched: string | undefined;
    readonly cause?: unknown;
    readonly commits: {
        sha: string;
    }[];
    readonly branch: string;
    readonly preservedWorktreePath?: string;
    readonly sessionId?: string;
}
/**
 * Thrown by `run()` when structured output extraction or validation fails.
 *
 * Possible failure modes:
 * - The configured XML tag was not found in stdout (`rawMatched` is `undefined`).
 * - The tag contents failed `JSON.parse` (`cause` carries the parse error).
 * - The parsed JSON failed schema validation (`cause` carries the Standard Schema issues).
 *
 * The error carries `commits`, `branch`, and optionally `preservedWorktreePath`
 * so callers can decide recovery without losing the run's side effects.
 *
 * It also carries the ACP `sessionId` of the iteration that produced the bad
 * output, when the agent reported one.
 */
declare class StructuredOutputError extends Error {
    readonly tag: string;
    readonly rawMatched: string | undefined;
    readonly cause: unknown;
    readonly commits: {
        sha: string;
    }[];
    readonly branch: string;
    readonly preservedWorktreePath?: string;
    /** Session ID of the iteration that produced the bad output, when available. */
    readonly sessionId?: string;
    constructor(message: string, options: StructuredOutputErrorOptions);
}

/**
 * Logging config shared by the composing entry points (`run`, `createSandbox`,
 * `createWorktree`). Kept separate from `run.ts` so those modules don't have
 * to depend on the `run` command's own file just to type a `logging` option —
 * deliberately avoiding that coupling rather than introducing a shared
 * abstraction before a second caller needs one. `Timeouts` lives in
 * `ports/lifecycleConfig.ts`,
 * shared by `SandboxLifecycle.ts` and the composing entry points that
 * configure it.
 */

/**
 * Controls where Arsenal writes iteration progress and agent output.
 * Use `"file"` (log-to-file mode) to write to a log file on disk, or
 * `"stdout"` (terminal mode) to render an interactive UI in the terminal.
 */
type LoggingOption = 
/** Write progress and agent output to a log file at the given path (log-to-file mode). */
{
    readonly type: "file";
    readonly path: string;
    /**
     * Optional callback invoked for each agent stream event (text chunk,
     * tool call, or raw ACP update) in addition to being written to the
     * log file. Intended for forwarding the agent's output stream to
     * external observability systems. Errors thrown by the callback are
     * swallowed.
     */
    readonly onAgentStreamEvent?: (event: AgentStreamEvent) => void;
    /**
     * When `true`, every ACP `session/update` the agent sends is appended
     * as a JSON line to the same log file at `path`, in real time.
     * Includes updates the provider's parser would otherwise drop (e.g.
     * mode changes or available-command lists). Intended for debugging
     * stuck or unexpected agent behavior — note that the raw JSON is
     * interleaved with the human-readable log output. Default: `false`.
     */
    readonly verbose?: boolean;
}
/** Render progress and agent output as an interactive UI in the terminal (terminal mode). */
 | {
    readonly type: "stdout";
    /**
     * When `true`, every ACP `session/update` the agent sends is written
     * as a JSON line to `process.stdout`, in real time. Includes updates
     * the provider's parser would otherwise drop. Intended for
     * debugging stuck or unexpected agent behavior. Note: the raw output
     * is interleaved with the interactive terminal UI. Default: `false`.
     */
    readonly verbose?: boolean;
    /**
     * Optional callback invoked for each agent stream event (text chunk,
     * tool call, or raw ACP update) in addition to the terminal UI.
     * Mirrors `"file"` mode's `onAgentStreamEvent` — lets code driving its
     * own orchestration (calling `.run()` repeatedly under custom control
     * flow) observe or branch on live output without giving up the
     * terminal UI. Errors thrown by the callback are swallowed.
     */
    readonly onAgentStreamEvent?: (event: AgentStreamEvent) => void;
};

/**
 * `run()` — the top-level preset built on the internal `orchestrate()`
 * engine (`application/orchestration/Orchestrator.ts`).
 *
 * One-shot: creates its own sandbox (and worktree, if the branch strategy
 * needs one), runs the agent, then tears everything down — all within this
 * single call. If you need a workspace that outlives one agent invocation
 * (reused across several `.run()` calls, inspected, or handed to another
 * task), use `createWorktree()` / `createSandbox()` instead and call
 * `.run()` on the handle they return — a different method from this one,
 * which reuses the existing sandbox rather than creating a new one.
 *
 * This file lives in `composition/` (L5, composition roots): the layer
 * allowed to import `platform/` and perform real I/O — everything below it
 * (`application/`, `ports/`, `spi/`) stays free of `node:child_process`,
 * `console.*`, and other platform calls, going through ports instead. That's
 * also why `withHooks`/`withWorktree` sit here rather than next to
 * `iterate`/`invokeAgent` in `application/orchestration/` (platform-I/O-free) —
 * the directory split tracks I/O privilege, not public vs. internal.
 * `scripts/check-architecture.mjs` enforces the layer order and the I/O rule
 * mechanically; see its header comment for the full layer table.
 */

interface RunOptions<A extends AgentProvider = AgentProvider> {
    /** Agent provider to use (e.g. bob("default")) */
    readonly agent: A;
    /** Sandbox provider (e.g. docker({ imageName: "arsenal:myrepo" })). */
    readonly sandbox: SandboxProvider;
    /**
     * Host repo directory. Replaces `process.cwd()` as the anchor for
     * `.arsenal/worktrees/`, `.arsenal/.env`, `.arsenal/logs/`,
     * `.arsenal/patches/`, and git operations.
     *
     * - Relative paths are resolved against `process.cwd()`.
     * - Absolute paths are used as-is.
     * - Defaults to `process.cwd()` when omitted.
     */
    readonly cwd?: string;
    /** Inline prompt string (mutually exclusive with promptFile) */
    readonly prompt?: string;
    /**
     * Path to a prompt file (mutually exclusive with prompt).
     *
     * **Note:** `promptFile` is always resolved against `process.cwd()`, not
     * against the `cwd` option. If you set a custom `cwd`, pass an absolute
     * `promptFile` to avoid ambiguity.
     */
    readonly promptFile?: string;
    /** Maximum iterations to run (default: 1) */
    readonly maxIterations?: number;
    /** Lifecycle hooks grouped by execution location (host or sandbox). */
    readonly hooks?: SandboxHooks;
    /** Key-value map for {{KEY}} placeholder substitution in prompts */
    readonly promptArgs?: PromptArgs;
    /** Logging mode (default: { type: 'file' } with auto-generated path under .arsenal/logs/) */
    readonly logging?: LoggingOption;
    /** Substring(s) the agent emits to stop the iteration loop early. Matched via `includes` against agent output. (default: `"<promise>COMPLETE</promise>"`) */
    readonly completionSignal?: string | string[];
    /** Idle timeout in seconds. If the agent produces no output for this long, it fails. Default: 600 (10 minutes) */
    readonly idleTimeoutSeconds?: number;
    /**
     * Grace window in seconds after a completion signal is observed in the
     * agent's output. The agent process is expected to exit shortly after
     * emitting the signal; if it does not (typically because a spawned child —
     * a `gh`/git subprocess or long-lived MCP server — keeps stdout open),
     * Arsenal force-completes the iteration with a warning. Resets on every
     * subsequent output line so trailing data (token-usage events, terminal
     * `result` events, structured-output tags) is still captured. Independent
     * of `idleTimeoutSeconds`. Default: 60.
     */
    readonly completionTimeoutSeconds?: number;
    /** Optional name for the run, shown as a prefix in log output */
    readonly name?: string;
    /** Paths relative to the host repo root to copy into the worktree before sandbox start. */
    readonly copyToWorktree?: string[];
    /** Branch strategy — controls how the agent's changes relate to branches.
     * Defaults to { type: "head" } for bind-mount providers and { type: "merge-to-head" } for isolated providers. */
    readonly branchStrategy?: BranchStrategy;
    /**
     * An `AbortSignal` that cancels the run when aborted.
     *
     * - If `signal.aborted` is already `true` at entry, `run()` rejects
     *   immediately without doing any setup work.
     * - Aborting mid-iteration kills the in-flight agent subprocess.
     * - Phase boundaries (between iterations) also check the signal.
     * - The rejected promise surfaces `signal.reason` via
     *   `signal.throwIfAborted()` — no Arsenal-specific wrapping.
     * - The worktree is preserved on disk after abort (error-path behavior).
     */
    readonly signal?: AbortSignal;
    /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
    readonly timeouts?: Timeouts;
    /**
     * Number of additional attempts per iteration when the agent fails with an
     * `AgentError` or `AgentIdleTimeoutError` (e.g. SSH disconnect, non-zero exit,
     * idle timeout). Each retry creates a completely fresh sandbox, so lifecycle
     * is unaffected. Default: `0` (no retries).
     */
    readonly iterationRetries?: number;
    /**
     * Structured output definition. When provided, the agent's stdout is
     * scanned for the configured XML tag after the iteration completes, and the
     * result is parsed/validated and returned on `RunResult.output`.
     *
     * Use `Output.object({ tag, schema })` for JSON+schema or
     * `Output.string({ tag })` for raw string extraction.
     *
     * Constraints:
     * - `maxIterations` must be `1` (the default): `RunResult.output` is a
     *   single value, and nothing here would arbitrate which iteration's tag
     *   should win if more than one emitted it.
     * - The resolved prompt must contain the configured opening tag literal.
     */
    readonly output?: OutputDefinition;
}

interface RunResult {
    /** Per-iteration results (use `iterations.length` for the count). */
    readonly iterations: IterationResult[];
    /** The matched completion signal string, or undefined if no signal fired before the iteration limit. */
    readonly completionSignal?: string;
    /** Combined stdout output from all agent iterations. */
    readonly stdout: string;
    /** List of commits made by the agent during the run, each identified by its SHA. */
    readonly commits: {
        sha: string;
    }[];
    /** The branch name the agent worked on inside the sandbox. */
    readonly branch: string;
    /** Path to the log file, if logging was drained to a file. */
    readonly logFilePath?: string;
    /** Host path to the preserved worktree, set when the run succeeded but the worktree had uncommitted changes. */
    readonly preservedWorktreePath?: string;
}
/** Overload: with `Output.object`, returns `RunResult` with typed `output: T`. */
declare function run<T, A extends AgentProvider>(options: RunOptions<A> & {
    output: OutputObjectDefinition<T>;
}): Promise<RunResult & {
    output: T;
}>;
/** Overload: with `Output.string`, returns `RunResult` with `output: string`. */
declare function run<A extends AgentProvider>(options: RunOptions<A> & {
    output: OutputStringDefinition;
}): Promise<RunResult & {
    output: string;
}>;
/** Overload: without `output`, returns the standard `RunResult`. */
declare function run<A extends AgentProvider>(options: RunOptions<A>): Promise<RunResult>;

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

/**
 * What session mode needs from a long-lived ACP session. `AgentSession`
 * (`src/platform/node/AgentSession.ts`) satisfies it; the engine depends on
 * this shape rather than on the process-owning class.
 */
interface PersistentAcpSession {
    readonly activeSession: ActiveSession;
    /** Correlates tool-call announcements with their results across one turn. */
    readonly toolCallNames: Map<string, string>;
    /** Cancel the in-flight prompt turn. */
    cancel(): Promise<void>;
}

/**
 * invokeAgentEffect — internal Effect-based implementation of one agent turn.
 *
 * This is the shared core used by both the public `invokeAgent()` primitive
 * (`composition/primitives/invokeAgent.ts`) and the internal `Orchestrator`
 * (`Orchestrator.ts`). It is not part of the public API.
 *
 * Kept in `application/orchestration/` (L4) so `Orchestrator` can import it
 * without an upward layer violation. The public wrapper in
 * `composition/primitives/invokeAgent.ts` reaches down to this file.
 */

/** Result of a single agent invocation turn. */
interface InvokeAgentResult {
    /** The final text response or result from the agent. */
    readonly result: string;
    /** The session ID if one was emitted during this turn. */
    readonly sessionId?: string;
    /** Token/cost usage snapshot from this turn. */
    readonly usage?: IterationUsage;
    /** The completion signal matched in the output, if any. */
    readonly completionSignal?: string;
}
/** Options for invokeAgent. */
interface InvokeAgentOptions {
    /** The executor to run commands through. Use `localExecutor()` for host runs, or `ctx.executor` from `withWorktree`. */
    readonly executor: AgentExecutor;
    /** Absolute path to the repo root inside the sandbox/worktree. */
    readonly cwd: string;
    /** Prompt text to send to the agent. */
    readonly prompt: string;
    /** The agent provider — supplies transport args and output parsers. */
    readonly provider: AgentProvider;
    /**
     * Completion signals to scan for in the agent's output.
     * Defaults to `["<promise>COMPLETE</promise>"]`.
     */
    readonly completionSignal?: string | readonly string[];
    /** Idle timeout in seconds before failing. Default: 600. */
    readonly idleTimeoutSeconds?: number;
    /** Grace window in seconds after completion signal is seen. Default: 60. */
    readonly completionTimeoutSeconds?: number;
    /** AbortSignal to cancel mid-flight. */
    readonly signal?: AbortSignal;
    /**
     * Reuse a persistent ACP session instead of spawning a fresh process.
     * Pass an `AgentSession` from `AgentSession.create()` or from a `BobAcpSession` wrapper.
     */
    readonly session?: PersistentAcpSession;
    /** Called for each text chunk emitted by the agent. */
    readonly onText?: (text: string) => void;
    /** Called for each tool call announcement or result. */
    readonly onToolCall?: (name: string, args: string) => void;
    /**
     * Called with every raw ACP `session/update` as a JSON line, before parsing —
     * including updates that produce no typed event. Any update resets the idle timer.
     */
    readonly onRawLine?: (line: string) => void;
    /** Called when the agent is idle for each elapsed minute. */
    readonly onIdleWarning?: (minutes: number) => void;
    /** Called when the completion-grace timer fires. */
    readonly onCompletionTimeout?: (timeoutMs: number) => void;
}

/**
 * invokeAgent — standalone primitive for running one agent turn.
 *
 * This is the lowest composable layer above the transport. It handles:
 *   - ACP session execution (spawn-per-call or persistent AgentSession)
 *   - idle timeout and completion-grace timer
 *   - completion signal detection
 *   - abort signal wiring
 *
 * It knows nothing about worktrees, git lifecycle, iterations, or hooks.
 * Those are separate opt-in layers above this one.
 *
 * @example
 * ```typescript
 * // Just invoke — no orchestration at all
 * const result = await invokeAgent({
 *   executor: localExecutor(process.cwd(), env),
 *   cwd: process.cwd(),
 *   prompt: "List all files",
 *   provider: bob("default"),
 *   signal,
 * });
 *
 * // With your own worktree wrapping it
 * await withWorktree({ ... }, async (ctx) => {
 *   await invokeAgent({ executor: ctx.executor, cwd: ctx.cwd, prompt, provider });
 * });
 * ```
 *
 * Lives in `composition/primitives/` alongside `iterate`, `withWorktree`, and
 * `withHooks` — all four public primitives are co-located here.
 *
 * The Effect-based implementation lives in
 * `application/orchestration/invokeAgentEffect.ts` (L4) so the internal
 * `Orchestrator` can share it without an upward layer violation.
 */

/**
 * Run one agent turn through `options.executor` using ACP transport.
 *
 * Rejects with the original error — `AgentError`, `AgentIdleTimeoutError`, or
 * the abort signal's `reason` — never an Effect wrapper.
 */
declare const invokeAgent: (options: InvokeAgentOptions) => Promise<InvokeAgentResult>;

/**
 * Executors — the minimal process-launch contract `invokeAgent` runs through.
 *
 * `localExecutor` runs on the host. The contract itself (`AgentExecutor`) and
 * the sandbox-backed adapter (`sandboxExecutor`) live in `ports/` so
 * this file never depends on the sandbox layer.
 */

/**
 * Build a plain host executor — runs commands directly in the current process,
 * no sandbox or worktree required.
 *
 * Use this for `invokeAgent` at Level 0/1 when you have no `withWorktree` context.
 */
declare const localExecutor: (cwd: string, env?: Record<string, string>) => AgentExecutor;

/**
 * withWorktree — standalone primitive for git-isolated agent execution.
 *
 * Creates a fresh git worktree (branch), runs your callback inside it,
 * then merges/commits/cleans up. Everything about git branch isolation
 * lives here — nothing about what the agent does inside.
 *
 * This is an opt-in layer. Use it when you want branch isolation.
 * Skip it when you don't (e.g. direct no-sandbox runs).
 *
 * @example
 * ```typescript
 * // With worktree isolation — agent runs on its own branch
 * const result = await withWorktree(
 *   { hostRepoDir: process.cwd(), branch: "my-feature" },
 *   async (ctx) => {
 *     return await invokeAgent({ executor: ctx.executor, cwd: ctx.cwd, ... });
 *   },
 * );
 * console.log(result.commits, result.branch);
 *
 * // Without — just call invokeAgent directly, no worktree
 * const result = await invokeAgent({ executor: localExecutor(cwd), cwd, ... });
 * ```
 */

/** Context passed to the callback inside withWorktree. */
interface WorktreeContext {
    /**
     * Executor for `invokeAgent` — the minimal exec interface for this worktree.
     * Use `ctx.executor` with `invokeAgent({ executor: ctx.executor, ... })`.
     */
    readonly executor: AgentExecutor;
    /**
     * Underlying sandbox service. Available if you need sandbox-specific
     * operations (copyIn, copyFileOut, hooks). For `invokeAgent`, prefer `executor`.
     */
    readonly sandbox: SandboxCommands;
    /** Absolute path to the repo root inside the sandbox/worktree. */
    readonly cwd: string;
}
/** Result returned by withWorktree after the callback completes. */
interface WithWorktreeResult<A> {
    readonly value: A;
    /** Commits created during the run. */
    readonly commits: {
        sha: string;
    }[];
    /** The branch name used. */
    readonly branch: string;
    /** Host path to the preserved worktree when uncommitted changes remain. */
    readonly preservedWorktreePath?: string;
}
/** Options for withWorktree. */
interface WithWorktreeOptions {
    /**
     * The agent provider — used only to resolve env vars, merged into the
     * sandbox once at creation time, before `work` runs. If `work` invokes
     * `invokeAgent()` with a *different* provider (or several), pass whichever
     * provider(s) you actually invoke inside `work` here too, or that
     * provider's `env` won't reach the sandbox.
     */
    readonly agent: AgentProvider;
    /** The sandbox provider. */
    readonly sandbox: SandboxProvider;
    /** Host-side repo root. Defaults to process.cwd(). */
    readonly cwd?: string;
    /** Branch strategy. Defaults to `merge-to-head` for isolated, `head` for bind-mount. */
    readonly branchStrategy?: BranchStrategy;
    /** Explicit branch name (used with `branch` strategy). */
    readonly branch?: string;
    /** Lifecycle hooks. */
    readonly hooks?: SandboxHooks;
    /** AbortSignal to cancel. */
    readonly signal?: AbortSignal;
    /** Override built-in lifecycle step timeouts. */
    readonly timeouts?: Timeouts;
    /** Name prefix for auto-generated branch/worktree names. */
    readonly name?: string;
    /** Paths relative to host repo root to copy into the worktree. */
    readonly copyToWorktree?: string[];
}
/**
 * Run a callback inside a git-isolated worktree.
 *
 * Creates the worktree, runs `work`, then handles git lifecycle
 * (merge/commit collection/cleanup). The callback receives a `WorktreeContext`
 * with a sandbox service and the cwd path inside the worktree.
 */
declare function withWorktree<A>(options: WithWorktreeOptions, work: (ctx: WorktreeContext) => Promise<A>): Promise<WithWorktreeResult<A>>;

/**
 * withHooks — standalone primitive for running sandbox lifecycle hooks.
 *
 * Runs host-side and sandbox-side hooks around a callback. This is the
 * opt-in layer for `onWorktreeReady` / `onSandboxReady` hooks without
 * requiring the full orchestration stack.
 *
 * @example
 * ```typescript
 * // Run hooks around your own agent invocation
 * await withHooks(
 *   hooks,
 *   { cwd: "/repo", sandbox },
 *   async () => {
 *     await invokeAgent({ executor, cwd: "/repo", prompt, provider });
 *   },
 * );
 *
 * // No hooks needed — just skip this layer entirely
 * await invokeAgent({ executor, cwd, prompt, provider });
 * ```
 *
 * `cwd` and `sandboxCwd` are the same path above only because `sandbox` here
 * is a bind-mount provider. For an isolated `SandboxProvider` (e.g. one from
 * `createIsolatedSandboxProvider`), pass `ctx.cwd` from `withWorktree` as
 * `sandboxCwd` explicitly — it's a different filesystem root than the host `cwd`.
 *
 * Lives in `composition/primitives/` alongside `invokeAgent`, `iterate`, and
 * `withWorktree` — all four public primitives are co-located here.
 * `composition/` may import `platform/` and do real I/O; `application/` may
 * not (see `scripts/check-architecture.mjs`'s header for the full layer
 * order and the I/O rule it enforces).
 */

/** Options for withHooks. */
interface WithHooksOptions {
    /** Host-side repo root — used as cwd for host hooks. */
    readonly cwd: string;
    /**
     * Sandbox to run sandbox-side hooks (`hooks.sandbox.onSandboxReady`) in —
     * e.g. `ctx.sandbox` from `withWorktree`. Optional when you have no sandbox hooks.
     */
    readonly sandbox?: SandboxCommands;
    /**
     * Repo root *inside* the sandbox, used as cwd for sandbox-side hooks —
     * e.g. `ctx.cwd` from `withWorktree`. Defaults to `cwd` when omitted, which
     * is only correct when the host and sandbox share a filesystem (bind-mount
     * or no-sandbox). Pass this explicitly for an isolated `SandboxProvider`
     * (e.g. `createIsolatedSandboxProvider`), where the sandbox-side path is a
     * different filesystem root than the host.
     */
    readonly sandboxCwd?: string;
    /** AbortSignal threaded to hooks. */
    readonly signal?: AbortSignal;
}
/**
 * Run lifecycle hooks around a callback.
 *
 * Executes host `onWorktreeReady` → host `onSandboxReady` → sandbox
 * `onSandboxReady` in order before calling `work`, then returns its result.
 * No teardown hooks run after — hooks are setup-only in this model.
 *
 * Omit this layer entirely if you have no hooks.
 */
declare function withHooks<A>(hooks: SandboxHooks, options: WithHooksOptions, work: () => Promise<A>): Promise<A>;

/**
 * runIterationLoop — the shared Effect-based core behind both `iterate()`
 * (`iterate.ts`, the Promise-facing public primitive) and `orchestrate()`
 * (`Orchestrator.ts`, the internal engine behind the `run`/`createSandbox`/
 * `createWorktree` presets). Runs `work` up to `maxIterations` times,
 * retrying `AgentError`/`AgentIdleTimeoutError` failures per iteration with
 * exponential backoff, checking `signal` before every iteration and every
 * retry attempt, and stopping early when `shouldStop` returns `true`.
 */

/** Per-iteration result. */
interface IterationOutcome<A> {
    /** 1-based iteration number. */
    readonly iteration: number;
    /** Result from the callback. */
    readonly result: A;
}

/**
 * iterate — standalone primitive for multi-iteration agent loops.
 *
 * Runs a callback N times, collecting results from each iteration.
 * Handles retry logic for agent failures and abort signal checks
 * between iterations.
 *
 * This is an opt-in layer. Use it when you need multiple iterations.
 * Skip it and call your callback once for single-turn runs.
 *
 * @example
 * ```typescript
 * // Multiple iterations with retry
 * const results = await iterate(
 *   { maxIterations: 3, iterationRetries: 1, signal },
 *   async (i) => {
 *     return await invokeAgent({ executor, cwd, prompt, provider });
 *   },
 * );
 *
 * // Single turn — just call directly, skip iterate()
 * const result = await invokeAgent({ executor, cwd, prompt, provider });
 * ```
 *
 * A thin Promise-facing wrapper around `runIterationLoop`
 * (`application/orchestration/iterationLoop.ts`) — the same shared core
 * `orchestrate()` (`Orchestrator.ts`, the engine behind the `run`/
 * `createSandbox`/`createWorktree` presets) runs directly in Effect-space.
 *
 * Lives in `composition/primitives/` alongside `invokeAgent`, `withWorktree`,
 * and `withHooks` — all four public primitives are co-located here. The L4
 * internal machinery (`Orchestrator`, `iterationLoop`, etc.) stays in
 * `application/orchestration/`; the split tracks I/O privilege, not
 * public-vs-internal (see `scripts/check-architecture.mjs`'s header for the
 * full layer order).
 */

/** Options for iterate. */
interface IterateOptions<A = unknown> {
    /** Number of iterations to run. Default: 1. */
    readonly maxIterations?: number;
    /**
     * Number of additional retry attempts per iteration on agent failure.
     * 0 = no retries (fail immediately). Default: 0.
     */
    readonly iterationRetries?: number;
    /** AbortSignal to cancel between iterations. */
    readonly signal?: AbortSignal;
    /**
     * Called before each retry attempt with the error and attempt number.
     * Use to log or display retry progress.
     */
    readonly onRetry?: (error: Error, attempt: number, maxRetries: number) => void;
    /**
     * Called after each successful iteration. Return `true` to stop early —
     * e.g. when the agent emitted its completion signal. The stopping
     * iteration's outcome is included in the results.
     */
    readonly shouldStop?: (result: A, iteration: number) => boolean;
}
/**
 * Run a callback up to `maxIterations` times.
 *
 * The callback receives the 1-based iteration number. On agent errors
 * (`AgentError` / `AgentIdleTimeoutError`), retries up to `iterationRetries`
 * additional times with exponential backoff before failing the iteration.
 * Stops early when `shouldStop` returns `true`.
 *
 * Returns an array of per-iteration outcomes in order.
 */
declare function iterate<A>(options: IterateOptions<A>, work: (iteration: number) => Promise<A>): Promise<IterationOutcome<A>[]>;

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

/**
 * Per-session options.
 *
 * Everything about *which* agent runs and how it is configured comes from the
 * `AgentProvider` passed to `create()` — only session lifetime concerns live
 * here.
 */
interface AgentSessionOptions {
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
    readonly onPermissionRequest?: (params: RequestPermissionRequest) => Promise<string | undefined>;
}
/**
 * A live ACP session — spawned process + active session.
 * Always call `close()` when done, or use `await using`.
 */
declare class AgentSession {
    private readonly proc;
    readonly conn: ClientConnection;
    /** The ACP session ID. Pass as `resumeSessionId` to reload later. */
    get sessionId(): string;
    /** The active ACP session — use to send prompts and consume updates. */
    readonly activeSession: ActiveSession;
    /**
     * Tracks tool call ID → name across turns.
     * `AcpSession` populates this during `parseAcpUpdate` so that result
     * events can be correlated back to their originating call name.
     */
    readonly toolCallNames: Map<string, string>;
    private constructor();
    /** Launch the provider's ACP server, connect, and open a session. */
    static create(provider: AgentProvider, options?: AgentSessionOptions): Promise<AgentSession>;
    /** Cancel the current in-flight prompt (best-effort). */
    cancel(): Promise<void>;
    /** Kill the process and wait for exit. */
    close(): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
}

/**
 * Scan accumulated agent output for a completion signal, returning the first
 * matching signal string or `undefined`. This is the exact matching logic
 * `orchestrate()` uses internally to decide when an agent has finished —
 * exported so custom orchestration built on `createSandbox()`/`createWorktree()`
 * (calling `.run()` repeatedly under your own control flow instead of through
 * `run()`'s built-in iteration loop) can apply the same semantics to each
 * step's output without reimplementing it.
 *
 * Matches by substring against the given text — callers driving their own
 * orchestration should scan the same accumulated/parsed output `run()` would
 * (not raw stdout, which can echo the prompt itself and false-positive on the
 * signal — see the `AgentInvocationResult.completionSignal` doc comment).
 */
declare const matchCompletionSignal: (output: string, completionSignal: string | readonly string[] | undefined) => string | undefined;

/**
 * Public types for `createSandbox()` and the long-lived `Sandbox` handle.
 */

interface CreateSandboxOptions {
    /** Explicit branch for the worktree (required). */
    readonly branch: string;
    /**
     * Ref to fork from when `branch` does not yet exist. Ignored when the branch
     * already exists. Defaults to `HEAD`.
     */
    readonly baseBranch?: string;
    /** Sandbox provider (e.g. docker({ imageName: "arsenal:myrepo" })). */
    readonly sandbox: SandboxProvider;
    /**
     * Host repo directory. Replaces `process.cwd()` as the anchor for
     * `.arsenal/worktrees/`, `.arsenal/.env`, and git operations.
     *
     * - Relative paths are resolved against `process.cwd()`.
     * - Absolute paths are used as-is.
     * - Defaults to `process.cwd()` when omitted.
     */
    readonly cwd?: string;
    /** Lifecycle hooks grouped by execution location (host or sandbox). */
    readonly hooks?: SandboxHooks;
    /** Paths relative to the host repo root to copy into the worktree at creation time. */
    readonly copyToWorktree?: string[];
    /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
    readonly timeouts?: Timeouts;
}
interface SandboxRunOptions {
    /** Key-value map for {{KEY}} placeholder substitution in prompts. */
    readonly promptArgs?: PromptArgs;
    /** Substring(s) the agent emits to stop the iteration loop early. */
    readonly completionSignal?: string | string[];
    /** Idle timeout in seconds. Default: 600. */
    readonly idleTimeoutSeconds?: number;
    /** Grace window in seconds after a completion signal is observed but the agent process has not exited — e.g. a spawned `gh`/git subprocess or long-lived MCP server inherited the exec's stdout pipe and is keeping it open. Default: 60. */
    readonly completionTimeoutSeconds?: number;
    /** Display name for this run. */
    readonly name?: string;
    /** Logging mode. */
    readonly logging?: LoggingOption;
    /**
     * Number of additional attempts per iteration when the agent fails with an
     * agent error or idle timeout. Each retry spins up a completely fresh
     * sandbox. Default: 0 (no retries — fail immediately on first error). See
     * `OrchestrateOptions.iterationRetries` for full semantics.
     */
    readonly iterationRetries?: number;
    /**
     * An `AbortSignal` that cancels the run when aborted.
     *
     * - Pre-aborted signal rejects immediately without setup.
     * - Mid-iteration abort kills the in-flight agent subprocess.
     * - The rejected promise surfaces `signal.reason` verbatim.
     * - The `Sandbox` handle remains usable after abort — call `.runAgent()`
     *   again with a fresh signal, or `.close()` to tear down.
     */
    readonly signal?: AbortSignal;
    /** Agent provider to use (e.g. bob("default")). */
    readonly agent: AgentProvider;
    /** Inline prompt string (mutually exclusive with promptFile). */
    readonly prompt?: string;
    /** Path to a prompt file (mutually exclusive with prompt). */
    readonly promptFile?: string;
    /** Maximum iterations to run (default: 1). */
    readonly maxIterations?: number;
}
interface SandboxRunResult {
    /** Per-iteration results (use `iterations.length` for the count). */
    readonly iterations: IterationResult[];
    /** The matched completion signal string, or undefined if none fired. */
    readonly completionSignal?: string;
    /** Combined stdout output from all agent iterations. */
    readonly stdout: string;
    /** List of commits made by the agent during the run. */
    readonly commits: {
        sha: string;
    }[];
    /** Path to the log file, if logging was drained to a file. */
    readonly logFilePath?: string;
}
interface SandboxInteractiveOptions {
    /** Agent provider to use (e.g. bob("default")). */
    readonly agent: AgentProvider;
    /** Inline prompt string (mutually exclusive with promptFile). */
    readonly prompt?: string;
    /** Path to a prompt file (mutually exclusive with prompt). */
    readonly promptFile?: string;
    /** Key-value map for {{KEY}} placeholder substitution in prompts. */
    readonly promptArgs?: PromptArgs;
    /** Display name for this interactive session. */
    readonly name?: string;
    /**
     * An `AbortSignal` that cancels the interactive session when aborted.
     *
     * - Pre-aborted signal rejects immediately without setup.
     * - The rejected promise surfaces `signal.reason` verbatim.
     * - The `Sandbox` handle remains usable after abort.
     */
    readonly signal?: AbortSignal;
}
interface SandboxInteractiveResult {
    /** List of commits made during the interactive session. */
    readonly commits: {
        sha: string;
    }[];
    /** Exit code of the interactive process. */
    readonly exitCode: number;
}
interface CloseResult {
    /** Host path to the preserved worktree, set when the worktree had uncommitted changes. */
    readonly preservedWorktreePath?: string;
}
interface Sandbox {
    /** The branch the worktree is on. */
    readonly branch: string;
    /** Host path to the worktree. */
    readonly worktreePath: string;
    /**
     * Invoke an agent inside *this* existing sandbox — reuses the
     * worktree/container already set up by `createSandbox()` or
     * `Worktree.attachSandbox()`. Unlike the top-level `run()`, this never
     * creates or tears down a sandbox itself; call `.close()` for that. Safe
     * to call repeatedly against the same `Sandbox` handle. Named `runAgent`
     * (not `run`) precisely so it can't be confused with the top-level `run()`.
     */
    runAgent(options: SandboxRunOptions): Promise<SandboxRunResult>;
    /**
     * Launch an interactive agent session inside *this* existing sandbox —
     * same reuse semantics as `.runAgent()` above, just a live/attached session
     * instead of a one-shot prompt. There is no top-level `interactive()`;
     * this method is the only way to start one.
     */
    interactive(options: SandboxInteractiveOptions): Promise<SandboxInteractiveResult>;
    /**
     * Execute a command inside the existing sandbox.
     *
     * `cwd` defaults to the sandbox repo path (same default `.interactive()`
     * uses), so callers get the same working directory across providers. Pass
     * `cwd` to override.
     *
     * Returns the full `ExecResult` — non-zero `exitCode` is surfaced, not
     * thrown. Callers that want strict semantics should check `result.exitCode`
     * themselves (matching the contract of `SandboxHandle.exec`).
     */
    exec(command: string, options?: SandboxExecOptions): Promise<ExecResult>;
    /**
     * Tear down the sandbox container/handle. For a `Sandbox` returned by
     * top-level `createSandbox()`, this also removes the worktree (or
     * preserves it, reported via `CloseResult`, if it has uncommitted
     * changes). For a `Sandbox` returned by `Worktree.attachSandbox()`, the
     * worktree is owned by that `Worktree` — this call leaves it in place;
     * call the owning `Worktree.close()` to remove it.
     */
    close(): Promise<CloseResult>;
    /** Auto teardown via `await using`. */
    [Symbol.asyncDispose](): Promise<void>;
}
/** Options accepted by `Sandbox.exec()`. Mirrors the provider handle's `exec` options. */
interface SandboxExecOptions {
    /** Per-line stdout callback for streaming output. */
    readonly onLine?: (line: string) => void;
    /** Working directory for the command. Defaults to the sandbox repo path. */
    readonly cwd?: string;
    /** Run the command with sudo, when the provider supports it. */
    readonly sudo?: boolean;
    /** Stdin payload — piped to the child process and then closed. Avoids the Linux 128 KB per-arg limit. */
    readonly stdin?: string;
}

/**
 * `createSandbox()` and `createSandboxFromWorktree()` — build a long-lived
 * `Sandbox` handle. Types live in `./Sandbox.ts`, the handle's methods in
 * `./sandboxHandle.ts`, and the shared start/ready-hook steps in
 * `application/sandbox/worktree/worktreeSandbox.ts`.
 */

/**
 * Eagerly creates a git worktree on the provided explicit branch and starts
 * a sandbox with the worktree bind-mounted. Returns a `Sandbox` handle whose
 * `.runAgent()` / `.interactive()` methods can be called repeatedly against
 * it — distinct from the top-level `run()`, which creates and tears down its
 * own worktree within a single call. For a sandbox backed by a worktree you
 * already made with `createWorktree()`, use `Worktree.attachSandbox()`
 * instead.
 */
declare const createSandbox: (options: CreateSandboxOptions) => Promise<Sandbox>;

/** Branch strategies valid for createWorktree — head is excluded. */
type WorktreeBranchStrategy = MergeToHeadBranchStrategy | NamedBranchStrategy;
interface CreateWorktreeOptions {
    /** Branch strategy — only 'branch' and 'merge-to-head' are allowed. */
    readonly branchStrategy: WorktreeBranchStrategy;
    /**
     * Host repo directory. Replaces `process.cwd()` as the anchor for
     * `.arsenal/worktrees/`, `.arsenal/.env`, and git operations.
     *
     * - Relative paths are resolved against `process.cwd()`.
     * - Absolute paths are used as-is.
     * - Defaults to `process.cwd()` when omitted.
     */
    readonly cwd?: string;
    /** Paths relative to the host repo root to copy into the worktree at creation time. */
    readonly copyToWorktree?: string[];
    /** Lifecycle hooks grouped by execution location (host or sandbox).
     *  Only `host.onWorktreeReady` is executed here — other hooks are passed
     *  through to whichever of the returned `Worktree`'s `.runAgent()` or
     *  `.attachSandbox()` calls you make afterward. */
    readonly hooks?: SandboxHooks;
    /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
    readonly timeouts?: Timeouts;
}
interface WorktreeRunOptions {
    /** Agent provider to use (e.g. bob("default")) */
    readonly agent: AgentProvider;
    /** Sandbox provider (e.g. docker()). Required — an unattended agent should always run inside a sandbox. */
    readonly sandbox: SandboxProvider;
    /** Inline prompt string (mutually exclusive with promptFile). */
    readonly prompt?: string;
    /** Path to a prompt file (mutually exclusive with prompt). */
    readonly promptFile?: string;
    /** Key-value map for {{KEY}} placeholder substitution in prompts */
    readonly promptArgs?: PromptArgs;
    /** Maximum iterations to run (default: 1). */
    readonly maxIterations?: number;
    /** Substring(s) the agent emits to stop the iteration loop early. */
    readonly completionSignal?: string | string[];
    /** Idle timeout in seconds. Default: 600. */
    readonly idleTimeoutSeconds?: number;
    /** Grace window in seconds after a completion signal is observed but the agent process has not exited — e.g. a spawned `gh`/git subprocess or long-lived MCP server inherited the exec's stdout pipe and is keeping it open. Default: 60. */
    readonly completionTimeoutSeconds?: number;
    /** Optional name for the run. */
    readonly name?: string;
    /** Logging mode. */
    readonly logging?: LoggingOption;
    /** Hooks to run during sandbox lifecycle */
    readonly hooks?: SandboxHooks;
    /** Environment variables to inject into the sandbox. */
    readonly env?: Record<string, string>;
    /**
     * Number of additional attempts per iteration when the agent fails with an
     * agent error or idle timeout. Each retry spins up a completely fresh
     * sandbox. Default: 0 (no retries — fail immediately on first error). See
     * `OrchestrateOptions.iterationRetries` for full semantics.
     */
    readonly iterationRetries?: number;
    /**
     * An `AbortSignal` that cancels the run when aborted.
     *
     * - If `signal.aborted` is already `true` at entry, rejects immediately
     *   without doing any setup work.
     * - Aborting mid-iteration kills the in-flight agent subprocess.
     * - The worktree is preserved on disk after abort.
     * - The `Worktree` handle remains usable for subsequent operations.
     */
    readonly signal?: AbortSignal;
}
interface WorktreeRunResult {
    /** Per-iteration results (use `iterations.length` for the count). */
    readonly iterations: IterationResult[];
    /** The matched completion signal string, or undefined if none fired. */
    readonly completionSignal?: string;
    /** Combined stdout output from all agent iterations. */
    readonly stdout: string;
    /** List of commits made by the agent during the run. */
    readonly commits: {
        sha: string;
    }[];
    /** The branch name the agent worked on. */
    readonly branch: string;
    /** Path to the log file, if logging was drained to a file. */
    readonly logFilePath?: string;
}
interface WorktreeCreateSandboxOptions {
    /** Sandbox provider (e.g. docker({ imageName: "arsenal:myrepo" })). */
    readonly sandbox: SandboxProvider;
    /** Lifecycle hooks grouped by execution location (host or sandbox). */
    readonly hooks?: SandboxHooks;
    /** Paths relative to the host repo root to copy into the worktree at creation time. */
    readonly copyToWorktree?: string[];
    /** Override default timeouts for built-in lifecycle steps. Unset keys keep their defaults. */
    readonly timeouts?: Timeouts;
}
interface Worktree {
    /** The branch the worktree is on. */
    readonly branch: string;
    /** Host path to the worktree (worktree). */
    readonly worktreePath: string;
    /**
     * Run an agent inside *this* worktree — reuses the branch/worktree
     * `createWorktree()` already created here; never creates or removes a
     * worktree itself (unlike the top-level `run()`, which owns its own
     * worktree end-to-end for a single call). Safe to call repeatedly; only
     * `.close()` tears the worktree down. Named `runAgent` (not `run`)
     * precisely so it can't be confused with the top-level `run()`.
     */
    runAgent(options: WorktreeRunOptions): Promise<WorktreeRunResult>;
    /**
     * Attach a long-lived `Sandbox` to this existing worktree — reuse
     * semantics, same as `.runAgent()` above: no new worktree is created.
     * Contrast with the top-level `createSandbox()`, which creates its own new
     * worktree on an explicit branch. Named `attachSandbox` (not
     * `createSandbox`) precisely so it can't be confused with that.
     */
    attachSandbox(options: WorktreeCreateSandboxOptions): Promise<Sandbox>;
    /** Clean up the worktree. Preserves worktree if dirty. */
    close(): Promise<CloseResult>;
    /** Auto cleanup via `await using`. */
    [Symbol.asyncDispose](): Promise<void>;
}
/**
 * Creates a git worktree as an independent, first-class worktree.
 * Returns a Worktree handle with close() and [Symbol.asyncDispose]().
 *
 * Only accepts 'branch' and 'merge-to-head' strategies — 'head' is a
 * compile-time type error since head means no worktree.
 */
declare const createWorktree: (options: CreateWorktreeOptions) => Promise<Worktree>;

interface CwdErrorConstructor {
    new (args: {
        readonly message: string;
        readonly cwd: string;
    }): CwdError;
    readonly prototype: CwdError;
}
/**
 * The provided `cwd` path does not exist or is not a directory.
 *
 * Public-facing type for `CwdError`. The runtime class is the same
 * `Data.TaggedError` from `errors.ts`, but we re-declare its public
 * shape here as a plain `Error` subclass so that Effect's type machinery
 * does not leak into Arsenal's published `.d.ts` files.
 */
interface CwdError extends Error {
    readonly _tag: "CwdError";
    readonly message: string;
    readonly cwd: string;
}
/** The provided `cwd` path does not exist or is not a directory. */
declare const CwdError: CwdErrorConstructor;

export { type AgentExecutor, AgentProvider, AgentSession, type AgentSessionOptions, type AgentStreamEvent, BranchStrategy, type CloseResult, type CreateSandboxOptions, type CreateWorktreeOptions, CwdError, ExecResult, InteractiveExecOptions, type InvokeAgentOptions, type InvokeAgentResult, type IterateOptions, type IterationOutcome, type IterationResult, IterationUsage, type LoggingOption, MergeToHeadBranchStrategy, type MountConfig, NamedBranchStrategy, Output, type OutputDefinition, type OutputObjectDefinition, type OutputStringDefinition, type PersistentAcpSession, type PromptArgs, type RunOptions, type RunResult, type Sandbox, type SandboxCommands, type SandboxExecOptions, type SandboxHooks, type SandboxInteractiveOptions, type SandboxInteractiveResult, SandboxProvider, type SandboxRunOptions, type SandboxRunResult, StructuredOutputError, type Timeouts, type WithHooksOptions, type WithWorktreeOptions, type WithWorktreeResult, type Worktree, type WorktreeBranchStrategy, type WorktreeContext, type WorktreeCreateSandboxOptions, type WorktreeRunOptions, type WorktreeRunResult, createSandbox, createWorktree, invokeAgent, iterate, localExecutor, matchCompletionSignal, run, sandboxExecutor, withHooks, withWorktree };
