import React from "react";
import { Link, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";

export default function SaveExportPage() {
  const { reportId } = useParams();
  return (
    <FlowFrame step={6} title="Your draft is saved for this session" description="Draft edits are held in the local backend until it stops.">
      <section className="flow-card">
        <div className="notice-box"><strong>Download and sharing are coming next.</strong><p>This hackathon build does not yet create downloadable files or share reports. Keep a copy of any text you need before closing the local app.</p></div>
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/review`}>← Back to review</Link><Link className="primary-cta" to="/dashboard">Open dashboard preview <span aria-hidden="true">→</span></Link></div>
      </section>
    </FlowFrame>
  );
}
