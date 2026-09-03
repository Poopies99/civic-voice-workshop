import { describe, expect, it } from "vitest";
import { maskIdentifier } from "./maskIdentifier";

describe("maskIdentifier", () => {
  it("keeps only the first and last two characters of an NRIC-like identifier", () => {
    expect(maskIdentifier("S0000001A")).toBe("S••••••1A");
  });

  it("does not expose whitespace around an identifier", () => {
    expect(maskIdentifier(" S0000002B ")).toBe("S••••••2B");
  });

  it("returns short and absent identifiers without attempting to mask them", () => {
    expect(maskIdentifier("S1A")).toBe("S1A");
    expect(maskIdentifier()).toBe("");
  });
});
