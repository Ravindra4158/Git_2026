import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { getReport, updateDraft } from "../services.js";

export default function ReviewPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getReport(reportId).then((report) => {
      const latest = report.drafts[report.drafts.length - 1];
      if (latest) { setDraft(latest); setSaved(latest.content); }
      else setError("Generate a draft before reviewing it.");
    }).catch((e) => setError(e.message));
  }, [reportId]);

  async function save() {
    if (!draft) return;
    setBusy(true); setError("");
    try {
      const updated = await updateDraft(reportId, draft.id, draft.content);
      setDraft(updated); setSaved(updated.content);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <FlowFrame step={6} title="Review and edit your draft" description="Read the draft carefully. Make any changes you need before deciding whether to use it.">
      {draft ? <section className="flow-card">
        <div className="review-banner"><strong>Review every line</strong><span>AWAAZ drafts can contain errors. Confirm details and replace every placeholder.</span></div>
        <textarea className="draft-textarea" aria-label="Editable report draft" value={draft.content} onChange={(event) => setDraft((value) => ({ ...value, content: event.target.value }))} maxLength={20000} />
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/draft`}>← Change format</Link><div className="save-actions"><span>{draft.content === saved ? "All changes saved" : "Unsaved edits"}</span><button className="primary-cta" type="button" disabled={busy || draft.content === saved} onClick={save}>{busy ? "Saving…" : "Save edits"}<span aria-hidden="true">✓</span></button></div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="text-link next-link" type="button" onClick={() => navigate(`/reports/${reportId}/save`)}>Continue to save / download / share →</button>
      </section> : <p>{error || "Loading draft…"}</p>}
    </FlowFrame>
  );
}
