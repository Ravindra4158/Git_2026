import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { analyzeReport, getReport } from "../services.js";

export default function AnalysisPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport(reportId).then(setReport).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [reportId]);

  async function runAnalysis() {
    setBusy(true); setError("");
    try {
      const result = await analyzeReport(reportId);
      setReport(result);
      navigate(`/reports/${reportId}/summary`);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <FlowFrame step={1} title="AI analysis" description="AWAAZ will organize details from your story and show the source text for each fact.">
      <section className="flow-card">
        {loading ? <p>Loading your report…</p> : <>
          <div className="story-preview"><span>YOUR STORY</span><p>{report?.narrative}</p></div>
          <div className="notice-box"><strong>Before you continue</strong><p>When you choose analysis, this story is sent to the AI provider configured for this demo. Use synthetic stories for demonstrations. The AI may make mistakes.</p></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="page-actions"><Link className="text-link" to="/">← Exit to AWAAZ home</Link><button className="primary-cta" type="button" disabled={busy} onClick={runAnalysis}>{busy ? "Analyzing…" : "Analyze my story"}<span aria-hidden="true">→</span></button></div>
        </>}
      </section>
    </FlowFrame>
  );
}
