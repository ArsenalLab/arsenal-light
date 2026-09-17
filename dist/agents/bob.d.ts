import { A as AgentProvider } from '../AgentProvider-DX1k2ouu.js';

/** Options for the Bob-Shell agent provider. */
interface BobOptions {
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
declare const bob: (model: string, options?: BobOptions) => AgentProvider;

export { type BobOptions, bob };
