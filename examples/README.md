# Arsenal — Examples

All examples run directly from the repo root with `npx tsx`.

## Prerequisites

Bob CLI must be installed. Create a `.env` file at the repo root with your key:

```bash
echo "BOB_API_KEY=your-key-here" > .env
```

Examples are grouped into one folder per layer (`01-invoke/`, `02-hooks/`,
... `08-run/`), matching the table below. Run any example:

```bash
npx tsx examples/01-invoke/01-invoke.ts
```

---

## How to work through these

This set is ordered like an onion: `01-invoke.ts` is the core, and every
numbered step after it adds one more concern on top of the step before it.
Run them **in order** — `01`, `02`, `03`, ... — and read each file's header
comment before running it; it says exactly what changed versus the previous
number. Lettered files (`03a`, `06b`, ...) are side quests off a numbered
layer — a feature that layer enables, not a new layer itself. You can run
those in any order once you've reached their base number.

The numbering below is a **reading order**, not a call graph — most layers
do not actually call the layer under them:

```
L0  invokeAgent()              one agent turn                            (01, 01a)
L1  withHooks()                lifecycle hooks around your own work      (02)
L2  withWorktree()             git branch isolation around your own work  (03, 03a-f)
L3  iterate()                  runs your own work N times                (04)
L4  AgentSession               persistent process, shared across calls   (05)
L5  BobAcpSession              packaged persistent session               (06, 06a-d)
L6  createWorktree()/          composition-root presets                  (07)
    createSandbox()
L7  run()                      the one-liner preset                      (08)
```

What's actually true of the source, so you don't mentally model `run()` as
`iterate(withWorktree(withHooks(invokeAgent)))`:

- **L0-L3 (`invokeAgent`, `withHooks`, `withWorktree`, `iterate`) are four
  independent, peer primitives**, not a nested stack. Each one just takes a
  `work` callback and none of them imports or calls another —
  `withHooks()` doesn't call `invokeAgent()`, `withWorktree()` doesn't call
  `withHooks()`, and `iterate()` doesn't call `withWorktree()`. Examples
  02-04 nest them by hand, in your own code, in whatever combination you
  actually need — that's the point of them being primitives you compose
  yourself rather than a fixed pipeline.
- **L5 → L4 is a real call**: `BobAcpSession` does construct an
  `AgentSession` directly (`bobAcp.ts`).
- **L6/L7 (`createWorktree()`, `createSandbox()`, `run()`) don't route
  through L0-L5 at all.** They call `orchestrate()`
  (`application/orchestration/Orchestrator.ts`), a separate Effect-space
  engine that reimplements iteration, worktree lifecycle, and hooks
  directly, alongside their own git/sandbox machinery. `iterate()`'s own
  header notes it's "a thin Promise-facing wrapper around
  `runIterationLoop` ... the same shared core `orchestrate()` ... runs
  directly in Effect-space" — `iterate` and `orchestrate` are siblings
  sharing an implementation, not caller and callee.

So read the table top-to-bottom for *what concern gets introduced next*,
not for *what calls what*. The one real dependency edge among the public
primitives is `BobAcpSession` → `AgentSession`; everything else is either a
standalone primitive you compose yourself, or a preset built on the
separate `orchestrate()` engine.

---

## Examples

### The core chain — run these in order first

| File                                     | Layer | What's added vs. the previous number                                        |
| ---------------------------------------- | ----- | --------------------------------------------------------------------------- |
| [`01-invoke/01-invoke.ts`](01-invoke/01-invoke.ts)           | L0    | Nothing below this — `invokeAgent()` alone, bare process, no sandbox/git    |
| [`02-hooks/02-hooks.ts`](02-hooks/02-hooks.ts)               | L1    | `withHooks()` — a host hook runs before the same `invokeAgent()` call       |
| [`03-worktree/03-worktree.ts`](03-worktree/03-worktree.ts)   | L2    | `withWorktree()` — git branch isolation replaces the bare executor          |
| [`04-iterate/04-iterate.ts`](04-iterate/04-iterate.ts)       | L3    | `iterate()` — the same worktree call runs multiple times, fresh each time   |
| [`05-session/05-session.ts`](05-session/05-session.ts)       | L4    | `AgentSession` — the process is now shared/persistent across iterations     |
| [`06-acp-session/06-acp-session.ts`](06-acp-session/06-acp-session.ts) | L5 | `BobAcpSession` — the same persistence, packaged as one class          |
| [`07-presets/07-presets.ts`](07-presets/07-presets.ts)       | L6    | `createWorktree()`/`Worktree.attachSandbox()` — Arsenal wires 02–04 for you |
| [`08-run/08-run.ts`](08-run/08-run.ts)                       | L7    | `run()` — the whole stack in one call, the README's Quick Start             |

