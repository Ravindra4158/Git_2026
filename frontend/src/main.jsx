import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const presets = [
  {
    name: "Online harassment",
    story:
      "For about two weeks, someone has been messaging me on Instagram and threatening to share private photos. After I blocked the first account, another account contacted me. I have saved screenshots.",
  },
  {
    name: "Payment scam",
    story:
      "Yesterday afternoon I received a text about an electricity bill and followed a payment link. After I entered my UPI PIN, money was taken from my account. I have the bank message but need to find the transaction reference.",
  },
  {
    name: "Workplace incident",
    story:
      "My supervisor has repeatedly contacted me late at night on WhatsApp for personal conversations. When I asked to keep messages work-related, they said it could affect my performance review.",
  },
];

function App() {
  const [narrative, setNarrative] = useState("");
  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [evidenceType, setEvidenceType] = useState("screenshot");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceSource, setEvidenceSource] = useState("");
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [answers, setAnswers] = useState({});
  const [savingAnswer, setSavingAnswer] = useState("");

  async function startReport(event) {
    event.preventDefault();
    setError("");
    setReport(null);
    setSaving(true);
    try {
      const response = await fetch("http://localhost:8000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ narrative: narrative.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not start your report.");
      setReport(data);
      setAnalysis(null);
    } catch {
      setError("Could not reach the API. Start the backend, then try again.");
    } finally {
      setSaving(false);
    }
  }

  async function analyzeReport() {
    if (!report) return;
    setError("");
    setAnalyzing(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/analyze`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not analyze this story.");
      setReport(data);
      setAnalysis(data.extraction);
    } catch (requestError) {
      setError(requestError.message || "Could not reach the API. Start the backend, then try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function setFactVerification(factId, verified) {
    if (!report) return;
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/facts/${factId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not update fact review.");
      setReport(data);
      setAnalysis(data.extraction);
    } catch (requestError) {
      setError(requestError.message || "Could not update fact review.");
    }
  }

  async function addEvidence() {
    if (!report || !evidenceDescription.trim()) return;
    setError("");
    setSavingEvidence(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: evidenceType,
          description: evidenceDescription.trim(),
          source: evidenceSource.trim() || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not add this evidence note.");
      setReport(data);
      setAnalysis(data.extraction);
      setEvidenceDescription("");
      setEvidenceSource("");
    } catch (requestError) {
      setError(requestError.message || "Could not add this evidence note.");
    } finally {
      setSavingEvidence(false);
    }
  }

  async function removeEvidence(evidenceId) {
    if (!report) return;
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/evidence/${evidenceId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not remove this evidence note.");
      setReport(data);
      setAnalysis(data.extraction);
    } catch (requestError) {
      setError(requestError.message || "Could not remove this evidence note.");
    }
  }

  async function submitAnswer(field) {
    const answer = (answers[field] || "").trim();
    if (!report || !answer) return;
    setError("");
    setSavingAnswer(field);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/answers/${encodeURIComponent(field)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not save this answer.");
      setReport(data);
      setAnalysis(data.extraction);
      setAnswers((previous) => ({ ...previous, [field]: "" }));
    } catch (requestError) {
      setError(requestError.message || "Could not save this answer.");
    } finally {
      setSavingAnswer("");
    }
  }

  return (
    <main className="page-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="ReportFlow home">
          <span className="brand-mark">R</span> reportflow
        </a>
        <span className="topbar-note"><span className="status-dot" /> Local draft space</span>
      </nav>

      <section className="intro" id="top">
        <p className="eyebrow">INCIDENT REPORT PREPARATION</p>
        <h1>Start with what<br />happened.</h1>
        <p className="intro-copy">Tell the story in your own words. You can organize the details before deciding what to do next.</p>
      </section>

      <section className="workspace" aria-labelledby="story-heading">
        <div className="section-heading">
          <div>
            <span className="step-label">STEP 01 <span>OF 01</span></span>
            <h2 id="story-heading">Your incident story</h2>
          </div>
          <span className="optional-tag">You can leave out names</span>
        </div>

        <div className="presets" aria-label="Sample stories">
          <span className="presets-label">TRY A SAMPLE</span>
          {presets.map((preset) => (
            <button className="preset" key={preset.name} type="button" onClick={() => { setNarrative(preset.story); setReport(null); setAnalysis(null); setError(""); }}>
              <span className="preset-icon">＋</span>{preset.name}
            </button>
          ))}
        </div>

        <form onSubmit={startReport}>
          <label className="sr-only" htmlFor="narrative">Describe what happened</label>
          <textarea
            id="narrative"
            value={narrative}
            onChange={(event) => { setNarrative(event.target.value); setReport(null); setAnalysis(null); }}
            placeholder="Start wherever feels easiest. What happened? When did it happen? Is there anything you want help organizing?"
            maxLength={20000}
            required
          />
          <div className="input-footer">
            <span>Your words stay yours. You can review everything before using it.</span>
            <span>{narrative.length.toLocaleString()} / 20,000</span>
          </div>
          {error && <p className="message error" role="alert">{error}</p>}
            {report && (
              <div className="message success" role="status">
                <span className="success-icon">✓</span>
                <div><strong>Your report is ready for analysis</strong><p>Report ID: <code>{report.id}</code>. Facts stay unverified until you review them.</p></div>
              </div>
            )}
            {report && !analysis && (
              <div className="analysis-action">
                <button className="analyze-button" type="button" disabled={analyzing} onClick={analyzeReport}>
                  {analyzing ? "Extracting facts…" : "Extract facts for review"}<span aria-hidden="true">→</span>
                </button>
                <p className="analysis-disclosure">Using this sends your story to the AI provider configured by the project. Use synthetic examples for demos.</p>
              </div>
            )}
            {analysis && (
              <>
                <section className="analysis-card" aria-labelledby="analysis-heading">
                  <div className="analysis-header">
                    <div><span className="step-label">AI EXTRACTION <span>REVIEW REQUIRED</span></span><h3 id="analysis-heading">Details found in your story</h3></div>
                    <span className="type-pill">{analysis.incident_type.replaceAll("_", " ")}</span>
                  </div>
                  {analysis.facts.length === 0 ? (
                    <p className="empty-facts">No source-linked facts were returned. You can keep your original story as-is.</p>
                  ) : (
                    <ul className="fact-list">
                      {analysis.facts.map((fact) => (
                        <li className="fact-row" key={fact.id}>
                          <div className="fact-copy"><span>{fact.field.replaceAll("_", " ")}</span><strong>{fact.value}</strong><blockquote>“{fact.source_snippet}”</blockquote></div>
                          <label className="verify-control"><input type="checkbox" checked={fact.verified} onChange={(event) => setFactVerification(fact.id, event.target.checked)} /> Verified</label>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="analysis-note">AI may make mistakes. Check each detail against your account before using it.</p>
                </section>
                <section className="analysis-card missing-card" aria-labelledby="missing-heading">
                  <div className="analysis-header">
                    <div><span className="step-label">OPTIONAL DETAILS</span><h3 id="missing-heading">You may want to add</h3></div>
                    <span className="type-pill">{report.missing_information.length} prompts</span>
                  </div>
                  <p className="section-hint">These prompts help organize your account. They are optional and are not legal requirements.</p>
                  {report.missing_information.length ? (
                    <ul className="missing-list">
                      {report.missing_information.map((item) => (
                        <li key={item.field}>
                          <strong>{item.question}</strong><span>{item.reason}</span>
                          <div className="answer-controls">
                            <input
                              value={answers[item.field] || ""}
                              onChange={(event) => setAnswers((previous) => ({ ...previous, [item.field]: event.target.value }))}
                              maxLength={1000}
                              placeholder="Add a detail, if you know it"
                              aria-label={`Answer: ${item.question}`}
                            />
                            <button type="button" disabled={!(answers[item.field] || "").trim() || savingAnswer === item.field} onClick={() => submitAnswer(item.field)}>
                              {savingAnswer === item.field ? "Saving…" : "Add detail"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="empty-facts">No suggested details are currently missing.</p>}
                </section>
              </>
            )}
            {report && (
              <section className="analysis-card evidence-card" aria-labelledby="evidence-heading">
                <div className="analysis-header">
                  <div><span className="step-label">EVIDENCE NOTES</span><h3 id="evidence-heading">Keep track of related material</h3></div>
                  <span className="type-pill">{report.evidence.length} items</span>
                </div>
                <p className="section-hint">Add a description or reference only. This phase does not upload or store files.</p>
                <div className="evidence-fields">
                  <label>Type
                    <select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value)}>
                      <option value="screenshot">Screenshot</option>
                      <option value="message">Message</option>
                      <option value="document">Document</option>
                      <option value="url">Link</option>
                      <option value="transaction_reference">Transaction reference</option>
                      <option value="photo_video">Photo or video</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label>Description
                    <input value={evidenceDescription} onChange={(event) => setEvidenceDescription(event.target.value)} maxLength={500} placeholder="For example, screenshot of the message" />
                  </label>
                  <label>Reference (optional)
                    <input value={evidenceSource} onChange={(event) => setEvidenceSource(event.target.value)} maxLength={500} placeholder="File name, URL, or transaction ID" />
                  </label>
                </div>
                <button className="analyze-button" type="button" disabled={!evidenceDescription.trim() || savingEvidence} onClick={addEvidence}>
                  {savingEvidence ? "Adding…" : "Add evidence note"}<span aria-hidden="true">＋</span>
                </button>
                {report.evidence.length > 0 && (
                  <ul className="evidence-list">
                    {report.evidence.map((item) => (
                      <li key={item.id}>
                        <span className="evidence-kind">{item.type.replaceAll("_", " ")}</span>
                        <span className="evidence-description"><strong>{item.description}</strong>{item.source && <small>{item.source}</small>}</span>
                        <button className="remove-button" type="button" onClick={() => removeEvidence(item.id)} aria-label={`Remove ${item.description}`}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          <div className="form-actions">
            <p className="privacy-note"><span aria-hidden="true">◈</span> Phase 1 stores drafts in memory; they clear when the backend stops.</p>
            <button className="submit-button" type="submit" disabled={!narrative.trim() || saving}>
              {saving ? "Starting…" : "Start my report"}<span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>

      <footer className="page-footer">
        <p><strong>ReportFlow</strong> helps organize information for your review. It does not provide legal advice or submit reports.</p>
        <span>MADE FOR GIT JAIPUR 2026</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
