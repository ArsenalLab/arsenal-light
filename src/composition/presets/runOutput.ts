/**
 * Run output wiring for the entry points (`run`, `createSandbox`,
 * `createWorktree`): the file-mode startup hint, choosing the Display
 * implementation, and the agent-stream / verbose raw-line sinks. These write
 * to the terminal and the filesystem, so they belong with the composition
 * roots rather than in `application/orchestration`.
 */

import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { styleText } from "node:util";
import { Layer } from "effect";
import type { Display } from "../../ports/Display.js";
import type { AgentStreamEvent } from "../../application/display/AgentStreamEmitter.js";
import type { LoggingOption } from "../../application/orchestration/RunConfig.js";
import { FileDisplay } from "../../platform/node/displays.js";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";

export interface FileDisplayStartupOptions {
  readonly logPath: string;
  readonly agentName?: string;
  readonly branch?: string;
  /** Resolved host repo directory. When it differs from `process.cwd()`, the
   *  log-file hint is printed as an absolute path so it can be pasted into any
   *  terminal. When it equals `process.cwd()` (or is omitted), a relative path
   *  is printed instead. */
  readonly hostRepoDir?: string;
}

/**
 * Print the startup message to the terminal when using file-based logging.
 * Uses styleText for lightweight bold/dim styling — does not use Clack.
 */
export const printFileDisplayStartup = (
  options: FileDisplayStartupOptions,
): void => {
  const name = options.agentName ?? "Agent";
  const label = styleText("bold", `[${name}]`);
  const branchPart = options.branch ? ` on branch ${options.branch}` : "";
  const hostRepoDir = options.hostRepoDir ?? process.cwd();
  const displayLogPath =
    hostRepoDir === process.cwd()
      ? path.relative(process.cwd(), options.logPath)
      : options.logPath;
  console.log(`${label} Started${branchPart}`);
  console.log(styleText("dim", `  tail -f ${displayLogPath}`));
};

/**
 * Build the Display layer for a run: in log-to-file mode, print the startup
 * hint and write to the log file; in terminal mode, use `stdoutLayer`.
 */
export const buildRunDisplayLayer = (
  logging: LoggingOption,
  startup: Omit<FileDisplayStartupOptions, "logPath">,
  stdoutLayer: Layer.Layer<Display>,
): Layer.Layer<Display> => {
  if (logging.type !== "file") return stdoutLayer;
  printFileDisplayStartup({ ...startup, logPath: logging.path });
  return Layer.provide(FileDisplay.layer(logging.path), NodeFileSystem);
};

/**
 * Build the agent-stream event handler for a resolved logging option.
 *
 * Composes the user-provided `onAgentStreamEvent` callback (file mode only)
 * with the verbose raw-line sink: the log file at `path` for file mode, or
 * `process.stdout` for stdout mode. Returns `undefined` when neither
 * verbose mode nor a user callback is set.
 *
 * Raw lines are written synchronously to honor the `onLine` real-time
 * contract — the debugger needs each line as soon as the agent emits it.
 *
 * @internal
 */
export const buildAgentStreamHandler = (
  logging: LoggingOption,
): ((event: AgentStreamEvent) => void) | undefined => {
  const userHandler = logging.onAgentStreamEvent;
  const verboseSink = logging.verbose
    ? buildVerboseRawLineSink(logging)
    : undefined;
  if (!userHandler && !verboseSink) return undefined;
  return (event) => {
    if (userHandler) {
      try {
        userHandler(event);
      } catch {
        // Swallow — a broken forwarder must not stop the verbose sink.
      }
    }
    if (verboseSink && event.type === "raw") {
      verboseSink(event.line);
    }
  };
};

const buildVerboseRawLineSink = (
  logging: LoggingOption,
): ((line: string) => void) => {
  if (logging.type === "file") {
    const logPath = logging.path;
    // Ensure the directory exists; the FileDisplay layer creates it for the
    // primary log file but it hasn't necessarily run by the time the first
    // raw line is flushed.
    try {
      mkdirSync(path.dirname(logPath), { recursive: true });
    } catch {
      // Swallow — appendFileSync below will surface any real I/O error.
    }
    return (line) => {
      try {
        appendFileSync(logPath, line + "\n");
      } catch {
        // Swallow — verbose-mode I/O errors must not kill the run.
      }
    };
  }
  return (line) => {
    process.stdout.write(line + "\n");
  };
};
