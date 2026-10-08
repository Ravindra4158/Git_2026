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

  async function toggleFact(fact, verified) {
    setError("");
    try { setReport(await verifyFact(reportId, fact.id, verified)); }
    catch (e) { setError(e.message); }
  }

  async function answer(item) {
    const value = (answers[item.field] || "").trim();
    if (!value) return;
    setBusy(item.field); setError("");
    try {
      setReport(await answerFollowUp(reportId, item.field, value));
      setAnswers((current) => ({ ...current, [item.field]: "" }));
    } catch (e) { setError(e.message); }
    finally { setBusy(""); }
  }

  return (
    <FlowFrame step={2} title="Review your incident summary" description="Check each extracted detail against your story. Only verified facts can be used in a draft.">
      {!report ? <p>Loading your report…</p> : <>
        <section className="flow-card">
          <div className="panel-heading"><div><span className="mini-label">INCIDENT TYPE</span><h2>{report.extraction?.incident_type.replaceAll("_", " ") || "Not analyzed"}</h2></div><span className="count-chip">{report.extraction?.facts.length || 0} details</span></div>
          {report.extraction?.facts.length ? <ul className="fact-list">{report.extraction.facts.map((fact) => <li className="fact-row" key={fact.id}><div className="fact-copy"><span>{fact.field.replaceAll("_", " ")}</span><strong>{fact.value}</strong><blockquote>“{fact.source_snippet}”</blockquote></div><label className="verify-control"><input type="checkbox" checked={fact.verified} onChange={(event) => toggleFact(fact, event.target.checked)} /> Verified</label></li>)}</ul> : <p className="muted-copy">No source-linked details were extracted. You can go back and try again.</p>}
        </section>
        <section className="flow-card">
          <div className="panel-heading"><div><span className="mini-label">OPTIONAL DETAILS</span><h2>Would you like to add anything?</h2></div><span className="count-chip">{report.missing_information.length} prompts</span></div>
          <p className="muted-copy">These questions help organize your account. They are optional, not legal requirements.</p>
          {report.missing_information.map((item) => <div className="question-row" key={item.field}><strong>{item.question}</strong><p>{item.reason}</p><div className="answer-controls"><input value={answers[item.field] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [item.field]: event.target.value }))} placeholder="Add a detail, if you know it" maxLength={1000} /><button type="button" disabled={busy === item.field || !(answers[item.field] || "").trim()} onClick={() => answer(item)}>{busy === item.field ? "Saving…" : "Add detail"}</button></div></div>)}
        </section>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/analysis`}>← Back to analysis</Link><button className="primary-cta" type="button" onClick={() => navigate(`/reports/${reportId}/evidence`)}>Continue to evidence notes <span aria-hidden="true">→</span></button></div>
      </>}
    </FlowFrame>
  );
}
