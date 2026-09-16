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

import { Effect } from "effect";
import { CopyError, ExecError } from "../errors/errors.js";
import type {
  InteractiveExecOptions,
  SandboxHandle,
} from "../spi/SandboxProvider.js";
import type { ExecResult } from "../spi/types.js";
import { runPromiseUnwrapped } from "./runEffect.js";
import type { AgentExecutor } from "./AgentExecutor.js";

export type { ExecResult };

export interface SandboxOps {
  readonly exec: (
    command: string,
    options?: {
      onLine?: (line: string) => void;
      cwd?: string;
      sudo?: boolean;
      stdin?: string;
    },
  ) => Effect.Effect<ExecResult, ExecError>;

  /**
   * Launch an interactive process inside the sandbox (ACP transport).
   * Present only when the underlying SandboxHandle implements it.
   */
  readonly interactiveExec?: (
    args: string[],
    options: InteractiveExecOptions,
  ) => Promise<{ exitCode: number }>;

  /** Copy a file or directory from the host into the sandbox. */
  readonly copyIn: (
    hostPath: string,
    sandboxPath: string,
  ) => Effect.Effect<void, CopyError>;

  /** Copy a single file from the sandbox to the host. */
  readonly copyFileOut: (
    sandboxPath: string,
    hostPath: string,
  ) => Effect.Effect<void, CopyError>;
}

/**
 * Promise-based commands against a running sandbox — the public counterpart
 * of the internal Effect-based `SandboxOps`, handed to `withWorktree`
 * callbacks as `ctx.sandbox` and accepted by `withHooks`.
 */
export interface SandboxCommands {
  /** Run a command in the sandbox. Resolves with its output and exit code (non-zero exits resolve too); rejects with `ExecError` if it can't be launched. */
  readonly exec: (
    command: string,
    options?: {
      onLine?: (line: string) => void;
      cwd?: string;
      sudo?: boolean;
      stdin?: string;
    },
  ) => Promise<ExecResult>;
  /** Launch an interactive process inside the sandbox (ACP transport), when supported. */
  readonly interactiveExec?: (
    args: string[],
    options: InteractiveExecOptions,
  ) => Promise<{ exitCode: number }>;
  /** Copy a file or directory from the host into the sandbox. Rejects with `CopyError`. */
  readonly copyIn: (hostPath: string, sandboxPath: string) => Promise<void>;
  /** Copy a single file from the sandbox to the host. Rejects with `CopyError`. */
  readonly copyFileOut: (
    sandboxPath: string,
    hostPath: string,
  ) => Promise<void>;
}

/** Expose an internal `SandboxOps` through the public Promise-based `SandboxCommands`. */
export const toSandboxCommands = (sandbox: SandboxOps): SandboxCommands => ({
  exec: (command, options) =>
    runPromiseUnwrapped(sandbox.exec(command, options)),
  ...(sandbox.interactiveExec
    ? { interactiveExec: sandbox.interactiveExec }
    : {}),
  copyIn: (hostPath, sandboxPath) =>
    runPromiseUnwrapped(sandbox.copyIn(hostPath, sandboxPath)),
  copyFileOut: (sandboxPath, hostPath) =>
    runPromiseUnwrapped(sandbox.copyFileOut(sandboxPath, hostPath)),
});

const toError = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Adapt caller-supplied `SandboxCommands` to the internal `SandboxOps`. */
export const fromSandboxCommands = (commands: SandboxCommands): SandboxOps => ({
  exec: (command, options) =>
    Effect.tryPromise({
      try: () => commands.exec(command, options),
      catch: (e) =>
        e instanceof ExecError
          ? e
          : new ExecError({ command, message: `exec failed: ${toError(e)}` }),
    }),
  ...(commands.interactiveExec
    ? { interactiveExec: commands.interactiveExec }
    : {}),
  copyIn: (hostPath, sandboxPath) =>
    Effect.tryPromise({
      try: () => commands.copyIn(hostPath, sandboxPath),
      catch: (e) =>
        e instanceof CopyError
          ? e
          : new CopyError({ message: `copyIn failed: ${toError(e)}` }),
    }),
  copyFileOut: (sandboxPath, hostPath) =>
    Effect.tryPromise({
      try: () => commands.copyFileOut(sandboxPath, hostPath),
      catch: (e) =>
        e instanceof CopyError
          ? e
          : new CopyError({ message: `copyFileOut failed: ${toError(e)}` }),
    }),
});

/**
 * Wrap `SandboxCommands` into an `AgentExecutor` for `invokeAgent`.
 * Inside `withWorktree`, `ctx.executor` already is one.
 */
export const sandboxExecutor = (sandbox: SandboxCommands): AgentExecutor => ({
  exec: sandbox.exec,
  ...(sandbox.interactiveExec
    ? { interactiveExec: sandbox.interactiveExec }
    : {}),
});

/**
 * Wrap a Promise-based sandbox handle into an Effect-based SandboxOps.
 * Delegates copyIn/copyFileOut to `handle.transfer` when present — absent
 * for bind-mount and no-sandbox handles, whose filesystem is already shared
 * with the host, so both resolve to a clear failure instead of duck-typing
 * on which methods happen to exist.
 */
export const makeSandboxFromHandle = (handle: SandboxHandle): SandboxOps => ({
  ...(handle.interactiveExec
    ? { interactiveExec: handle.interactiveExec.bind(handle) }
    : {}),
  exec: (command, options) =>
    Effect.tryPromise({
      try: () => handle.exec(command, options),
      catch: (e) =>
        new ExecError({
          command,
          message: `exec failed: ${e instanceof Error ? e.message : String(e)}`,
        }),
    }),
  copyIn: (hostPath, sandboxPath) =>
    handle.transfer
      ? Effect.tryPromise({
          try: () => handle.transfer!.copyIn(hostPath, sandboxPath),
          catch: (e) =>
            new CopyError({
              message: `copyIn failed: ${e instanceof Error ? e.message : String(e)}`,
            }),
        })
      : Effect.fail(
          new CopyError({
            message: "copyIn is not supported for this sandbox provider",
          }),
        ),
  copyFileOut: (sandboxPath, hostPath) =>
    handle.transfer
      ? Effect.tryPromise({
          try: () => handle.transfer!.copyFileOut(sandboxPath, hostPath),
          catch: (e) =>
            new CopyError({
              message: `copyFileOut failed: ${e instanceof Error ? e.message : String(e)}`,
            }),
        })
      : Effect.fail(
          new CopyError({
            message: "copyFileOut is not supported for this sandbox provider",
          }),
        ),
});

/** Run `command` in `sandbox`, failing with `ExecError` on a non-zero exit. */
export const execOk = (
  sandbox: SandboxOps,
  command: string,
  options?: { cwd?: string; sudo?: boolean },
): Effect.Effect<ExecResult, ExecError> =>
  Effect.flatMap(sandbox.exec(command, options), (result) =>
    result.exitCode !== 0
      ? Effect.fail(
          new ExecError({
            command,
            exitCode: result.exitCode,
            message: `Command failed (exit ${result.exitCode}): ${command}\n${result.stderr}`,
          }),
        )
      : Effect.succeed(result),
  );
