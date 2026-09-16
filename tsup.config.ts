import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync("./package.json", "utf8")) as {
  version: string;
};

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "sandboxes/no-sandbox": "src/sandboxes/no-sandbox/no-sandbox.ts",
    "agents/bob": "src/agents/bob/bob.ts",
    "agents/bobAcp": "src/agents/bob/bobAcp.ts",
  },
  format: ["esm"],
  outDir: "dist",
  target: "node18",
  platform: "node",
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
  external: [],
  define: {
    __ARSENAL_VERSION__: JSON.stringify(pkg.version),
  },
});
