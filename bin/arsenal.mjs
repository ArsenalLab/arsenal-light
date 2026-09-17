#!/usr/bin/env node
/**
 * `arsenal init` — scaffolds the minimum needed to run the agent in any git
 * repo, and `arsenal run` — runs it. No CI, no lint config, no agent/sandbox
 * choice beyond the only zero-config options Arsenal ships (`bob` +
 * `noSandbox()`). Plain Node, no dependencies — kept out of `src/` on
 * purpose so it isn't subject to the engine's layered-architecture rules
 * (see scripts/check-architecture.mjs); it scaffolds/drives consuming
 * projects, it doesn't participate in the engine.
 *
 * Default `init` writes only `.arsenal/prompt.md` — no `package.json`, no
 * `node_modules/`, nothing else in the project. `arsenal run` then imports
 * this package's own bundled `dist/index.js` by absolute path (not by
 * package-name resolution), so it works whether Arsenal is installed
 * globally or locally: Node's module resolution for the library's own
 * runtime deps (@clack/prompts, @agentclientprotocol/sdk) stays inside
 * *this* package's directory and never has to touch the project at all.
 *
 * `arsenal init --lib` keeps the old behavior (package.json + devDependency
 * + a generated run.mjs/run.ts you import the library from directly) for
 * anyone who wants to hand-write custom sandbox/agent providers in code.
 */
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const cwd = process.cwd();
const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const PROMPT_TEMPLATE = `<!-- .arsenal/prompt.md — what you want the agent to do. Edit this. -->

Describe the task here.
`;

const RUN_TEMPLATE = `import { run, bob, noSandbox } from "@arsenallab/arsenal-light";

await run({
  agent: bob("default"),
  sandbox: noSandbox(),
  promptFile: ".arsenal/prompt.md",
});
`;

function isGitRepo() {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd,
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function detectPackageManager() {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

/**
 * Not published to npm — resolves from this package's own `repository.url`
 * into the `github:owner/repo` shorthand npm understands as a dependency
 * spec. No tags exist yet to pin to, so this tracks the default branch;
 * a semver range here would 404 with no registry to resolve it against.
 */
function gitDependencySpec() {
  const { repository } = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  );
  const match = repository?.url?.match(
    /github\.com[:/]([^/]+)\/([^/.]+?)(?:\.git)?$/,
  );
  if (!match) {
    throw new Error(
      "Could not derive a git dependency spec from repository.url",
    );
  }
  const [, owner, repo] = match;
  return `github:${owner}/${repo}`;
}

function ensurePackageJson() {
  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) return { created: false };

  const name =
    cwd
      .split(/[\\/]/)
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9_.-]/g, "-") || "arsenal-project";
  const pkg = { name, version: "0.0.0", private: true };
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  return { created: true };
}

