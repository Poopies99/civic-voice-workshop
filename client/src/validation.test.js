import { describe, expect, it } from "vitest";
import { isWorkshopId, normalizeWorkshopId } from "./validation";

describe("workshop ID validation", () => {
  it("accepts the seeded workshop IDs", () => {
    expect(isWorkshopId("S0000001A")).toBe(true);
    expect(isWorkshopId("S0000002B")).toBe(true);
  });

  it("normalizes spaces and letter casing", () => {
    expect(normalizeWorkshopId(" s0000001a ")).toBe("S0000001A");
    expect(isWorkshopId(" s0000001a ")).toBe(true);
  });

  it("rejects empty and malformed values", () => {
    expect(isWorkshopId("")).toBe(false);
    expect(isWorkshopId("S000001A")).toBe(false);
    expect(isWorkshopId("S0000001")).toBe(false);
    expect(isWorkshopId("not-an-id")).toBe(false);
  });
});