### Layer 0 side quests — variations on `invokeAgent()` alone

| File                                               | What it shows                                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [`01-invoke/01a-abort.ts`](01-invoke/01a-abort.ts)                     | Cancelling `invokeAgent` mid-flight with `AbortSignal`                                                                  |
| [`01-invoke/01b-custom-provider.ts`](01-invoke/01b-custom-provider.ts) | Implementing `AgentProvider` yourself (`buildAcpArgs`/`parseAcpUpdate`) against a fake CLI — no `bob` or API key needed |

### Layer 2 side quests — variations on `withWorktree()` + `invokeAgent()`

| File                                                                   | What it shows                                                                                                                                                              |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`03-worktree/03a-options.ts`](03-worktree/03a-options.ts)                                     | `BobOptions` — `disableMcp`, `disableSubagents`, `logLevel`, per-turn usage                                                                                |
| [`03-worktree/03b-prompt-file.ts`](03-worktree/03b-prompt-file.ts)                             | Read a `.md` file and pass it as `prompt`                                                                                                                  |
| [`03-worktree/03c-prompt-template.ts`](03-worktree/03c-prompt-template.ts)                     | `{{PLACEHOLDER}}` substitution with plain string replace                                                                                                   |
| [`03-worktree/03d-structured-output.ts`](03-worktree/03d-structured-output.ts)                 | Extract and validate typed JSON from raw text by hand (contrast with `08-run.ts` Part B)                                                                   |
| [`03-worktree/03e-custom-sandbox-provider.ts`](03-worktree/03e-custom-sandbox-provider.ts)     | Implementing a bind-mount `SandboxProvider` via `createBindMountSandboxProvider()` — what a Docker/SSH/etc. integration is built from                      |
| [`03-worktree/03f-isolated-sandbox-provider.ts`](03-worktree/03f-isolated-sandbox-provider.ts) | Implementing an isolated `SandboxProvider` via `createIsolatedSandboxProvider()` — `transfer.copyIn`/`copyFileOut`, what an E2B/Daytona/cloud-VM integration is built from |

### Layer 5 side quests — variations on `BobAcpSession`

| File                                       | What it shows                                                                    |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| [`06-acp-session/06a-multi-turn.ts`](06-acp-session/06a-multi-turn.ts)   | Bob remembers previous turns across `.prompt()` calls                            |
| [`06-acp-session/06b-stream.ts`](06-acp-session/06b-stream.ts)           | `promptStream()` — per-event streaming: text, tool_call, usage, chain-of-thought |
| [`06-acp-session/06c-await-using.ts`](06-acp-session/06c-await-using.ts) | `await using` — automatic session cleanup, no try/finally needed                 |
| [`06-acp-session/06d-approvals.ts`](06-acp-session/06d-approvals.ts)     | `interactivePermissionHandler` — human-in-the-loop terminal command approvals    |

### Layer 6 side quests — variations on `createWorktree()`

| File                                              | What it shows                                                                                                                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`07-presets/07a-named-branch.ts`](07-presets/07a-named-branch.ts)     | `branchStrategy: { type: "branch" }` — commits land on an explicit, persistent branch instead of `merge-to-head`; the shape a "run agent, then open a PR" pipeline wants |
| [`07-presets/07b-create-sandbox.ts`](07-presets/07b-create-sandbox.ts) | Standalone `createSandbox()` — its own branch + worktree + sandbox in one call, no pre-existing `Worktree` needed                                                        |

### Layer 7 side quests — variations on `run()`

| File                                     | What it shows                                                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`08-run/08a-logging.ts`](08-run/08a-logging.ts)       | `logging: { type: "file" \| "stdout", onAgentStreamEvent }` — forwarding the agent's output stream to an external observability sink   |
| [`08-run/08b-resilience.ts`](08-run/08b-resilience.ts) | `idleTimeoutSeconds`, `completionTimeoutSeconds`, `timeouts`, `iterationRetries` — the knobs that matter for unattended/scheduled runs |
