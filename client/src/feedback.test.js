import { describe, expect, it } from "vitest";
import { limitFeedback, MAX_FEEDBACK_LENGTH, sortFeedbackNewestFirst } from "./feedback";

describe("sortFeedbackNewestFirst", () => {
  it("keeps the admin inbox newest first even if an API response is unordered", () => {
    const feedback = [
      { id: "old", createdAt: "2026-08-28T09:00:00.000Z" },
      { id: "new", createdAt: "2026-08-30T09:00:00.000Z" },
      { id: "middle", createdAt: "2026-08-29T09:00:00.000Z" },
    ];

    expect(sortFeedbackNewestFirst(feedback).map((item) => item.id)).toEqual(["new", "middle", "old"]);
  });
});

describe("feedback character limit", () => {
  it("keeps feedback at or below 500 characters", () => {
    const message = "a".repeat(MAX_FEEDBACK_LENGTH);

    expect(limitFeedback(message)).toBe(message);
  });

  it("truncates feedback beyond 500 characters", () => {
    expect(limitFeedback("a".repeat(MAX_FEEDBACK_LENGTH + 1))).toHaveLength(MAX_FEEDBACK_LENGTH);
  });
});
