import { useCallback, useEffect, useState } from "react";
import { getFeedback } from "../api";
import { filterFeedback } from "./feedbackSearch";
import { getInboxViewState } from "../inbox";

export function AdminPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadFeedback = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getFeedback(user);
      setFeedback(response.feedback ?? []);
    } catch (requestError) {
      setFeedback([]);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const inboxState = getInboxViewState({ isLoading, error, feedback });
  const filteredFeedback = filterFeedback(feedback, query);

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      <section className="feedback-list">
        <div className="list-header"><strong>Latest feedback</strong><span>{filteredFeedback.length} of {feedback.length} items</span></div>
        <label className="search-field">
          <span>Search feedback</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages or citizen names"
          />
        </label>
        {inboxState === "loading" && (
          <div className="inbox-state inbox-loading" role="status" aria-live="polite">
            <span className="loading-indicator" aria-hidden="true" />
            <div><strong>Loading feedback</strong><p>Getting the latest messages from the inbox.</p></div>
          </div>
        )}
        {inboxState === "error" && (
          <div className="inbox-state inbox-error" role="alert">
            <div><strong>We could not load the inbox.</strong><p>{error}</p></div>
            <button className="primary-button" type="button" onClick={loadFeedback}>Try again</button>
          </div>
        )}
        {inboxState === "empty" && (
          <div className="inbox-state inbox-empty">
            <strong>No feedback yet</strong>
            <p>New messages from members of the public will appear here.</p>
          </div>
        )}
        {inboxState === "ready" && filteredFeedback.map((item) => (
          <article className="feedback-row" key={item.id}>
            <div>
              <div className="feedback-meta">{item.name} · {new Date(item.createdAt).toLocaleDateString()}</div>
              <p>{item.message}</p>
            </div>
            <span className="status-pill">{item.status}</span>
          </article>
        ))}
        {inboxState === "ready" && filteredFeedback.length === 0 && (
          <p className="empty-state">No feedback matches “{query.trim()}”. Try another keyword.</p>
        )}
      </section>
    </main>
  );
}
