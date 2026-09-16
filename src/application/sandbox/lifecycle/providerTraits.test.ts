import { describe, expect, it } from "vitest";
import {
  createBindMountSandboxProvider,
  createIsolatedSandboxProvider,
  type NoSandboxProvider,
  type SandboxHandle,
} from "../../../spi/SandboxProvider.js";
import { providerTraits, resolveBranchStrategy } from "./providerTraits.js";

const create = async (): Promise<SandboxHandle> => {
  throw new Error("not called");
};

const bindMount = createBindMountSandboxProvider({ name: "bm", create });
const isolated = createIsolatedSandboxProvider({ name: "iso", create });
const none: NoSandboxProvider = { tag: "none", name: "none", env: {}, create };

describe("providerTraits", () => {
  it("marks only isolated providers as isolated", () => {
    expect(providerTraits(isolated).isolated).toBe(true);
    expect(providerTraits(bindMount).isolated).toBe(false);
    expect(providerTraits(none).isolated).toBe(false);
  });
});

describe("resolveBranchStrategy", () => {
  it("defaults to merge-to-head for isolated providers", () => {
    expect(resolveBranchStrategy(isolated, undefined)).toEqual({
      type: "merge-to-head",
    });
  });

  it("defaults to head for bind-mount and no-sandbox providers", () => {
    expect(resolveBranchStrategy(bindMount, undefined)).toEqual({
      type: "head",
    });
    expect(resolveBranchStrategy(none, undefined)).toEqual({ type: "head" });
  });

  it("keeps an explicit strategy", () => {
    const named = { type: "branch", branch: "agent/x" } as const;
    expect(resolveBranchStrategy(isolated, named)).toBe(named);
  });

  it("rejects head with an isolated provider", () => {
    expect(() => resolveBranchStrategy(isolated, { type: "head" })).toThrow(
      "head branch strategy is not supported with isolated providers",
    );
  });
});
