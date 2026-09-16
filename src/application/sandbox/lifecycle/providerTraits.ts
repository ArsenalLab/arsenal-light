/**
 * Derives a few high-level facts from a sandbox provider's `tag`, so callers
 * above the sandbox layer (`run()`, `withWorktree()`, `createSandbox()`) don't
 * each re-derive them by comparing tags themselves. Those callers need to know
 * things like "does this provider share the host filesystem?" or "which branch
 * strategies make sense here?" — not the tag itself.
 *
 * This is not the only place `provider.tag` is read: `launchSandboxHandle.ts`
 * and `SandboxFactory.ts` dispatch on the tag directly to decide how to
 * actually start a sandbox.
 */

import type {
  BranchStrategy,
  SandboxProvider,
} from "../../../spi/SandboxProvider.js";

export interface ProviderTraits {
  /** The sandbox has its own filesystem: code reaches it via `transfer`, not a shared mount. */
  readonly isolated: boolean;
}

export const providerTraits = (provider: SandboxProvider): ProviderTraits => ({
  isolated: provider.tag === "isolated",
});

/**
 * Resolve the branch strategy for a provider: the requested one, or the
 * provider's default (`merge-to-head` for isolated, `head` otherwise).
 * Throws when `head` is paired with an isolated provider — an isolated
 * sandbox cannot write into the host working directory.
 */
export const resolveBranchStrategy = (
  provider: SandboxProvider,
  requested: BranchStrategy | undefined,
): BranchStrategy => {
  const { isolated } = providerTraits(provider);
  const strategy: BranchStrategy =
    requested ?? (isolated ? { type: "merge-to-head" } : { type: "head" });
  if (strategy.type === "head" && isolated) {
    throw new Error(
      "head branch strategy is not supported with isolated providers",
    );
  }
  return strategy;
};
