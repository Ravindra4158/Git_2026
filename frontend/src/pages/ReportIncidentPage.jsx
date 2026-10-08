import React from "react";
import { Link } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";

export default function ReportIncidentPage() {
  return (
    <FlowFrame step={0} title="Report an incident" description="Start a private local report. AWAAZ will guide you from your story to a reviewed draft.">
      <section className="flow-card report-start-card">
        <div>
          <span className="mini-label">START HERE</span>
          <h2>Keep it simple. Tell the story first.</h2>
          <p>Use your own words. You can avoid names, add details later, and review everything before it appears in a draft.</p>
        </div>
        <div className="report-start-actions">
          <Link className="primary-cta" to="/report/describe">Describe incident <span aria-hidden="true">→</span></Link>
          <Link className="text-link" to="/dashboard">View dashboard</Link>
        </div>
      </section>
      <section className="report-choice-grid" aria-label="What AWAAZ helps with">
        <article>
          <span>01</span>
          <strong>Describe</strong>
          <p>Write what happened in plain language.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Review</strong>
          <p>Check extracted facts against your own story.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Draft</strong>
          <p>Create an authority-specific draft you can edit.</p>
        </article>
      </section>
    </FlowFrame>
  );
}
