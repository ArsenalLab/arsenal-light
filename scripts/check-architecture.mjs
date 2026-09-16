#!/usr/bin/env node
/**
 * Fail if any production module under `src/` imports against Arsenal's layer
 * order, or if production imports form a cycle.
 *
 * A module may import only from its own layer or below. Adapters (`agents/`,
 * `sandboxes/`) may import only the spi contracts, `acp/` and `platform/`,
 * and only `index.ts` may import them. Platform adapters (`platform/`)
 * implement engine ports and may import only L0, `ports/` and `acp/`;
 * only the composition roots (`index.ts`, `composition/`) and adapters may
 * import them. Nothing in production may import
 * `src/testing/`. Type-only imports count — a type cycle is still a cycle.
 *
 * The layer order, top to bottom: `index.ts` -> `composition/` ->
 * `application/orchestration/` -> `application/sandbox/` ->
 * `application/{prompts,sync}/` -> `application/{display,git}/` / `acp/` ->
 * `ports/` -> `spi/` / `errors/` / `utils/`. Named after onion-architecture
 * rings so the dependency direction reads directly off the directory tree:
 * `spi/` (L0) holds only the pluggable provider contracts (`AgentProvider`,
 * `SandboxProvider`) a backend implements — not business entities, hence
 * `spi/` rather than `domain/` — `ports/` (L1) holds the engine's own
 * internal contracts (`Display`, `HostProcess`, `AgentExecutor`,
 * `SandboxOps`), `application/` (L2-L4) is the orchestration core, and
 * `composition/` (L5) assembles it into the public API. This file is the
 * source of truth for current paths; a module may import only from its own
 * layer or below, and within a layer, imports must not form a cycle.
 *
 * Below the composition roots, code must also stay free of platform I/O:
 * outside `index.ts`, `composition/`, `platform/`, adapters and `testing/`,
 * importing `node:child_process`, `@clack/prompts` or
 * `@effect/platform-node`, or writing through `console.*`,
 * `process.stdout/stderr.write` or `process.exit`, is a violation — go
 * through the `HostProcess` and `Display` ports instead.
 *
 * Pass `--report` to print violations without failing (exit 0).
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const srcDir = join(here, "..", "src");
const reportOnly = process.argv.includes("--report");

const ADAPTER = "adapter";
const PLATFORM = "platform";
const TESTING = "testing";

/** Longest-prefix-wins mapping from a `src/`-relative path to its layer. */
const LAYERS = [
  ["testing/", TESTING],
  ["index.ts", 6],
  ["composition/", 5],
  ["application/orchestration/", 4],
  ["application/sandbox/", 3],
  ["application/prompts/", 2.5],
  ["application/sync/", 2.5],
  ["application/display/", 2],
  ["application/git/", 2],
  ["application/acp/", 2],
  ["ports/", 1],
  ["spi/", 0],
  ["errors/", 0],
  ["utils/", 0],
  ["platform/", PLATFORM],
  ["agents/", ADAPTER],
  ["sandboxes/", ADAPTER],
].sort((a, b) => b[0].length - a[0].length);

const LAYER_NAMES = {
  6: "L6 index",
  5: "L5 composition",
  4: "L4 application/orchestration",
  3: "L3 application/sandbox",
  2.5: "L2b application/prompts|sync",
  2: "L2a application/display|git, acp",
  1: "L1 ports",
  0: "L0 spi contracts",
  [ADAPTER]: "adapter",
  [PLATFORM]: "platform",
  [TESTING]: "testing",
};

const layerOf = (file) =>
  LAYERS.find(([prefix]) => file.startsWith(prefix))?.[1];
const adapterRoot = (file) => file.split("/")[0];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
      yield path;
    }
  }
}

/**
 * Blank out comments while leaving string and template literals intact, so
 * import-shaped text in JSDoc examples is ignored but real specifiers survive.
 */
const stripComments = (code) => {
  let out = "";
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i + 1];
    if (c === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && next === "*") {
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) {
        if (code[i] === "\n") out += "\n";
        i++;
      }
      i++;
    } else if (c === '"' || c === "'" || c === "`") {
      out += c;
      for (i++; i < code.length && code[i] !== c; i++) {
        if (code[i] === "\\") out += code[i++];
        out += code[i];
      }
      out += c;
    } else {
      out += c;
    }
  }
  return out;
};

const IMPORT_PATTERN =
  /(?:^|[;\s])(?:import|export)\s[^;]*?\bfrom\s*["'](\.[^"']+)["']|(?:^|[;\s])import\s*["'](\.[^"']+)["']|\bimport\s*\(\s*["'](\.[^"']+)["']\s*\)/g;

const toPosix = (p) => p.split(sep).join("/");

