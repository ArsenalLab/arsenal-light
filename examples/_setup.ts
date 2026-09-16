/**
 * Shared setup for all examples.
 *
 * Loads .env from the repo root.
 *
 * Create a .env file at the repo root:
 *   BOB_API_KEY=your-key-here
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(import.meta.url), "../..");
config({ path: resolve(repoRoot, ".env") });

if (!process.env.BOB_API_KEY) {
  console.error(
    "Error: BOB_API_KEY is not set. Add it to .env at the repo root.",
  );
  process.exit(1);
}
