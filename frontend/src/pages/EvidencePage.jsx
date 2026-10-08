import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { addEvidence, getReport, removeEvidence } from "../services.js";

export default function EvidencePage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [type, setType] = useState("screenshot");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getReport(reportId).then(setReport).catch((e) => setError(e.message)); }, [reportId]);

  async function addItem() {
    if (!description.trim()) return;
    setBusy(true); setError("");
    try {
      setReport(await addEvidence(reportId, { type, description: description.trim(), source: source.trim() || null }));
      setDescription(""); setSource("");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function deleteItem(id) {
    try { setReport(await removeEvidence(reportId, id)); }
    catch (e) { setError(e.message); }
  }

  return (
    <FlowFrame step={3} title="Keep track of evidence" description="Add optional notes about related material before continuing to authority recommendation.">
      {!report ? <p>Loading your report…</p> : <section className="flow-card">
        <div className="evidence-fields">
          <label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option value="screenshot">Screenshot</option><option value="message">Message</option><option value="document">Document</option><option value="url">Link</option><option value="transaction_reference">Transaction reference</option><option value="photo_video">Photo or video</option><option value="other">Other</option></select></label>
          <label>Description<input value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} placeholder="For example, screenshot of the message" /></label>
          <label>Reference (optional)<input value={source} onChange={(event) => setSource(event.target.value)} maxLength={500} placeholder="File name, URL, or transaction ID" /></label>
        </div>
        <button className="secondary-button" type="button" disabled={!description.trim() || busy} onClick={addItem}>{busy ? "Adding…" : "Add evidence note"}</button>
        {report.evidence.length ? <ul className="evidence-list">{report.evidence.map((item) => <li key={item.id}><span className="evidence-kind">{item.type.replaceAll("_", " ")}</span><span className="evidence-description"><strong>{item.description}</strong>{item.source && <small>{item.source}</small>}</span><button className="remove-button" type="button" onClick={() => deleteItem(item.id)}>Remove</button></li>)}</ul> : <p className="muted-copy">No evidence notes added. You can continue without them.</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/summary`}>← Back to summary</Link><button className="primary-cta" type="button" onClick={() => navigate(`/reports/${reportId}/recommendation`)}>Continue to authority recommendation <span aria-hidden="true">→</span></button></div>
      </section>}
    </FlowFrame>
  );
}
