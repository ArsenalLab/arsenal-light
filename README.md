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

## Getting started

**Prerequisites:** Node.js ≥18 and git on your `PATH`. Nothing else —
`arsenal init` needs no build tools itself, and network access to
github.com is only needed the moment you run it (public repo, no auth).

No clone required — this scaffolds Arsenal straight into your own project,
new or existing. Either way it needs at least one commit to resolve `HEAD`
from.

**Starting a brand-new project?**

```bash
mkdir my-project && cd my-project
git init && git commit --allow-empty -m "init"
```

**Adding it to an existing project?** Just `cd` into it — nothing above
applies if it already has history, in any language, Node or not. `arsenal
init` only adds to what's there, never overwrites:

- Has a `package.json` already? It adds `@arsenallab/arsenal-light` to its
  `devDependencies` — everything else in it untouched — and installs with
  whichever lockfile you already have (`pnpm-lock.yaml`, `yarn.lock`,
  `bun.lockb`, else npm).
- No `package.json` (e.g. a Python, Go, or Rust repo)? It creates a minimal
  one just for Arsenal, the same as it would for a brand-new project — your
  existing files and tooling are untouched.
- Has a `.gitignore`? It appends `.arsenal/logs/` (plus `node_modules/`, if
  that `package.json` is the one it just created) without touching the rest.
  No `.gitignore` yet? It creates one with just those lines.

Uncommitted changes are unaffected too — by default the agent runs directly
on your current branch and working directory, not an isolated copy.

Either way, scaffold it in:

```bash
npx -y github:ArsenalLab/arsenal-light init
```

This creates `.arsenal/prompt.md` and `.arsenal/run.mjs` (or `run.ts` if you
already have a `tsconfig.json`) and installs the new dependency — no separate
`npm install` step needed. Pass `--no-install` to skip that and install it
yourself, or `--force` to re-scaffold over an existing `.arsenal/` directory
(e.g. one a teammate already committed — if so, you likely only need
`npm install` and the steps below, not `init` at all).

<details>
<summary>Want a bare <code>arsenal</code> command instead of <code>npx</code> every time?</summary>

`npm install -g github:ArsenalLab/arsenal-light` looks like the obvious way
to do this, but don't use it — npm has a bug with global installs from git
specs (it links the package to a temp cache directory it doesn't keep
intact, breaking the `arsenal` binary), unrelated to anything in this repo.
Until Arsenal is published to npm, the reliable way to get a persistent
global command is a one-time local build:

```bash
git clone https://github.com/ArsenalLab/arsenal-light.git
cd arsenal-light && npm install && npm run build && npm pack
npm install -g ./arsenallab-arsenal-light-*.tgz
cd .. && rm -rf arsenal-light
```

After that, `arsenal init` works bare, anywhere. Re-run these steps to pick
up updates. Once this package is on the npm registry, plain
`npm install -g @arsenallab/arsenal-light` will work directly, no clone
needed — npm's git-install bug only affects the `github:` spec form.

</details>

```bash
export BOB_API_KEY=xxx   # get one at bob.ibm.com — required by the bob agent CLI
```

Edit `.arsenal/prompt.md` with what you want the agent to do, then run it:

```bash
node .arsenal/run.mjs   # or: npx tsx .arsenal/run.ts
```

## Install as a library

If you'd rather call `run()` yourself instead of using the generated script:

```bash
npm install --save-dev github:ArsenalLab/arsenal-light
```

> **Not yet published to npm.** `npm install @arsenallab/arsenal-light` (no
> `github:` prefix) will 404 until it is. The `github:` spec above installs
> straight from this repo's default branch — `dist/` is committed, so no
> build runs at install time.
>
> Working from a local clone instead (e.g. testing changes before they land
> on the default branch)? Build and pack it:
>
> ```bash
> npm install        # install deps
> npm run build      # bundle into dist/ (required — the tarball ships dist/, not src/)
> npm pack           # produces arsenallab-arsenal-light-<version>.tgz
> npm install ./arsenallab-arsenal-light-<version>.tgz   # in the consuming project
> ```
>
> Re-run `npm run build && npm pack` after pulling changes to pick up updates.

See [`examples/08-run/08-run.ts`](examples/08-run/08-run.ts) for the one-liner above end to end, and [`examples/README.md`](examples/README.md) for the full tour from single agent invocations up through `run()`.

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

`dist/` is committed (sourcemaps excluded) so consumers installing straight
from git never need to build. If you change anything under `src/`, run
`npm run build` and commit the resulting `dist/` changes in the same PR —
nothing currently checks for this automatically.

## License
