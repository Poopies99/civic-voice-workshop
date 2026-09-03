import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, applyTheme, getInitialTheme, saveTheme } from "./theme";

function storageWith(value) {
  return { getItem: () => value };
}

describe("getInitialTheme", () => {
  it("uses a saved valid preference before the OS preference", () => {
    expect(getInitialTheme(storageWith("light"), { matches: true })).toBe("light");
  });

  it("uses the OS preference when no preference has been saved", () => {
    expect(getInitialTheme(storageWith(null), { matches: true })).toBe("dark");
    expect(getInitialTheme(storageWith(null), { matches: false })).toBe("light");
  });

  it("ignores invalid saved preferences", () => {
    expect(getInitialTheme(storageWith("midnight"), { matches: false })).toBe("light");
  });
});

describe("theme storage key", () => {
  it("uses a namespaced storage key", () => {
    expect(THEME_STORAGE_KEY).toBe("civic-voice-theme");
  });
});

it("persists and applies an explicit choice", () => {
  const storage = { setItem: (...args) => { storage.saved = args; } };
  const documentElement = { dataset: {} };

  saveTheme("dark", storage);
  applyTheme("dark", documentElement);

  expect(storage.saved).toEqual([THEME_STORAGE_KEY, "dark"]);
  expect(documentElement.dataset.theme).toBe("dark");
});
