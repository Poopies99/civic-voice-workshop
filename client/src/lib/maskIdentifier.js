export function maskIdentifier(identifier) {
  const value = String(identifier ?? "").trim();

  if (value.length <= 3) return value;

  return `${value[0]}${"•".repeat(value.length - 3)}${value.slice(-2)}`;
}
