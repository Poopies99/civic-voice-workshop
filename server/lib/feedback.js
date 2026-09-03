export function normalizeFeedback(message) {
  return message
    .replace(/\r\n?/g, "\n")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}
