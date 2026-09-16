/**
 * HostProcess — the port through which the engine runs commands on the host.
 *
 * Engine layers never import `node:child_process`; they depend on this
 * service, and the composition roots (`composition/*`) provide the Node
 * implementation from `src/platform/node/`. This keeps process execution
 * swappable and testable the same way `FileSystem` already is.
 */

import { Context, Data, type Effect } from "effect";

export interface HostCommandOptions {
  /** Working directory for the command. */
  readonly cwd?: string;
  /** Extra environment variables, layered over the host's own environment. */
  readonly env?: Readonly<Record<string, string>>;
  /** Aborting kills the command. */
  readonly signal?: AbortSignal;
  /** Largest stdout/stderr to buffer, in bytes. Defaults to the platform's own limit. */
  readonly maxBuffer?: number;
}

export interface HostCommandOutput {
  readonly stdout: string;
  readonly stderr: string;
}

/** A host command could not be started, was aborted, or exited non-zero. */
export class HostCommandError extends Data.TaggedError("HostCommandError")<{
  readonly message: string;
  readonly stdout: string;
  readonly stderr: string;
  /** Exit code when the process ran and exited non-zero; `null` otherwise. */
  readonly exitCode: number | null;
}> {}

export interface HostProcessService {
  /** Platform identifier, as in `process.platform` (e.g. `"darwin"`, `"linux"`). */
  readonly platform: string;
  /** Run `command` through the system shell. Fails on a non-zero exit. */
  readonly shell: (
    command: string,
    options?: HostCommandOptions,
  ) => Effect.Effect<HostCommandOutput, HostCommandError>;
  /** Run `file` with `args` directly, without a shell. Fails on a non-zero exit. */
  readonly run: (
    file: string,
    args: ReadonlyArray<string>,
    options?: HostCommandOptions,
  ) => Effect.Effect<HostCommandOutput, HostCommandError>;
}

export class HostProcess extends Context.Tag("HostProcess")<
  HostProcess,
  HostProcessService
>() {}
