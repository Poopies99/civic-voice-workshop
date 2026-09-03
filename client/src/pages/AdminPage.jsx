import { useEffect, useState } from "react";
import { getFeedback } from "../api";
import { maskIdentifier } from "../lib/maskIdentifier";
import { filterFeedback } from "./feedbackSearch";

export function AdminPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const filteredFeedback = filterFeedback(feedback, query);

  useEffect(() => {
    getFeedback(user).then((response) => setFeedback(response.feedback)).catch((requestError) => setError(requestError.message));
  }, [user]);

  return (
    <main className="page-shell admin-shell">
      <div className="page-heading">
        <div className="eyebrow">Admin workspace</div>
        <h1>Feedback inbox</h1>
        <p>A simple view of feedback received from members of the public.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
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
        {filteredFeedback.map((item) => (
          <article className="feedback-row" key={item.id}>
            <div>
              <div className="feedback-meta">{item.name} · {maskIdentifier(item.nric)} · {new Date(item.createdAt).toLocaleDateString()}</div>
              <p>{item.message}</p>
            </div>
            <span className="status-pill">{item.status}</span>
          </article>
        ))}
        {!error && feedback.length > 0 && filteredFeedback.length === 0 && (
          <p className="empty-state">No feedback matches “{query.trim()}”. Try another keyword.</p>
        )}
        {!error && feedback.length === 0 && (
          <p className="empty-state">No feedback has been received yet.</p>
        )}
      </section>
    </main>
  );
}
