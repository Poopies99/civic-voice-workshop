import { useState } from "react";
import { submitFeedback } from "../api";
import {
  createFeedbackFormState,
  createSubmittedFeedbackState,
  limitFeedback,
  MAX_FEEDBACK_LENGTH,
} from "../feedback";

export function CitizenPage({ user }) {
  const [formState, setFormState] = useState(createFeedbackFormState);
  const { message, submitted, error } = formState;

  async function handleSubmit(event) {
    event.preventDefault();
    setFormState((current) => ({ ...current, error: "" }));
    if (message.length > MAX_FEEDBACK_LENGTH) {
      setFormState((current) => ({
        ...current,
        error: `Feedback must be ${MAX_FEEDBACK_LENGTH} characters or fewer.`,
      }));
      return;
    }

    try {
      await submitFeedback({ nric: user.nric, name: user.name, message });
      setFormState(createSubmittedFeedbackState());
    } catch (requestError) {
      setFormState((current) => ({ ...current, error: requestError.message }));
    }
  }

  function handleSubmitAnother() {
    setFormState(createFeedbackFormState());
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div className="eyebrow">Public feedback</div>
        <h1>What would you like us to know?</h1>
        <p>Tell us about an issue, an idea, or a positive experience in your community.</p>
      </div>
      <section className="form-card">
        {submitted ? (
          <div className="submission-confirmation">
            <div className="success-banner">Thank you. Your feedback has been received.</div>
            <button className="primary-button" type="button" onClick={handleSubmitAnother}>
              Submit another response
            </button>
          </div>
        ) : <form onSubmit={handleSubmit}>
          <label>Your feedback
            <textarea
              rows="7"
              value={message}
              maxLength={MAX_FEEDBACK_LENGTH}
              onChange={(event) => setFormState((current) => ({
                ...current,
                message: limitFeedback(event.target.value),
              }))}
              placeholder="Share your feedback here..."
            />
          </label>
          <div className="form-footer">
            <span className="muted">Please do not include sensitive personal information.</span>
            <span className="muted">{message.length} / {MAX_FEEDBACK_LENGTH} characters</span>
            <button className="primary-button" disabled={message.length > MAX_FEEDBACK_LENGTH}>Submit feedback</button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>}
      </section>
    </main>
  );
}
