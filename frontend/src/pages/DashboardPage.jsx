import React from "react";
import { Link } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";

export default function DashboardPage() {
  return (
    <FlowFrame step={0} title="Your dashboard is coming next" description="Saved report history and user accounts are not included in this local hackathon prototype.">
      <section className="flow-card dashboard-empty">
        <span className="dashboard-icon" aria-hidden="true">A</span>
        <p>For now, a report lives only in the current backend session. Start a new report whenever you’re ready.</p>
        <Link className="primary-cta" to="/report">Report an incident <span aria-hidden="true">→</span></Link>
      </section>
    </FlowFrame>
  );
}
