import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { getReport, getRoutes } from "../services.js";

function templateFor(name = "") {
  const value = name.toLowerCase();
  if (value.includes("workplace")) return "workplace_report";
  if (value.includes("bank") || value.includes("payment")) return "financial_incident";
  if (value.includes("cyber")) return "cyber_incident";
  return "police_report";
}

export default function RecommendationPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getReport(reportId), getRoutes(reportId)]).then(([value, options]) => {
      setReport(value); setRoutes(options);
      const prior = sessionStorage.getItem(`awaaz-route-${reportId}`);
      const initial = options.find((item) => item.name === prior) || options.find((item) => item.primary) || options[0];
      if (initial) setSelected(initial.name);
    }).catch((e) => setError(e.message));
  }, [reportId]);

  function continueToDraft() {
    const route = routes.find((item) => item.name === selected);
    sessionStorage.setItem(`awaaz-route-${reportId}`, selected);
    sessionStorage.setItem(`awaaz-template-${reportId}`, templateFor(route?.name));
    navigate(`/reports/${reportId}/draft`);
  }

  return (
    <FlowFrame step={4} title="Consider a reporting route" description="These general suggestions are based on the incident category. Check current official information for your location.">
      {!report ? <p>{error || "Loading recommendations…"}</p> : <>
        <div className="notice-box"><strong>Guidance, not a determination</strong><p>AWAAZ cannot decide jurisdiction or provide legal advice. You choose whether to use any suggestion.</p></div>
        <ul className="route-list route-options">{routes.map((route) => <li className={selected === route.name ? "route-selected" : ""} key={route.name}><label><input type="radio" name="route" checked={selected === route.name} onChange={() => setSelected(route.name)} /><span><strong>{route.name}</strong>{route.primary && <em>Suggested starting point</em>}</span></label><p>{route.reason}</p><small>{route.caveat}</small></li>)}</ul>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="page-actions"><Link className="text-link" to={`/reports/${reportId}/evidence`}>← Back to evidence</Link><button className="primary-cta" type="button" disabled={!selected} onClick={continueToDraft}>Continue to draft <span aria-hidden="true">→</span></button></div>
      </>}
    </FlowFrame>
  );
}