/** Bare module specifiers only the composition roots and adapters may import. */
const PLATFORM_ONLY_MODULES = [
  "node:child_process",
  "@clack/prompts",
  "@effect/platform-node",
];
const BARE_IMPORT_PATTERN =
  /(?:^|[;\s])(?:import|export)\s[^;]*?\bfrom\s*["']([^."'][^"']*)["']|\bimport\s*\(\s*["']([^."'][^"']*)["']\s*\)/g;
const PLATFORM_IO_PATTERN =
  /\b(console\.(?:log|error|warn|info|debug)|process\.(?:stdout|stderr)\.write|process\.exit)\b/g;
const mayUsePlatformIO = (file) => {
  const layer = layerOf(file);
  return (
    layer === 6 ||
    layer === 5 ||
    layer === PLATFORM ||
    layer === ADAPTER ||
    layer === TESTING
  );
};

const graph = new Map();
const platformIOViolations = [];
for await (const abs of walk(srcDir)) {
  const file = toPosix(relative(srcDir, abs));
  const code = stripComments(await readFile(abs, "utf8"));
  const targets = new Set();
  for (const match of code.matchAll(IMPORT_PATTERN)) {
    const spec = (match[1] ?? match[2] ?? match[3]).replace(/\.js$/, ".ts");
    targets.add(toPosix(normalize(join(dirname(file), spec))));
  }
  graph.set(file, [...targets]);
  if (!mayUsePlatformIO(file)) {
    for (const match of code.matchAll(BARE_IMPORT_PATTERN)) {
      const spec = match[1] ?? match[2];
      if (PLATFORM_ONLY_MODULES.includes(spec)) {
        platformIOViolations.push(
          `${file}: imports ${spec} (platform-only — use a port)`,
        );
      }
    }
    for (const match of code.matchAll(PLATFORM_IO_PATTERN)) {
      platformIOViolations.push(
        `${file}: uses ${match[1]} (platform I/O — use the Display or HostProcess port)`,
      );
    }
  }
}

const violations = [...new Set(platformIOViolations)];
for (const [from, targets] of graph) {
  const fromLayer = layerOf(from);
  if (fromLayer === undefined) {
    violations.push(`${from}: not assigned to any layer`);
    continue;
  }
  if (fromLayer === TESTING) continue;
  for (const to of targets) {
    if (!graph.has(to)) continue;
    const toLayer = layerOf(to);
    if (toLayer === undefined) continue;
    const edge = `${from} -> ${to}`;
    if (toLayer === TESTING) {
      violations.push(`${edge}: production code imports src/testing/`);
    } else if (fromLayer === ADAPTER) {
      const sameAdapter =
        toLayer === ADAPTER && adapterRoot(from) === adapterRoot(to);
      if (
        !sameAdapter &&
        toLayer !== 0 &&
        toLayer !== PLATFORM &&
        !to.startsWith("application/acp/")
      ) {
        violations.push(
          `${edge}: adapters may import only L0, application/acp/ and platform/`,
        );
      }
    } else if (fromLayer === PLATFORM) {
      if (
        toLayer !== PLATFORM &&
        toLayer !== 0 &&
        toLayer !== 1 &&
        !to.startsWith("application/acp/")
      ) {
        violations.push(
          `${edge}: platform adapters may import only L0, ports/ and application/acp/`,
        );
      }
    } else if (toLayer === PLATFORM) {
      if (from !== "index.ts" && fromLayer !== 5) {
        violations.push(
          `${edge}: only composition roots (index.ts, composition/) and adapters may import platform/`,
        );
      }
    } else if (toLayer === ADAPTER) {
      if (from !== "index.ts") {
        violations.push(`${edge}: only index.ts may import adapters`);
      }
    } else if (toLayer > fromLayer) {
      violations.push(
        `${edge}: upward import (${LAYER_NAMES[fromLayer]} -> ${LAYER_NAMES[toLayer]})`,
      );
    }
  }
}

// Tarjan's strongly-connected components — every SCC larger than one file is a cycle.
const cycles = [];
{
  let counter = 0;
  const index = new Map();
  const low = new Map();
  const stack = [];
  const onStack = new Set();
  const visit = (v) => {
    index.set(v, counter);
    low.set(v, counter++);
    stack.push(v);
    onStack.add(v);
    for (const w of graph.get(v)) {
      if (!graph.has(w)) continue;
      if (!index.has(w)) {
        visit(w);
        low.set(v, Math.min(low.get(v), low.get(w)));
      } else if (onStack.has(w)) {
        low.set(v, Math.min(low.get(v), index.get(w)));
      }
    }
    if (low.get(v) === index.get(v)) {
      const component = [];
      let w;
      do {
        w = stack.pop();
        onStack.delete(w);
        component.push(w);
      } while (w !== v);
      if (component.length > 1) cycles.push(component.sort());
    }
  };
  for (const v of graph.keys()) if (!index.has(v)) visit(v);
}

const total = violations.length + cycles.length;
if (total === 0) {
  console.log(
    `✓ Architecture check passed (${graph.size} modules, no layer violations, no cycles)`,
  );
  process.exit(0);
}

const log = reportOnly ? console.log : console.error;
log(
  `${reportOnly ? "•" : "✗"} Architecture check: ${violations.length} layer violation(s), ${cycles.length} cycle(s)`,
);
for (const v of violations.sort()) log(`  ${v}`);
for (const c of cycles) log(`  cycle: ${c.join(" <-> ")}`);
log(
  "\nSee the LAYERS table and the module doc comment at the top of this file " +
    "for the current layer order and the rules behind it.",
);
process.exit(reportOnly ? 0 : 1);
