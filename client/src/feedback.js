function timestamp(feedback) {
  const value = Date.parse(feedback.createdAt);
  return Number.isNaN(value) ? Number.NEGATIVE_INFINITY : value;
}

export function sortFeedbackNewestFirst(feedback) {
  return [...feedback].sort((first, second) => timestamp(second) - timestamp(first));
}
