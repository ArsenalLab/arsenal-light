/**
 * 06d-approvals.ts
 *
 * Layer 5 variant — human-in-the-loop terminal command approvals, on top of
 * 06-acp-session.ts's Part B.
 *
 * The persistent session model is what makes interactive approval practical:
 * Bob holds conversational context while waiting for your input, then
 * continues from exactly where it left off after you respond.
 *
 * Before executing each tool call Bob sends a RequestPermission event.
 * interactivePermissionHandler shows Bob's title and the options it offers,
 * then waits for you to pick one by number from the terminal.
 *
 * Run:
 *   npx tsx examples/06d-approvals.ts
 */

import "../_setup.js"; // loads BOB_API_KEY from .env
import { BobAcpSession, interactivePermissionHandler } from "../../src/index.js";

const session = await BobAcpSession.create({
  cwd: process.cwd(),
  onPermissionRequest: interactivePermissionHandler,
});

try {
  const response = await session.prompt(
    `Run the following commands one at a time and show me the output of each:
1. echo "Hello from Arsenal"
2. git log --oneline -5
3. ls src/agents/
4. node --version`,
  );
  console.log("Bob:", response);
} finally {
  await session.close();
  console.log("\nSession closed.");
}
