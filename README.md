<div align="center">
  <h1>Arsenal</h1>
</div>

## What is Arsenal?

Arsenal is a TypeScript library (`@arsenallab/arsenal-light`) for running an AI coding agent against a git repository inside a sandbox, then bringing the commits it makes back to your repo.

```typescript
import { run, bob, noSandbox } from "@arsenallab/arsenal-light";

await run({
  agent: bob("default"),
  sandbox: noSandbox(),
  promptFile: ".arsenal/prompt.md",
});
```

`run()` creates a git worktree, starts a sandbox, invokes the agent (up to `maxIterations` times, stopping early if it signals completion), and merges or collects the commits it made.

## Install

```bash
npm install --save-dev @arsenallab/arsenal-light
```

> **Not yet published to npm.** Until it is, `npm install @arsenallab/arsenal-light` will 404. To use it from a clone of this repo, build and pack it:
>
> ```bash
> npm install        # install deps
> npm run build      # bundle into dist/ (required — the tarball ships dist/, not src/)
> npm pack           # produces arsenallab-arsenal-light-<version>.tgz
> npm install ./arsenallab-arsenal-light-<version>.tgz   # in the consuming project
> ```
>
> Re-run `npm run build && npm pack` after pulling changes to pick up updates.

## Quick start

There is currently no scaffolding CLI — call the library from your own script. See [`examples/08-run/08-run.ts`](examples/08-run/08-run.ts) for the one-liner above end to end, and [`examples/README.md`](examples/README.md) for the full tour from single agent invocations up through `run()`.

```bash
npx tsx examples/08-run/08-run.ts
```

## Core pieces

- **Agent provider** (`agent` option) — builds the command that invokes an AI coding CLI and parses its output. The only one Arsenal ships is `bob`, which wraps IBM's Bob-Shell CLI. Implement the `AgentProvider` interface to add another.
- **Sandbox provider** (`sandbox` option) — creates and manages the environment the agent runs in. Built in: `noSandbox` (runs directly on the host, no isolation). `createBindMountSandboxProvider`/`createIsolatedSandboxProvider` build your own out-of-process provider (SSH, gRPC, etc.) around the `SandboxProvider` interface.
- **Branch strategy** (`branchStrategy` option) — `head` (agent writes directly into the host's working directory), `merge-to-head` (temp branch, merged back, deleted), or `branch` (an explicit named branch).
- **Iteration** — one invocation of the agent inside the sandbox. `run()` stops early once the agent's own text contains a completion signal (default `<promise>COMPLETE</promise>`).

## Development

```bash
npm install
npm run build         # bundle with tsup
npm test               # unit tests (vitest)
npm run typecheck
npm run format
```

## License
