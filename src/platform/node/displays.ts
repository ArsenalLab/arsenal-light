/**
 * Display implementations: silent (in-memory, for tests and quiet modes),
 * log file, and terminal (Clack).
 */

import * as clack from "@clack/prompts";
import { FileSystem } from "@effect/platform";
import { appendFileSync } from "node:fs";
import { dirname } from "node:path";
import { styleText } from "node:util";
import { Effect, Layer, Ref } from "effect";
import {
  Display,
  type DisplayEntry,
  type Severity,
} from "../../ports/Display.js";

export const SilentDisplay = {
  layer: (ref: Ref.Ref<ReadonlyArray<DisplayEntry>>): Layer.Layer<Display> =>
    Layer.succeed(Display, {
      intro: (title) =>
        Ref.update(ref, (entries) => [
          ...entries,
          { _tag: "intro" as const, title },
        ]),

      status: (message, severity) =>
        Ref.update(ref, (entries) => [
          ...entries,
          { _tag: "status" as const, message, severity },
        ]),

      spinner: (message, effect) =>
        Effect.flatMap(
          Ref.update(ref, (entries) => [
            ...entries,
            { _tag: "spinner" as const, message },
          ]),
          () => effect,
        ),

      summary: (title, rows) =>
        Ref.update(ref, (entries) => [
          ...entries,
          { _tag: "summary" as const, title, rows },
        ]),

      taskLog: (title, effect) => {
        const messages: string[] = [];
        return Effect.flatMap(
          effect((msg) => messages.push(msg)),
          (result) =>
            Effect.map(
              Ref.update(ref, (entries) => [
                ...entries,
                {
                  _tag: "taskLog" as const,
                  title,
                  messages: [...messages],
                },
              ]),
              () => result,
            ),
        );
      },

      alert: (message) =>
        Effect.zipRight(
          Effect.sync(() => writeStderr(message)),
          Ref.update(ref, (entries) => [
            ...entries,
            { _tag: "alert" as const, message },
          ]),
        ),

      text: (message) =>
        Ref.update(ref, (entries) => [
          ...entries,
          { _tag: "text" as const, message },
        ]),

      textChunk: (chunk) =>
        Ref.update(ref, (entries) => [
          ...entries,
          { _tag: "textChunk" as const, message: chunk },
        ]),

      toolCall: (name, formattedArgs) =>
        Ref.update(ref, (entries) => [
          ...entries,
          { _tag: "toolCall" as const, name, formattedArgs },
        ]),
    }),
};

