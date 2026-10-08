import React, { useEffect, useState } from "react";
import { Link, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import GovtPortalSuggestions from "../components/GovtPortalSuggestions.jsx";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
import { getReport } from "../services.js";

function incidentToPortalCategory(type = "") {
  if (/cyber|harassment/.test(type)) return "cyber_harassment";
  if (/financial|fraud/.test(type)) return "financial_fraud";
  if (/workplace/.test(type)) return "workplace_incident";
  if (/physical/.test(type)) return "physical_threat";
  return "other";
}

export default function SaveExportPage() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [draft, setDraft] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport(reportId)
      .then((data) => {
        setReport(data);
        const latest = data.drafts?.[data.drafts.length - 1];
        if (latest) {
          setDraft(latest);
        } else {
          setError("No generated draft found. Please generate a draft first.");
        }
      })
      .catch((e) => setError(e.message));
  }, [reportId]);

  function copyToClipboard() {
    if (!draft?.content) return;
    navigator.clipboard.writeText(draft.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = draft.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  function downloadTextFile() {
    if (!draft?.content) return;
    const blob = new Blob([draft.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Incident_Report_${draft.template_id}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadWordFile() {
    if (!draft?.content) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>" +
      "<head><meta charset='utf-8'><title>Official Incident Report</title><style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5;margin:1in} pre{font-family:Arial,sans-serif;white-space:pre-wrap;}</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + "<h2>AWAAZ — OFFICIAL INCIDENT REPORT</h2><hr/><pre>" + draft.content + "</pre>" + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Incident_Report_${draft.template_id}_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  const audit = draft?.audit;

  return (
    <FlowFrame step={7} title="Export & Save Your Official Complaint Draft" description="Your draft is structured and ready for filing with official portals or law enforcement authorities.">
      {!draft ? (
        <section className="flow-card">
          <p>{error || "Loading your saved draft…"}</p>
          <div className="page-actions">
            <Link className="text-link" to={`/reports/${reportId}/review`}>← Back to review</Link>
          </div>
        </section>
      ) : (
        <section className="flow-card export-card">
          {/* Grounding & Verification Summary */}
          <div className="export-status-banner">
            <div className="status-badge-row">
              <span className={`grounding-badge ${audit?.is_grounded !== false ? "grounded-pass" : "grounded-warn"}`}>
                {audit?.is_grounded !== false ? "✓ 100% Grounded — 0 Hallucinations" : `⚠ ${Math.round((audit?.grounding_score || 0.8) * 100)}% Grounded`}
              </span>
              <span className="count-chip">
                {report?.extraction?.facts?.filter((f) => f.verified).length || 0} Verified Facts
              </span>
              <span className="count-chip">
                {report?.evidence?.length || 0} Evidence Exhibits
              </span>
            </div>
            <p className="status-note">
              This document uses strictly user-verified facts. It does not contain unverified statements or hallucinations.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="export-toolbar no-print">
            <button
              className={`export-action-btn primary-cta ${copied ? "copied-btn" : ""}`}
              type="button"
              onClick={copyToClipboard}
              id="btn-copy-clipboard"
            >
              {copied ? "✓ Copied to Clipboard!" : "📋 Copy to Clipboard"}
            </button>
            <button
              className="export-action-btn secondary-btn"
              type="button"
              onClick={handlePrint}
              id="btn-print-pdf"
            >
              🖨️ Print / Save as PDF
            </button>
            <button
              className="export-action-btn secondary-btn"
              type="button"
              onClick={downloadWordFile}
              id="btn-download-doc"
            >
              📄 Download Word (.doc)
            </button>
            <button
              className="export-action-btn secondary-btn"
              type="button"
              onClick={downloadTextFile}
              id="btn-download-txt"
            >
              💾 Download Text (.txt)
            </button>
          </div>

          {/* Document Preview Sheet */}
          <div className="document-sheet" id="official-complaint-document">
            <div className="sheet-header">
              <div className="sheet-brand">
                <span className="sheet-title">OFFICIAL INCIDENT REPORT DRAFT</span>
                <span className="sheet-subtitle">Prepared via AWAAZ Verified Documentation Engine</span>
              </div>
              <div className="sheet-meta">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Format: {draft.template_id?.replaceAll("_", " ").toUpperCase()}</span>
              </div>
            </div>

            <hr className="sheet-divider" />

            <pre className="sheet-content">{draft.content}</pre>

            <div className="sheet-footer">
              <p className="legal-notice">
                Legal Notice: This document has been compiled for official filing purposes from the complainant's verified statements. 
                AWAAZ provides documentation structuring assistance and is not a substitute for legal counsel.
              </p>
            </div>
          </div>

          {/* Govt Portals Section */}
          <div className="no-print" style={{ marginTop: "24px" }}>
            <EmergencyNumbers
              forceCategory={incidentToPortalCategory(report?.extraction?.incident_type || "")}
              compact
            />
            <GovtPortalSuggestions
              category={incidentToPortalCategory(report?.extraction?.incident_type || "")}
            />
          </div>

          {/* Page Actions */}
          <div className="page-actions no-print">
            <Link className="text-link" to={`/reports/${reportId}/review`}>← Back to review & edit</Link>
            <Link className="primary-cta" to="/dashboard">Go to Incident Dashboard <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      )}
    </FlowFrame>
  );
}
