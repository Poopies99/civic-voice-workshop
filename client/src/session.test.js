import { describe, expect, it } from "vitest";
import { clearSession, readSession, saveSession, SESSION_STORAGE_KEY } from "./session";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("session storage", () => {
  it("restores a saved signed-in user", () => {
    const storage = createStorage();
    const session = { user: { name: "Aisha Rahman", role: "citizen" } };

    saveSession(session, storage);

    expect(readSession(storage)).toEqual(session);
  });

  it("clears the saved user on sign out", () => {
    const storage = createStorage();
    saveSession({ user: { name: "Farid Lim", role: "admin" } }, storage);

    clearSession(storage);

    expect(storage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(readSession(storage)).toBeNull();
  });

  it("ignores invalid saved values", () => {
    const storage = createStorage();
    storage.setItem(SESSION_STORAGE_KEY, "not-json");

    expect(readSession(storage)).toBeNull();
  });
});
