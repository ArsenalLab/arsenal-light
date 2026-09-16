/**
 * 06c-await-using.ts
 *
 * Layer 5 variant — `await using` for automatic cleanup, on top of
 * 06-acp-session.ts.
 *
 * BobAcpSession implements AsyncDisposable so TypeScript's `await using`
 * syntax calls close() automatically at the end of the block, instead of
 * the manual try/finally used in 06-acp-session.ts. This works for both
 * prompt() and promptStream() (06b-stream.ts already uses it).
 *
 * Run:
 *   npx tsx examples/06c-await-using.ts
 */

import "../_setup.js"; // loads BOB_API_KEY from .env
import { BobAcpSession } from "../../src/index.js";

{
  await using session = await BobAcpSession.create({
    cwd: process.cwd(),
    autoApprove: true,
  });

  const reply = await session.prompt(
    "List the three most important source files in this repo and explain each in one sentence.",
  );

  console.log("Bob says:\n");
  console.log(reply);

  // session.close() is called automatically here
}

console.log("\nSession was automatically closed by `await using`.");
