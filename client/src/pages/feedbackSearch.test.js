import { describe, expect, it } from "vitest";
import { filterFeedback } from "./feedbackSearch";

const feedback = [
  { id: "1", name: "Aisha Rahman", message: "Please add more benches." },
  { id: "2", name: "Marcus Tan", message: "The park lighting is too dim." },
];

describe("filterFeedback", () => {
  it("finds feedback messages without regard to case", () => {
    expect(filterFeedback(feedback, "LIGHTING")).toEqual([feedback[1]]);
  });

  it("finds citizens by name without regard to case", () => {
    expect(filterFeedback(feedback, "aIsHa")).toEqual([feedback[0]]);
  });

  it("returns all feedback for an empty or whitespace-only query", () => {
    expect(filterFeedback(feedback, "   ")).toEqual(feedback);
  });
});