function addDevDependency() {
  const pkgPath = join(cwd, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const alreadyPresent =
    pkg.dependencies?.["@arsenallab/arsenal-light"] ??
    pkg.devDependencies?.["@arsenallab/arsenal-light"];
  if (alreadyPresent) {
    return { changed: false, reason: "already a dependency" };
  }

  pkg.devDependencies = pkg.devDependencies ?? {};
  pkg.devDependencies["@arsenallab/arsenal-light"] = gitDependencySpec();
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  return { changed: true };
}

function bareInstallCommand(pm) {
  switch (pm) {
    case "pnpm":
      return "pnpm install";
    case "yarn":
      return "yarn install";
    case "bun":
      return "bun install";
    default:
      return "npm install";
  }
}

function runInstall(pm) {
  console.log(`\nRunning ${bareInstallCommand(pm)}...`);
  execSync(bareInstallCommand(pm), { cwd, stdio: "inherit" });
}

function ensureGitignoreLines(lines) {
  const gitignorePath = join(cwd, ".gitignore");
  const existing = existsSync(gitignorePath)
    ? readFileSync(gitignorePath, "utf8")
    : "";
  const existingLines = new Set(existing.split("\n").map((l) => l.trim()));
  const toAdd = lines.filter((line) => !existingLines.has(line));
  if (toAdd.length === 0) return;
  const needsNewlineBefore = existing.length > 0 && !existing.endsWith("\n");
  appendFileSync(
    gitignorePath,
    `${needsNewlineBefore ? "\n" : ""}${toAdd.join("\n")}\n`,
  );
}

/** Default `arsenal init`: `.arsenal/prompt.md` only — nothing else touches the project. */
function runInitDefault(force) {
  if (!isGitRepo()) {
    console.error("arsenal init must be run inside a git repository.");
    process.exit(1);
  }

  const arsenalDir = join(cwd, ".arsenal");
  if (existsSync(arsenalDir) && !force) {
    console.log(
      ".arsenal/ already exists — nothing to do (use --force to overwrite).",
    );
    return;
  }

  mkdirSync(arsenalDir, { recursive: true });
  writeFileSync(join(arsenalDir, "prompt.md"), PROMPT_TEMPLATE);
  ensureGitignoreLines([".arsenal/logs/"]);

  console.log("Created .arsenal/prompt.md");
  console.log("\nNext steps:");
  let step = 1;
  if (!process.env.BOB_API_KEY) {
    console.log(
      `  ${step++}. export BOB_API_KEY=xxx   (required by the bob CLI — get one at bob.ibm.com)`,
    );
  }
  console.log(`  ${step++}. Edit .arsenal/prompt.md, then run: arsenal run`);
}

/** `arsenal init --lib`: today's script-generating flow, for hand-rolled sandbox/agent providers. */
function runInitLib(force, skipInstall) {
  if (!isGitRepo()) {
    console.error("arsenal init must be run inside a git repository.");
    process.exit(1);
  }

  const arsenalDir = join(cwd, ".arsenal");
  if (existsSync(arsenalDir) && !force) {
    console.log(
      ".arsenal/ already exists — nothing to do (use --force to overwrite).",
    );
    return;
  }

  mkdirSync(arsenalDir, { recursive: true });

  const usesTs = existsSync(join(cwd, "tsconfig.json"));
  const runFile = usesTs ? "run.ts" : "run.mjs";

  writeFileSync(join(arsenalDir, "prompt.md"), PROMPT_TEMPLATE);
  writeFileSync(join(arsenalDir, runFile), RUN_TEMPLATE);

  const pkgCreated = ensurePackageJson();
  const dep = addDevDependency();
  const pm = detectPackageManager();

  ensureGitignoreLines(
    pkgCreated.created
      ? [".arsenal/logs/", "node_modules/"]
      : [".arsenal/logs/"],
  );

  console.log(`Created .arsenal/prompt.md and .arsenal/${runFile}`);
  if (pkgCreated.created) {
    console.log("Created package.json (none existed in this directory)");
  }
  if (dep.changed) {
    console.log(
      "Added @arsenallab/arsenal-light to devDependencies in package.json",
    );
  }

  let installFailed = false;
  if (skipInstall) {
    console.log(
      `\nSkipped install (--no-install). Run \`${bareInstallCommand(pm)}\` before using .arsenal/${runFile}.`,
    );
  } else {
    try {
      runInstall(pm);
    } catch {
      installFailed = true;
      console.error(
        `\n${bareInstallCommand(pm)} failed — run it yourself once you've sorted out why.`,
      );
    }
  }

  console.log("\nNext steps:");
  let step = 1;
  if (installFailed) {
    console.log(`  ${step++}. ${bareInstallCommand(pm)}`);
  }
  if (!process.env.BOB_API_KEY) {
    console.log(
      `  ${step++}. export BOB_API_KEY=xxx   (required by the bob CLI — get one at bob.ibm.com)`,
    );
  }
  console.log(
    `  ${step++}. Edit .arsenal/prompt.md, then run: ${usesTs ? "npx tsx" : "node"} .arsenal/${runFile}`,
  );
}

function runInit(rest) {
  const force = rest.includes("--force");
  if (rest.includes("--lib")) {
    runInitLib(force, rest.includes("--no-install"));
  } else {
    runInitDefault(force);
  }
}

/** Parses `--prompt-file <path>`, `--max-iterations <n>`, `--branch-strategy <head|merge-to-head|branch:<name>>`. */
function parseRunArgs(rest) {
  const opts = { promptFile: ".arsenal/prompt.md" };
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    switch (arg) {
      case "--prompt-file":
        opts.promptFile = rest[++i];
        break;
      case "--max-iterations": {
        const value = Number(rest[++i]);
        if (!Number.isFinite(value)) {
          console.error("--max-iterations expects a number");
          process.exit(1);
        }
        opts.maxIterations = value;
        break;
      }
      case "--branch-strategy": {
        const value = rest[++i];
        if (value === "head" || value === "merge-to-head") {
          opts.branchStrategy = { type: value };
        } else if (value?.startsWith("branch:")) {
          opts.branchStrategy = {
            type: "branch",
            branch: value.slice("branch:".length),
          };
        } else {
          console.error(
            "--branch-strategy expects head, merge-to-head, or branch:<name>",
          );
          process.exit(1);
        }
        break;
      }
      default:
        console.error(`Unknown option for arsenal run: ${arg}`);
        printUsage();
        process.exit(1);
    }
  }
  return opts;
}

/**
 * `arsenal run` — imports this package's own bundled `dist/index.js` by
 * absolute path so it never needs a project-level `node_modules`.
 */
async function runRun(rest) {
  if (!isGitRepo()) {
    console.error("arsenal run must be run inside a git repository.");
    process.exit(1);
  }

  const opts = parseRunArgs(rest);

  if (!existsSync(join(cwd, opts.promptFile))) {
    console.error(
      `Prompt file not found: ${opts.promptFile}\nRun \`arsenal init\` first, or pass --prompt-file.`,
    );
    process.exit(1);
  }

  const distEntry = join(packageRoot, "dist", "index.js");
  const { run, bob, noSandbox } = await import(pathToFileURL(distEntry).href);

  try {
    await run({
      agent: bob("default"),
      sandbox: noSandbox(),
      promptFile: opts.promptFile,
      ...(opts.maxIterations !== undefined
        ? { maxIterations: opts.maxIterations }
        : {}),
      ...(opts.branchStrategy !== undefined
        ? { branchStrategy: opts.branchStrategy }
        : {}),
    });
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

function printUsage() {
  console.log(
    [
      "Usage:",
      "  arsenal init [--force] [--lib [--no-install]]",
      "  arsenal run [--prompt-file <path>] [--max-iterations <n>] [--branch-strategy <head|merge-to-head|branch:<name>>]",
    ].join("\n"),
  );
}

async function main() {
  const [, , cmd, ...rest] = process.argv;

  if (cmd === "--help" || cmd === "-h" || cmd === undefined) {
    printUsage();
    process.exit(cmd === undefined ? 1 : 0);
  }

  if (cmd === "init") {
    runInit(rest);
    return;
  }

  if (cmd === "run") {
    await runRun(rest);
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  printUsage();
  process.exit(1);
}

await main();
