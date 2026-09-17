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

Works the same way in a project written in any language — Go, Rust, Python,
Node, anything — because it never needs to install itself into that project.

### Step 1 — Check prerequisites

You need Node.js 18 or newer, and git. Check what you have:

```bash
node -v   # must print v18.0.0 or higher
git --version
```

Don't have Node.js? Install it from [nodejs.org](https://nodejs.org) (npm
and npx come bundled with it — no separate install). Don't have git? Install
it from [git-scm.com](https://git-scm.com). Nothing else is required: no
Docker, no build tools, no account sign-up beyond the agent key in Step 4.

### Step 2 — Make sure your project is a git repo with at least one commit

**Starting a brand-new project?**

```bash
mkdir my-project && cd my-project
git init
git commit --allow-empty -m "init"
```

**Already have a project?** Just `cd` into it. If it already has at least
one commit (run `git log -1` to check), skip the commands above entirely.

### Step 3 — Scaffold Arsenal into the project

```bash
npx -y github:ArsenalLab/arsenal-light init
```

The first run downloads Arsenal temporarily to execute it (that's what
`npx` does); it is not installed into your project. This command creates
exactly one file, `.arsenal/prompt.md`, plus a `.gitignore` entry for
`.arsenal/logs/`. Nothing else changes: no `package.json`, no
`node_modules/`, no build output, in any language's project. Re-running it
later is safe — pass `--force` if you want to overwrite an existing
`.arsenal/` (e.g. one a teammate already committed).

### Step 4 — Get an agent API key

Arsenal drives an AI coding agent called `bob` (IBM's Bob-Shell CLI). Get a
free key at [bob.ibm.com](https://bob.ibm.com), then set it as an
environment variable in your terminal:

```bash
export BOB_API_KEY=xxx          # macOS / Linux (bash, zsh)
```

```powershell
$env:BOB_API_KEY = "xxx"        # Windows PowerShell
```

This only lasts for the current terminal session — add it to your shell's
profile file (e.g. `~/.zshrc`, `~/.bashrc`) if you want it to persist.

### Step 5 — Describe the task

Open `.arsenal/prompt.md` in any text editor and replace its contents with
what you want the agent to do, in plain English.

### Step 6 — Run it

```bash
npx -y github:ArsenalLab/arsenal-light run
```

This runs the agent against your prompt and commits its work to your
current git branch. Watch progress with `tail -f .arsenal/logs/<branch>.log`
(the command prints the exact path when it starts).

`run` also accepts `--prompt-file <path>`, `--max-iterations <n>`, and
`--branch-strategy <head|merge-to-head|branch:<name>>` for the handful of
things people actually want to vary from the zero-config defaults
(`bob("default")` + `noSandbox()`, one iteration, writing directly to your
current branch). For anything beyond that — a custom
`SandboxProvider`/`AgentProvider`, or scripting logic around `run()` — write
code against the library instead (below).

<details>
<summary>Prefer a bare <code>arsenal</code> command over typing <code>npx -y github:ArsenalLab/arsenal-light</code> every time?</summary>

```bash
npm install -g @arsenallab/arsenal-light
```

Then use `arsenal init` and `arsenal run` in place of the `npx` commands
above — same behavior, just shorter to type. (Until this package is
published to npm, see the note in "Write code against the library" below
for the one-time local-build workaround.)

</details>

## Write code against the library

If you'd rather call `run()` yourself in a script than use the `arsenal`
CLI — e.g. to plug in a custom sandbox or agent provider — `arsenal init
--lib` scaffolds that instead: it generates `.arsenal/run.mjs` (or `run.ts`
if you already have a `tsconfig.json`) that imports `run()` directly, and
_does_ add `@arsenallab/arsenal-light` as a project dependency (with a
`node_modules/`), since the script needs to resolve the import itself:

```bash
arsenal init --lib
node .arsenal/run.mjs   # or: npx tsx .arsenal/run.ts
```

Or install it directly without scaffolding anything:

```bash
npm install --save-dev github:ArsenalLab/arsenal-light
```

> **Not yet published to npm.** `npm install @arsenallab/arsenal-light` (no
> `github:` prefix) will 404 until it is. The `github:` spec above installs
> straight from this repo's default branch and builds it locally via the
> `prepare` script.
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

> **Getting the bare `arsenal` command before npm publish.**
> `npm install -g github:ArsenalLab/arsenal-light` looks like the obvious
> way to get it, but don't use it — npm has a bug with global installs from
> git specs (it links the package to a temp cache directory it doesn't keep
> intact, breaking the `arsenal` binary), unrelated to anything in this
> repo. Until this package is on the npm registry, get a persistent global
> command with the same local-build-and-pack steps as above, installed with
> `-g` instead of into a project:
>
> ```bash
> git clone https://github.com/ArsenalLab/arsenal-light.git
> cd arsenal-light && npm install && npm run build && npm pack
> npm install -g ./arsenallab-arsenal-light-*.tgz
> cd .. && rm -rf arsenal-light
> ```
>
> After that, `arsenal init` and `arsenal run` work bare, anywhere. Re-run
> these steps to pick up updates. Once this package is on the npm registry,
> plain `npm install -g @arsenallab/arsenal-light` works directly — npm's
> git-install bug only affects the `github:` spec form.

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

## License
