/** Public API entry point — re-exports `run()`, sandbox providers, agent providers, and all public types. */

export { run } from "./composition/presets/run.js";

// ---------------------------------------------------------------------------
// Composable primitives — use these to hand-roll your own orchestration.
// Each layer is independent and opt-in:
//
//   invokeAgent()  — one agent turn (transport, abort, idle timeout)
//   withWorktree() — git branch isolation around a callback
//   withHooks()    — lifecycle hooks around a callback
//   iterate()      — multi-iteration loop with retry
//
// run(), createSandbox(), and createWorktree() are presets built on their own
// internal orchestrator (see application/orchestration/Orchestrator.ts) — not on these
// primitives. Reach for a primitive when a preset doesn't fit; reach for a
// preset otherwise.
// ---------------------------------------------------------------------------
export { invokeAgent } from "./composition/primitives/invokeAgent.js";
export type {
  InvokeAgentOptions,
  InvokeAgentResult,
} from "./composition/primitives/invokeAgent.js";
export { localExecutor } from "./platform/node/localExecutor.js";
export type { AgentExecutor } from "./ports/AgentExecutor.js";
export { sandboxExecutor } from "./ports/SandboxOps.js";
export type { SandboxCommands } from "./ports/SandboxOps.js";

export { withWorktree } from "./composition/primitives/withWorktree.js";
export type {
  WithWorktreeOptions,
  WithWorktreeResult,
  WorktreeContext,
} from "./composition/primitives/withWorktree.js";

export { withHooks } from "./composition/primitives/withHooks.js";
export type { WithHooksOptions } from "./composition/primitives/withHooks.js";

export { iterate } from "./composition/primitives/iterate.js";
export type {
  IterateOptions,
  IterationOutcome,
} from "./composition/primitives/iterate.js";
export { noSandbox } from "./sandboxes/no-sandbox/no-sandbox.js";
export {
  BobAcpSession,
  interactivePermissionHandler,
} from "./agents/bob/bobAcp.js";
export type {
  BobAcpOptions,
  AcpSessionEvent,
  AcpTextChunk,
  AcpPermissionRequest,
} from "./agents/bob/bobAcp.js";
export { AgentSession } from "./platform/node/AgentSession.js";
export type { AgentSessionOptions } from "./platform/node/AgentSession.js";
export type { PersistentAcpSession } from "./application/acp/runAcpSession.js";
export type { NoSandboxOptions } from "./sandboxes/no-sandbox/no-sandbox.js";
export type {
  RunOptions,
  RunResult,
  IterationResult,
  IterationUsage,
} from "./composition/presets/run.js";
export type { LoggingOption } from "./application/orchestration/RunConfig.js";
export { matchCompletionSignal } from "./application/orchestration/completionSignal.js";
export { createSandbox } from "./composition/presets/createSandbox.js";
export type {
  CreateSandboxOptions,
  Sandbox,
  SandboxRunOptions,
  SandboxRunResult,
  SandboxInteractiveOptions,
  SandboxInteractiveResult,
  SandboxExecOptions,
  CloseResult,
} from "./composition/presets/Sandbox.js";
export { createWorktree } from "./composition/presets/createWorktree.js";
export type {
  CreateWorktreeOptions,
  Worktree,
  WorktreeBranchStrategy,
  WorktreeRunOptions,
  WorktreeRunResult,
  WorktreeCreateSandboxOptions,
} from "./composition/presets/createWorktree.js";
export type { PromptArgs } from "./application/prompts/PromptArgumentSubstitution.js";
export type { AgentStreamEvent } from "./application/display/AgentStreamEmitter.js";
export type { SandboxHooks, Timeouts } from "./ports/lifecycleConfig.js";
export type { MountConfig } from "./application/sandbox/mounts/MountConfig.js";
export {
  Output,
  StructuredOutputError,
} from "./application/prompts/StructuredOutput.js";
export type {
  OutputDefinition,
  OutputObjectDefinition,
  OutputStringDefinition,
} from "./application/prompts/StructuredOutput.js";
export { CwdError } from "./errors/CwdError.js";
export { bob } from "./agents/bob/bob.js";
export type { BobOptions } from "./agents/bob/bob.js";
export type { AgentProvider, ParsedStreamEvent } from "./spi/AgentProvider.js";
export {
  createBindMountSandboxProvider,
  createIsolatedSandboxProvider,
} from "./spi/SandboxProvider.js";
export type {
  SandboxProvider,
  AnySandboxProvider,
  BindMountSandboxProvider,
  IsolatedSandboxProvider,
  NoSandboxProvider,
  SandboxHandle,
  InteractiveExecOptions,
  ExecResult,
  BindMountCreateOptions,
  BindMountSandboxProviderConfig,
  IsolatedCreateOptions,
  IsolatedSandboxProviderConfig,
  BranchStrategy,
  BindMountBranchStrategy,
  IsolatedBranchStrategy,
  NoSandboxBranchStrategy,
  HeadBranchStrategy,
  MergeToHeadBranchStrategy,
  NamedBranchStrategy,
} from "./spi/SandboxProvider.js";
