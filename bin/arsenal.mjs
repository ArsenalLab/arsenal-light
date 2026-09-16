#!/usr/bin/env node
/**
 * `arsenal init` — scaffolds the minimum needed to run `run()` in any git
 * repo. No CI, no lint config, no agent/sandbox choice beyond the only
 * zero-config options Arsenal ships (`bob` + `noSandbox()`). Plain Node,
 * no dependencies — kept out of `src/` on purpose so it isn't subject to
 * the engine's layered-architecture rules (see scripts/check-architecture.mjs);
 * it scaffolds consuming projects, it doesn't participate in the engine.
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
import { fileURLToPath } from "node:url";

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
    throw new Error("Could not derive a git dependency spec from repository.url");
  }
  const [, owner, repo] = match;
  return `github:${owner}/${repo}`;
}

function installCommand(pm, spec) {
  switch (pm) {
    case "pnpm":
      return `pnpm add -D ${spec}`;
    case "yarn":
      return `yarn add -D ${spec}`;
    case "bun":
      return `bun add -d ${spec}`;
    default:
      return `npm install --save-dev ${spec}`;
  }
}

function addDevDependency() {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    return { changed: false, reason: "no package.json in this directory" };
  }

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

function ensureGitignoreLine() {
  const gitignorePath = join(cwd, ".gitignore");
  const line = ".arsenal/logs/";
  const existing = existsSync(gitignorePath)
    ? readFileSync(gitignorePath, "utf8")
    : "";
  if (existing.split("\n").some((l) => l.trim() === line)) return;
  const needsNewlineBefore = existing.length > 0 && !existing.endsWith("\n");
  appendFileSync(gitignorePath, `${needsNewlineBefore ? "\n" : ""}${line}\n`);
}

function runInit(force) {
  if (!isGitRepo()) {
    console.error("arsenal init must be run inside a git repository.");
    process.exit(1);
  }

  const arsenalDir = join(cwd, ".arsenal");
  if (existsSync(arsenalDir) && !force) {
    console.log(".arsenal/ already exists — nothing to do (use --force to overwrite).");
    return;
  }

  mkdirSync(arsenalDir, { recursive: true });

  const usesTs = existsSync(join(cwd, "tsconfig.json"));
  const runFile = usesTs ? "run.ts" : "run.mjs";

  writeFileSync(join(arsenalDir, "prompt.md"), PROMPT_TEMPLATE);
  writeFileSync(join(arsenalDir, runFile), RUN_TEMPLATE);
  ensureGitignoreLine();

  const dep = addDevDependency();
  const pm = detectPackageManager();

  console.log(`Created .arsenal/prompt.md and .arsenal/${runFile}`);
  if (dep.changed) {
    console.log(
      "Added @arsenallab/arsenal-light to devDependencies in package.json",
    );
  }

  console.log("\nNext steps:");
  if (dep.changed) {
    console.log(`  1. ${pm} install`);
  } else if (dep.reason === "no package.json in this directory") {
    console.log(`  1. ${installCommand(pm, gitDependencySpec())}`);
  }
  if (!process.env.BOB_API_KEY) {
    console.log(
      "  2. export BOB_API_KEY=xxx   (required by the bob CLI — get one at bob.ibm.com)",
    );
  }
  console.log(
    `  3. Edit .arsenal/prompt.md, then run: ${usesTs ? "npx tsx" : "node"} .arsenal/${runFile}`,
  );
}

function printUsage() {
  console.log("Usage: arsenal init [--force]");
}

function main() {
  const [, , cmd, ...rest] = process.argv;

  if (cmd === "--help" || cmd === "-h" || cmd === undefined) {
    printUsage();
    process.exit(cmd === undefined ? 1 : 0);
  }

  if (cmd !== "init") {
    console.error(`Unknown command: ${cmd}`);
    printUsage();
    process.exit(1);
  }

  runInit(rest.includes("--force"));
}

main();
