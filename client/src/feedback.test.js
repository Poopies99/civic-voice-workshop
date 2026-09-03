import { describe, expect, it } from "vitest";
import {
  createFeedbackFormState,
  createSubmittedFeedbackState,
  limitFeedback,
  MAX_FEEDBACK_LENGTH,
} from "./feedback";

describe("feedback character limit", () => {
  it("keeps feedback at or below 500 characters", () => {
    const message = "a".repeat(MAX_FEEDBACK_LENGTH);

    expect(limitFeedback(message)).toBe(message);
  });

  it("truncates feedback beyond 500 characters", () => {
    expect(limitFeedback("a".repeat(MAX_FEEDBACK_LENGTH + 1))).toHaveLength(MAX_FEEDBACK_LENGTH);
  });

  it("resets the form when starting another submission", () => {
    expect(createFeedbackFormState()).toEqual({ message: "", submitted: false, error: "" });
  });

  it("clears stale form state after a successful submission", () => {
    expect(createSubmittedFeedbackState()).toEqual({ message: "", submitted: true, error: "" });
  });
});
