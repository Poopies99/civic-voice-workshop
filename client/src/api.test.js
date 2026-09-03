import { afterEach, describe, expect, it, vi } from "vitest";
import { checkHealth } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("checkHealth", () => {
  it("reports the API as reachable when its health endpoint is healthy", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true, service: "civic-voice-api" }),
    });
    vi.stubGlobal("fetch", fetch);

    await expect(checkHealth()).resolves.toBe(true);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3001/api/health");
  });

  it("reports the API as unreachable when the health check cannot connect", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Network error")));

    await expect(checkHealth()).resolves.toBe(false);
  });
});
