import type { SandboxError } from "./errors.js";

/**
 * Formats a tagged SandboxError into a user-friendly message with
 * context-specific hints about what went wrong and how to recover.
 */
export const formatErrorMessage = (error: SandboxError): string => {
  switch (error._tag) {
    case "ExecError":
      return `Command failed in sandbox (${error.command}): ${error.message}`;
    case "ExecHostError":
      return `Command failed on host (${error.command}): ${error.message}`;
    case "CopyError":
      return `File copy failed: ${error.message}`;
    case "DockerError":
      return `Docker operation failed: ${error.message}. Is Docker running?`;
    case "PodmanError":
      return `Podman operation failed: ${error.message}. Is Podman running?`;
    case "SyncError":
      return `Git sync failed: ${error.message}`;
    case "WorktreeError":
      return `Git worktree operation failed: ${error.message}`;
    case "PromptError":
      return `Failed to resolve prompt: ${error.message}`;
    case "AgentError":
      return `Agent invocation failed: ${error.message}`;
    case "ConfigDirError":
      return `${error.message}`;
    case "InitError":
      return `${error.message}`;
    case "AgentIdleTimeoutError":
    case "WorktreeTimeoutError":
    case "ContainerStartTimeoutError":
    case "CopyToWorktreeTimeoutError":
    case "CopyToWorktreeError":
    case "SyncInTimeoutError":
    case "HookTimeoutError":
    case "GitSetupTimeoutError":
    case "PromptExpansionTimeoutError":
    case "CommitCollectionTimeoutError":
    case "MergeToHostTimeoutError":
    case "CwdError":
      return error.message;
  }
};
