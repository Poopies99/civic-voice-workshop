import { describe, expect, it } from "vitest";
import { limitFeedback, MAX_FEEDBACK_LENGTH } from "./feedback";

describe("feedback character limit", () => {
  it("keeps feedback at or below 500 characters", () => {
    const message = "a".repeat(MAX_FEEDBACK_LENGTH);

    expect(limitFeedback(message)).toBe(message);
  });

  it("truncates feedback beyond 500 characters", () => {
    expect(limitFeedback("a".repeat(MAX_FEEDBACK_LENGTH + 1))).toHaveLength(MAX_FEEDBACK_LENGTH);
  });
});