export const FileDisplay = {
  layer: (
    filePath: string,
  ): Layer.Layer<Display, never, FileSystem.FileSystem> =>
    Layer.effect(
      Display,
      Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        yield* fs
          .makeDirectory(dirname(filePath), { recursive: true })
          .pipe(Effect.orDie);
        const delimiter = `\n--- Run started: ${new Date().toISOString()} ---\n`;
        yield* fs
          .writeFileString(filePath, delimiter, { flag: "a" })
          .pipe(Effect.orDie);

        // Tracks whether the last write left the cursor mid-line (a raw chunk
        // with no trailing newline). Line-oriented entries consult this so they
        // always begin on a fresh line, keeping structured output (tool calls,
        // status, context-window summaries) off the tail of streamed prose.
        let midLine = false;

        // Log appends are synchronous, and deliberately so. Callers fire
        // these effects without awaiting them (see the text-delta buffer in
        // Orchestrator.ts), so an async append lets concurrent writes complete
        // out of order: the log then shows the agent's output interleaved and
        // scrambled, and `midLine` — mutated by every write — desyncs as well.
        // A scrambled log is worse than no log, because it is read as evidence.
        // Sync appends also keep this writer ordered against the verbose
        // raw-line sink in runOutput.ts (shared by `run`, `createSandbox`, and
        // `createWorktree`), which appends to the same file the same way.
        const appendSync = (text: string): void => {
          try {
            appendFileSync(filePath, text);
          } catch {
            // Swallow — logging must never take the run down.
          }
        };

        const appendToLog = (line: string): Effect.Effect<void> =>
          Effect.sync(() => {
            const prefix = midLine ? "\n" : "";
            midLine = false;
            appendSync(`${prefix}${line}\n`);
          });

        const appendRaw = (chunk: string): Effect.Effect<void> =>
          Effect.sync(() => {
            if (chunk.length === 0) return;
            midLine = !chunk.endsWith("\n");
            appendSync(chunk);
          });

        return {
          intro: () => Effect.void,

          status: (message, _severity) =>
            appendToLog(message.replace(/^\[[^\]]+\] /, "")),

          spinner: (message, effect) =>
            Effect.gen(function* () {
              yield* appendToLog(`${message}...`);
              const start = Date.now();
              const result = yield* effect;
              const elapsed = ((Date.now() - start) / 1000).toFixed(1);
              yield* appendToLog(`${message} done (${elapsed}s)`);
              return result;
            }),

          summary: (title, rows) => {
            const lines = Object.entries(rows)
              .map(([key, value]) => `  ${key}: ${value}`)
              .join("\n");
            return appendToLog(`${title}\n${lines}`);
          },

          taskLog: (title, effect) =>
            Effect.gen(function* () {
              yield* appendToLog(title);
              const start = Date.now();
              const messages: string[] = [];
              const result = yield* effect((msg) => {
                messages.push(msg);
              });
              const elapsed = ((Date.now() - start) / 1000).toFixed(1);
              for (const msg of messages) {
                yield* appendToLog(`  ${msg}`);
              }
              yield* appendToLog(`${title} done (${elapsed}s)`);
              return result;
            }),

          alert: (message) =>
            Effect.zipRight(
              Effect.sync(() => writeStderr(message)),
              appendToLog(message),
            ),

          text: (message) => appendToLog(message),

          textChunk: (chunk) => appendRaw(chunk),

          toolCall: (name, formattedArgs) =>
            appendToLog(`${name}(${formattedArgs})`),
        };
      }),
    ),
};

const writeStderr = (message: string): void => {
  console.error(message);
};

const severityToClack: Record<Severity, (message: string) => void> = {
  info: clack.log.info,
  success: clack.log.success,
  warn: clack.log.warning,
  error: clack.log.error,
};

export const terminalStyle = {
  status: (message: string): string => styleText("bold", message),
  summaryTitle: (title: string): string => styleText("bold", title),
  summaryRow: (key: string, value: string): string =>
    `${styleText("bold", key)}: ${styleText("dim", value)}`,
  toolCall: (text: string): string => styleText("dim", text),
};

export const ClackDisplay = {
  layer: Layer.succeed(Display, {
    intro: (title) =>
      Effect.sync(() => clack.intro(styleText("inverse", ` ${title} `))),

    status: (message, severity) =>
      Effect.sync(() =>
        severityToClack[severity](terminalStyle.status(message)),
      ),

    spinner: (message, effect) =>
      Effect.acquireUseRelease(
        Effect.sync(() => {
          const s = clack.spinner();
          s.start(message);
          return s;
        }),
        () => effect,
        (s, exit) =>
          Effect.sync(() => {
            if (exit._tag === "Success") {
              s.stop(message);
            } else {
              s.stop(`${message} (failed)`);
            }
          }),
      ),

    summary: (title, rows) =>
      Effect.sync(() => {
        const lines = Object.entries(rows)
          .map(([key, value]) => terminalStyle.summaryRow(key, value))
          .join("\n");
        clack.note(lines, terminalStyle.summaryTitle(title));
      }),

    taskLog: (title, effect) =>
      Effect.acquireUseRelease(
        Effect.sync(() => clack.taskLog({ title })),
        (log) => effect((msg) => log.message(msg)),
        (log, exit) =>
          Effect.sync(() => {
            if (exit._tag === "Success") {
              log.success(title, { showLog: true });
            } else {
              log.error(title, { showLog: true });
            }
          }),
      ),

    alert: (message) => Effect.sync(() => writeStderr(message)),

    text: (message) => Effect.sync(() => clack.log.message(message)),

    textChunk: (chunk) => Effect.sync(() => clack.log.message(chunk)),

    toolCall: (name, formattedArgs) =>
      Effect.sync(() =>
        clack.log.step(terminalStyle.toolCall(`${name}(${formattedArgs})`)),
      ),
  }),
};
