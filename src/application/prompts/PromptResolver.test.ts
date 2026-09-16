import type { FileSystem } from "@effect/platform";
import { Effect } from "effect";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolvePrompt } from "./PromptResolver.js";
import { PromptError } from "../../errors/errors.js";
import { layer as NodeFileSystem } from "../../platform/node/nodeFileSystem.js";

const run = <A, E>(effect: Effect.Effect<A, E, FileSystem.FileSystem>) =>
  Effect.runPromise(effect.pipe(Effect.provide(NodeFileSystem)));

describe("PromptResolver", () => {
  it("returns inline prompt when prompt is provided", async () => {
    const result = await run(resolvePrompt({ prompt: "do some work" }));
    expect(result).toEqual({ text: "do some work", source: "inline" });
  });

  it("reads prompt from promptFile when provided", async () => {
    const dir = await mkdtemp(join(tmpdir(), "prompt-resolver-"));
    const promptPath = join(dir, "custom-prompt.md");
    await writeFile(promptPath, "prompt from file");

    const result = await run(resolvePrompt({ promptFile: promptPath }));
    expect(result).toEqual({ text: "prompt from file", source: "template" });
  });

  it("errors when both prompt and promptFile are provided", async () => {
    const error = await run(
      resolvePrompt({ prompt: "inline", promptFile: "/some/file.md" }).pipe(
        Effect.flip,
      ),
    );
    expect(error).toBeInstanceOf(PromptError);
    expect(error.message).toContain("both");
  });

  it("errors when neither prompt nor promptFile is provided", async () => {
    const error = await run(resolvePrompt({}).pipe(Effect.flip));
    expect(error).toBeInstanceOf(PromptError);
    expect(error.message).toContain("prompt");
  });
});
