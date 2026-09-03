import { describe, expect, it } from "vitest";
import { getInboxViewState } from "./inbox";

describe("admin inbox view state", () => {
  it("shows loading before a request has completed", () => {
    expect(getInboxViewState({ isLoading: true, error: "", feedback: [] })).toBe("loading");
  });

  it("prioritises the failure state once loading is complete", () => {
    expect(getInboxViewState({ isLoading: false, error: "Request failed", feedback: [] })).toBe("error");
  });

  it("shows a distinct empty state after a successful empty response", () => {
    expect(getInboxViewState({ isLoading: false, error: "", feedback: [] })).toBe("empty");
  });

  it("renders the inbox when feedback is available", () => {
    expect(getInboxViewState({ isLoading: false, error: "", feedback: [{ id: "feedback-1" }] })).toBe("ready");
  });
});
