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

import type { AgentStreamEvent } from "../display/AgentStreamEmitter.js";

/**
 * Controls where Arsenal writes iteration progress and agent output.
 * Use `"file"` (log-to-file mode) to write to a log file on disk, or
 * `"stdout"` (terminal mode) to render an interactive UI in the terminal.
 */
export type LoggingOption =
  /** Write progress and agent output to a log file at the given path (log-to-file mode). */
  | {
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
