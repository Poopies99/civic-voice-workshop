export function getInboxViewState({ isLoading, error, feedback }) {
  if (isLoading) return "loading";
  if (error) return "error";
  if (feedback.length === 0) return "empty";
  return "ready";
}
