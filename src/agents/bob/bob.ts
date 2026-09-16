import { parseAcpUpdate } from "../../application/acp/parseAcpUpdate.js";
import type {
  AgentProvider,
  ParsedStreamEvent,
} from "../../spi/AgentProvider.js";

/** Options for the Bob-Shell agent provider. */
export interface BobOptions {
  /** Environment variables injected by this agent provider. */
  readonly env?: Record<string, string>;
  /** Path to the `bob` binary. Defaults to `"bob"` (resolved from PATH). */
  readonly bobPath?: string;
  /** Pass `--auto-approve`: approve every tool call silently, ignoring settings.json. CI use. */
  readonly autoApprove?: boolean;
  /** Pass `--log-level`. */
  readonly logLevel?: "debug" | "info" | "warn" | "error" | "silent";
  /**
   * Bob-Shell mode to use. Overrides the positional `model` argument.
   *
   * Not supported by `bob acp` — any value other than `"default"` throws.
   */
  readonly model?: string;
  /** Not supported by `bob acp` — setting it throws. */
  readonly maxTurns?: number;
  /** Not supported by `bob acp` — setting it throws. */
  readonly maxCost?: number;
  /** Not supported by `bob acp` — setting a non-empty list throws. */
  readonly disableToolGroups?: string[];
  /** Disable MCP tools. */
  readonly disableMcp?: boolean;
  /** Disable subagent spawning. */
  readonly disableSubagents?: boolean;
  /** Not supported by `bob acp` — setting it throws. The workspace is the `cwd` Arsenal runs the agent in. */
  readonly workspace?: string;
  /** Pass trust flag to bob. Defaults to `true`. */
  readonly trust?: boolean;
  /** Pass accept-license flag to bob. Defaults to `true`. */
  readonly acceptLicense?: boolean;
}

/**
 * Throw if `options` asks for something `bob acp` has no flag for. Bob Shell
 * 2.x rejects unknown options at startup ("unknown option '--max-turns'"),
 * which would otherwise surface much later as an opaque "ACP connection closed".
 */
const assertAcpSupported = (
  resolvedModel: string,
  options: BobOptions | undefined,
): void => {
  const unsupported: string[] = [];
  if (resolvedModel && resolvedModel !== "default") {
    unsupported.push(`model "${resolvedModel}"`);
  }
  if (options?.maxTurns !== undefined) unsupported.push("maxTurns");
  if (options?.maxCost !== undefined) unsupported.push("maxCost");
  if (options?.disableToolGroups && options.disableToolGroups.length > 0) {
    unsupported.push("disableToolGroups");
  }
  if (options?.workspace !== undefined) unsupported.push("workspace");
  if (unsupported.length > 0) {
    throw new Error(
      `bob(): ${unsupported.join(", ")} not supported by \`bob acp\`. ` +
        `Supported options: env, bobPath, autoApprove, logLevel, disableMcp, ` +
        `disableSubagents, trust, acceptLicense; pass "default" as the model.`,
    );
  }
};

/**
 * Bob-Shell agent provider for Arsenal.
 *
 * Runs autonomous coding tasks in isolated sandbox environments using Bob over ACP.
 *
 * @example
 * ```typescript
 * import { run, bob, noSandbox } from "@arsenallab/arsenal-light";
 *
 * await run({
 *   agent: bob("default"),
 *   sandbox: noSandbox(),
 *   prompt: "Fix the issues in this repository",
 *   maxIterations: 5,
 * });
 * ```
 */
export const bob = (model: string, options?: BobOptions): AgentProvider => {
  const resolvedModel = options?.model ?? model;
  assertAcpSupported(resolvedModel, options);
  const trust = options?.trust ?? true;
  const acceptLicense = options?.acceptLicense ?? true;

  /**
   * Maps toolCallId → human-readable name for result attribution within a
   * prompt turn. `bob()` is typically constructed once and reused across many
   * turns (`iterate()`, `Sandbox.runAgent()`, ...); `parseAcpUpdate` requires
   * this map to be cleared between turns to avoid resolving a `tool_call_update`
   * against a stale name left over from an earlier, unrelated turn. In spawn
   * mode `buildAcpArgs()` runs exactly once per turn (see `runAcpSession.ts`),
   * so it doubles as the turn-boundary hook that clears this map.
   */
  const toolCallNames = new Map<string, string>();

  return {
    name: "bob",
    env: options?.env ?? {},

    /**
     * Build argv to launch Bob Shell as an ACP server (local stdio transport).
     * The process speaks JSON-RPC 2.0 on stdin/stdout; Arsenal drives it as an
     * ACP client: initialize → session/new → session/prompt → session/update
     * notifications → session/prompt response with stop reason.
     */
    buildAcpArgs(): string[] {
      // Runs once per turn in spawn mode — reset tool-call correlation state
      // for the new turn (see the toolCallNames comment above).
      toolCallNames.clear();

      const args = [options?.bobPath ?? "bob", "acp"];
      if (options?.autoApprove) {
        args.push("--auto-approve");
      }
      if (options?.disableMcp) {
        args.push("--disable-mcp");
      }
      if (options?.disableSubagents) {
        args.push("--disable-subagents");
      }
      if (trust) {
        args.push("--trust");
      }
      if (acceptLicense) {
        args.push("--accept-license");
      }
      if (options?.logLevel) {
        args.push("--log-level", options.logLevel);
      }
      return args;
    },

    /**
     * Translate one ACP `session/update` notification params object into
     * `ParsedStreamEvent`s.
     */
    parseAcpUpdate(update: unknown): ParsedStreamEvent[] {
      return parseAcpUpdate(update, toolCallNames);
    },
  };
};
