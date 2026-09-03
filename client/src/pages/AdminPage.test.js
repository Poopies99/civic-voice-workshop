import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FeedbackMessage } from "./AdminPage";

describe("FeedbackMessage", () => {
  it("renders feedback as text instead of HTML", () => {
    const markup = renderToStaticMarkup(createElement(FeedbackMessage, {
      message: '<img src=x onerror=alert("unsafe")>',
    }));

    expect(markup).toBe('<p>&lt;img src=x onerror=alert(&quot;unsafe&quot;)&gt;</p>');
  });
});
