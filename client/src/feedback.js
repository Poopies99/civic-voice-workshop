function timestamp(feedback) {
  const value = Date.parse(feedback.createdAt);
  return Number.isNaN(value) ? Number.NEGATIVE_INFINITY : value;
}

export function sortFeedbackNewestFirst(feedback) {
  return [...feedback].sort((first, second) => timestamp(second) - timestamp(first));
}

export const MAX_FEEDBACK_LENGTH = 500;

export function limitFeedback(value) {
  return value.slice(0, MAX_FEEDBACK_LENGTH);
}
