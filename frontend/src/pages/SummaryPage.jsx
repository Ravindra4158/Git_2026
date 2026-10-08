import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { answerFollowUp, getReport, verifyFact } from "../services.js";

export default function SummaryPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { getReport(reportId).then(setReport).catch((e) => setError(e.message)); }, [reportId]);

  const [editingFactId, setEditingFactId] = useState(null);
  const [editingFactValue, setEditingFactValue] = useState("");

  async function toggleFact(fact, verified) {
    setError("");
    try { setReport(await verifyFact(reportId, fact.id, verified)); }
    catch (e) { setError(e.message); }
  }

  function startEditFact(fact) {
    setEditingFactId(fact.id);
    setEditingFactValue(fact.value);
  }

  async function saveEditFact(fact) {
    if (!editingFactValue.trim()) return;
    setError("");
    try {
      setReport(await verifyFact(reportId, fact.id, fact.verified, editingFactValue.trim()));
      setEditingFactId(null);
    } catch (e) { setError(e.message); }
  }

  async function answer(item, customValue = null) {
    const value = customValue !== null ? customValue : (answers[item.field] || "").trim();
    if (!value) return;
    setBusy(item.field); setError("");
    try {
      setReport(await answerFollowUp(reportId, item.field, value));
      setAnswers((current) => ({ ...current, [item.field]: "" }));
    } catch (e) { setError(e.message); }
    finally { setBusy(""); }
  }

  return (
    <FlowFrame step={3} title="Review your incident summary" description="Check each extracted detail against your story. Only verified facts can be used in a draft.">
      {!report ? <p>Loading your report…</p> : <>
        <section className="flow-card">
          <div className="panel-heading"><div><span className="mini-label">INCIDENT TYPE</span><h2>{report.extraction?.incident_type.replaceAll("_", " ") || "Not analyzed"}</h2></div><span className="count-chip">{report.extraction?.facts.length || 0} details</span></div>
          {report.extraction?.facts.length ? (
            <ul className="fact-list">
              {report.extraction.facts.map((fact) => {
                const isEditing = editingFactId === fact.id;
                return (
                  <li className="fact-row" key={fact.id}>
                    <div className="fact-copy">
                      <span>{fact.field.replaceAll("_", " ")}</span>
                      {!isEditing ? (
                        <strong>{fact.value}</strong>
                      ) : (
                        <div className="fact-edit-box">
                          <input
                            className="edit-input-field"
                            value={editingFactValue}
                            onChange={(e) => setEditingFactValue(e.target.value)}
                            maxLength={500}
                          />
                          <button
                            type="button"
                            className="small-action-btn save-btn"
                            onClick={() => saveEditFact(fact)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="text-link"
                            onClick={() => setEditingFactId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      <blockquote>“{fact.source_snippet}”</blockquote>
                    </div>
                    <div className="fact-actions-col">
                      <label className="verify-control">
                        <input
                          type="checkbox"
                          checked={fact.verified}
                          onChange={(event) => toggleFact(fact, event.target.checked)}
                        />
                        Verified
                      </label>
                      {!isEditing && (
                        <button
                          type="button"
                          className="fact-edit-toggle-btn"
                          onClick={() => startEditFact(fact)}
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted-copy">No source-linked details were extracted. You can go back and try again.</p>
          )}
        </section>
        <section className="flow-card">
          <div className="panel-heading"><div><span className="mini-label">OPTIONAL DETAILS</span><h2>Would you like to add anything?</h2></div><span className="count-chip">{report.missing_information.length} prompts</span></div>
          <p className="muted-copy">These questions help organize your account. They are optional, not legal requirements.</p>
          {report.missing_information.map((item) => (
            <div className="question-row" key={item.field}>
              <strong>{item.question}</strong>
              <p>{item.reason}</p>
              <div className="answer-controls">
                <input
                  value={answers[item.field] || ""}
                  onChange={(event) => setAnswers((current) => ({ ...current, [item.field]: event.target.value }))}
                  placeholder="Add a detail, if you know it"
                  maxLength={1000}
                />
                <button
                  type="button"
                  disabled={busy === item.field || !(answers[item.field] || "").trim()}
                  onClick={() => answer(item)}
                >
                  {busy === item.field ? "Saving…" : "Add detail"}
                </button>
                <button
                  type="button"
                  className="secondary-btn idontknow-btn"
                  disabled={busy === item.field}
                  onClick={() => answer(item, "Unknown / Not available")}
                >
                  I don't know
                </button>
              </div>
            </div>
          ))}
        </section>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/analysis`}>← Back to analysis</Link><Link className="text-link" to={`/reports/${reportId}/evidence`}>Add evidence notes</Link><button className="primary-cta" type="button" onClick={() => navigate(`/reports/${reportId}/recommendation`)}>Continue to authority recommendation <span aria-hidden="true">→</span></button></div>
      </>}
    </FlowFrame>
  );
}
