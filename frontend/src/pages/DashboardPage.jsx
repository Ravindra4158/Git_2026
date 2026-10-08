import React, { useEffect, useState } from "react";
import { Link } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { generateDemoReports, listReports } from "../services.js";

function nextPath(report) {
  if (!report.extraction) return `/reports/${report.id}/analysis`;
  if (!report.extraction.facts.some((fact) => fact.verified)) return `/reports/${report.id}/summary`;
  if (!report.recommended_routes?.length) return `/reports/${report.id}/recommendation`;
  if (!report.drafts?.length) return `/reports/${report.id}/draft`;
  return `/reports/${report.id}/save`;
}

function incidentLabel(report) {
  return report.extraction?.incident_type?.replaceAll("_", " ") || "Not analyzed";
}

export default function DashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      setReports(await listReports());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function seedDemoData() {
    setBusy(true);
    setError("");
    try {
      setReports(await generateDemoReports());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <FlowFrame step={8} title="Dashboard" description="Review reports from this local backend session, open a draft, or generate sample data for testing.">
      <section className="flow-card dashboard-toolbar">
        <div>
          <span className="mini-label">LOCAL SESSION</span>
          <h2>AWAAZ report workspace</h2>
          <p>Demo data is stored in memory and resets when the backend stops.</p>
        </div>
        <div className="dashboard-actions">
          <button className="secondary-button" type="button" disabled={busy} onClick={seedDemoData}>{busy ? "Generating..." : "Generate demo data"}</button>
          <Link className="primary-cta" to="/report">New report <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <p className="muted-copy">Loading reports...</p> : reports.length ? (
        <section className="report-grid" aria-label="Saved reports">
          {reports.map((report) => (
            <article className="report-card" key={report.id}>
              <div className="report-card-top">
                <span className="mini-label">{incidentLabel(report)}</span>
                <span className="count-chip">{report.extraction?.facts?.length || 0} facts</span>
              </div>
              <p>{report.narrative}</p>
              <dl>
                <div><dt>Evidence</dt><dd>{report.evidence?.length || 0}</dd></div>
                <div><dt>Routes</dt><dd>{report.recommended_routes?.length || 0}</dd></div>
                <div><dt>Drafts</dt><dd>{report.drafts?.length || 0}</dd></div>
              </dl>
              <Link
                className="text-link next-link"
                to={nextPath(report)}
                onClick={() => sessionStorage.setItem("awaaz-active-report-id", report.id)}
              >
                Open report <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="flow-card dashboard-empty">
          <span className="dashboard-icon" aria-hidden="true">A</span>
          <p>No reports yet. Start from the report page or generate demo data for testing.</p>
          <button className="primary-cta" type="button" disabled={busy} onClick={seedDemoData}>{busy ? "Generating..." : "Generate demo data"}<span aria-hidden="true">→</span></button>
        </section>
      )}
    </FlowFrame>
  );
}
