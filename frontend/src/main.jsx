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
  const [draftTemplate, setDraftTemplate] = useState("cyber_incident");
  const [draft, setDraft] = useState(null);
  const [savedDraftContent, setSavedDraftContent] = useState("");
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

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
      setDraft(null);
      setSavedDraftContent("");
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

  async function generateDraft() {
    if (!report) return;
    setError("");
    setGeneratingDraft(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: draftTemplate }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not generate this draft.");
      setDraft(data);
      setSavedDraftContent(data.content);
      setReport((previous) => ({ ...previous, drafts: [...(previous?.drafts || []), data] }));
    } catch (requestError) {
      setError(requestError.message || "Could not generate this draft.");
    } finally {
      setGeneratingDraft(false);
    }
  }

  async function saveDraft() {
    if (!report || !draft) return;
    setError("");
    setSavingDraft(true);
    try {
      const response = await fetch(`http://localhost:8000/api/reports/${report.id}/drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft.content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not save your edits.");
      setDraft(data);
      setSavedDraftContent(data.content);
      setReport((previous) => ({ ...previous, drafts: previous.drafts.map((item) => item.id === data.id ? data : item) }));
    } catch (requestError) {
      setError(requestError.message || "Could not save your edits.");
    } finally {
      setSavingDraft(false);
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
            <button className="preset" key={preset.name} type="button" onClick={() => { setNarrative(preset.story); setReport(null); setAnalysis(null); setDraft(null); setSavedDraftContent(""); setError(""); }}>
              <span className="preset-icon">＋</span>{preset.name}
            </button>
          ))}
        </div>

        <form onSubmit={startReport}>
          <label className="sr-only" htmlFor="narrative">Describe what happened</label>
          <textarea
            id="narrative"
            value={narrative}
            onChange={(event) => { setNarrative(event.target.value); setReport(null); setAnalysis(null); setDraft(null); setSavedDraftContent(""); }}
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
                <section className="analysis-card timeline-card" aria-labelledby="timeline-heading">
                  <div className="analysis-header">
                    <div><span className="step-label">TIMELINE <span>FROM YOUR STORY</span></span><h3 id="timeline-heading">Incident timeline</h3></div>
                    <span className="type-pill">{report.timeline.length} events</span>
                  </div>
                  <p className="section-hint">Dates are shown as stated. Unknown dates stay unknown; events stay in story order when the chronology is unclear. Review the sequence.</p>
                  {report.timeline.length ? (
                    <ol className="timeline-list">
                      {report.timeline.map((event) => (
                        <li key={event.id}>
                          <span className="timeline-date">{event.date_text.toLowerCase() === "unknown" ? "Date not stated" : event.date_text}</span>
                          <div className="timeline-event"><strong>{event.description}</strong><blockquote>“{event.source_snippet}”</blockquote><span className="review-tag">Needs review</span></div>
                        </li>
                      ))}
                    </ol>
                  ) : <p className="empty-facts">No timeline events were extracted from the story.</p>}
                </section>
                <section className="analysis-card routes-card" aria-labelledby="routes-heading">
                  <div className="analysis-header">
                    <div><span className="step-label">ROUTE GUIDANCE <span>GENERAL</span></span><h3 id="routes-heading">Places you may consider contacting</h3></div>
                    <span className="type-pill">{report.recommended_routes.length} options</span>
                  </div>
                  <p className="section-hint">These are general starting points based on the selected incident category, not legal advice or a jurisdiction decision.</p>
                  {report.recommended_routes.length ? (
                    <ul className="route-list">
                      {report.recommended_routes.map((route) => (
                        <li key={route.name}>
                          <div className="route-title"><strong>{route.name}</strong>{route.primary && <span>Suggested starting point</span>}</div>
                          <p>{route.reason}</p><small>{route.caveat}</small>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="empty-facts">No route suggestions are available.</p>}
                </section>
                <section className="analysis-card draft-card" aria-labelledby="draft-heading">
                  <div className="analysis-header">
                    <div><span className="step-label">DRAFT GENERATOR</span><h3 id="draft-heading">Prepare an editable report</h3></div>
                    <span className="type-pill">{analysis.facts.filter((fact) => fact.verified).length} verified facts</span>
                  </div>
                  <p className="section-hint">Only facts you marked verified are included. Unknown details remain placeholders.</p>
                  <div className="draft-controls">
                    <label htmlFor="draft-template">Report format</label>
                    <select id="draft-template" value={draftTemplate} onChange={(event) => setDraftTemplate(event.target.value)}>
                      <option value="cyber_incident">Cyber incident report</option>
                      <option value="police_report">Police report</option>
                      <option value="financial_incident">Financial incident report</option>
                      <option value="workplace_report">Workplace report</option>
                    </select>
                    <button className="analyze-button" type="button" disabled={!analysis.facts.some((fact) => fact.verified) || generatingDraft} onClick={generateDraft}>
                      {generatingDraft ? "Preparing…" : "Generate draft"}<span aria-hidden="true">→</span>
                    </button>
                  </div>
                  {draft && (
                    <div className="draft-editor">
                      <div className="draft-editor-heading"><strong>{draft.template_id.replaceAll("_", " ")} draft</strong><span>Review before use</span></div>
                      <textarea aria-label="Editable incident report draft" value={draft.content} maxLength={20000} onChange={(event) => setDraft((previous) => ({ ...previous, content: event.target.value }))} />
                      <div className="draft-save-row">
                        <span>{draft.content === savedDraftContent ? "All changes saved" : "Unsaved edits"}</span>
                        <button className="submit-button" type="button" disabled={draft.content === savedDraftContent || savingDraft} onClick={saveDraft}>
                          {savingDraft ? "Saving…" : "Save edits"}<span aria-hidden="true">✓</span>
                        </button>
                      </div>
                    </div>
                  )}
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
