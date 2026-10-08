import React, { useState } from "react";
import { Link } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import AgeConsent from "../components/AgeConsent.jsx";

export default function ReportIncidentPage() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [ageData, setAgeData] = useState(null);

  function handleAgeConfirm(data) {
    setAgeData(data);
    setAgeConfirmed(true);
  }

  return (
    <FlowFrame step={0} title="Report an incident" description="Start a private local report. AWAAZ will guide you from your story to a reviewed draft.">
      <section className="flow-card report-start-card">
        {!ageConfirmed ? (
          <AgeConsent onConfirm={handleAgeConfirm} />
        ) : (
          <>
            <div className="report-start-confirmed">
              <div>
                <span className="mini-label">START HERE</span>
                <h2>Keep it simple. Tell the story first.</h2>
                <p>Use your own words. You can avoid names, add details later, and review everything before it appears in a draft.</p>
                {ageData?.ageGroup === "child" && (
                  <div className="age-notice-banner">
                    ⚠️ <strong>Important:</strong> As this involves a child, please ensure a parent/guardian is present. Under POCSO Act, reporting is mandatory.
                  </div>
                )}
              </div>
              <div className="report-start-actions">
                <Link className="primary-cta" to="/report/describe" id="describe-incident-link">
                  Describe incident <span aria-hidden="true">→</span>
                </Link>
                <Link className="text-link" to="/dashboard">View dashboard</Link>
              </div>
            </div>

            <section className="report-choice-grid" aria-label="What AWAAZ helps with">
              <article>
                <span>01</span>
                <strong>🎤 Voice or Type</strong>
                <p>Speak or write — your story, your pace.</p>
              </article>
              <article>
                <span>02</span>
                <strong>🔍 AI Analysis</strong>
                <p>Extract facts, verify details against your story.</p>
              </article>
              <article>
                <span>03</span>
                <strong>📎 Evidence + OCR</strong>
                <p>Scan images, catalog screenshots and documents.</p>
              </article>
              <article>
                <span>04</span>
                <strong>⚖️ Route to Right Authority</strong>
                <p>Domain-specific complaint format for the right dept.</p>
              </article>
              <article>
                <span>05</span>
                <strong>🏛️ Govt Portal Links</strong>
                <p>Direct links to official filing portals.</p>
              </article>
              <article>
                <span>06</span>
                <strong>📄 Draft &amp; Export</strong>
                <p>Authority-specific draft you can edit and download.</p>
              </article>
            </section>
          </>
        )}
      </section>
    </FlowFrame>
  );
}
