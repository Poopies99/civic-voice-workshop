export const MAX_FEEDBACK_LENGTH = 500;

export function limitFeedback(value) {
  return value.slice(0, MAX_FEEDBACK_LENGTH);
}

export function createFeedbackFormState() {
  return { message: "", submitted: false, error: "" };
}

export function createSubmittedFeedbackState() {
  return { message: "", submitted: true, error: "" };
}
