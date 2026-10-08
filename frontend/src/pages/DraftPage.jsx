import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { createDraft, getReport } from "../services.js";

export default function DraftPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [template, setTemplate] = useState("cyber_incident");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport(reportId).then(setReport).catch((e) => setError(e.message));
    setTemplate(sessionStorage.getItem(`awaaz-template-${reportId}`) || "cyber_incident");
  }, [reportId]);

  async function generate() {
    setBusy(true); setError("");
    try {
      await createDraft(reportId, template);
      navigate(`/reports/${reportId}/review`);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <FlowFrame step={5} title="Prepare an authority-specific draft" description="Choose a simple report format. AWAAZ will use only the details you marked verified.">
      {!report ? <p>{error || "Loading your report…"}</p> : <section className="flow-card">
        <label className="field-label" htmlFor="report-template">Report format</label>
        <select className="form-select" id="report-template" value={template} onChange={(event) => setTemplate(event.target.value)}>
          <option value="cyber_incident">Cyber incident report</option><option value="police_report">Police report</option><option value="financial_incident">Financial incident report</option><option value="workplace_report">Workplace report</option>
        </select>
        <div className="notice-box"><strong>{report.extraction?.facts.filter((fact) => fact.verified).length || 0} verified facts will be included</strong><p>Unknown details will remain placeholders. Evidence notes are not treated as verified facts.</p></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/recommendation`}>← Change authority</Link><button className="primary-cta" type="button" disabled={busy || !report.extraction?.facts.some((fact) => fact.verified)} onClick={generate}>{busy ? "Preparing…" : "Generate draft"}<span aria-hidden="true">→</span></button></div>
      </section>}
    </FlowFrame>
  );
}
