import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import GovtPortalSuggestions from "../components/GovtPortalSuggestions.jsx";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
import { getReport, getRoutes } from "../services.js";

function templateFor(name = "") {
  const value = name.toLowerCase();
  if (value.includes("workplace")) return "workplace_report";
  if (value.includes("bank") || value.includes("payment") || value.includes("financial")) return "financial_incident";
  if (value.includes("cyber")) return "cyber_incident";
  return "police_report";
}

// Map route names / incident types to portal categories
function portalCategory(routeName = "", incidentType = "") {
  const v = (routeName + " " + incidentType).toLowerCase();
  if (/cyber|online|social|hack|stalk|harassment/.test(v)) return "cyber_harassment";
  if (/financial|fraud|upi|bank|payment|scam/.test(v)) return "financial_fraud";
  if (/workplace|employer|hr|office/.test(v)) return "workplace_incident";
  if (/physical|assault|threat|domestic|violence/.test(v)) return "physical_threat";
  return "other";
}

const ROUTE_ICONS = {
  "Cyber Crime Cell": "🛡️",
  "Local Police Station": "🚔",
  "Bank / Financial Authority": "🏦",
  "Women's Cell": "👩",
  "HR / Internal Complaint Committee": "🏢",
  "Consumer Forum": "🛒",
};

export default function RecommendationPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [showPortals, setShowPortals] = useState(false);

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

  const incidentType = report?.extraction?.incident_type || "";
  const selectedRoute = routes.find((r) => r.name === selected);
  const category = portalCategory(selected, incidentType);

  return (
    <FlowFrame step={4} title="Authority recommendation" description="Suggested authorities based on your incident type. Review carefully — you decide where to report.">
      {!report ? <p>{error || "Loading recommendations…"}</p> : <>

        <div className="notice-box">
          <strong>Guidance, not a determination</strong>
          <p>AWAAZ cannot decide jurisdiction or provide legal advice. You choose whether to use any suggestion.</p>
        </div>

        {/* Emergency helplines */}
        <EmergencyNumbers narrative={report.narrative || ""} forceCategory={
          incidentType === "cyber_harassment" ? "cyber_harassment" :
          incidentType === "financial_fraud" ? "financial_fraud" :
          incidentType === "workplace_incident" ? "workplace_incident" :
          incidentType === "physical_threat" ? "physical_threat" : null
        } compact />

        {/* Route options */}
        <section className="flow-card route-card">
          <div className="panel-heading">
            <div>
              <span className="mini-label">SUGGESTED AUTHORITIES</span>
              <h2>Where to report</h2>
            </div>
            <span className="count-chip">{routes.length} options</span>
          </div>

          <ul className="route-list route-options">
            {routes.map((route) => (
              <li
                className={`route-item${selected === route.name ? " route-selected" : ""}`}
                key={route.name}
              >
                <label>
                  <input
                    type="radio"
                    name="route"
                    checked={selected === route.name}
                    onChange={() => setSelected(route.name)}
                  />
                  <span className="route-icon">{ROUTE_ICONS[route.name] || "⚖️"}</span>
                  <div className="route-label-block">
                    <strong>{route.name}</strong>
                    {route.primary && <em className="route-primary-tag">Suggested starting point</em>}
                    <p>{route.reason}</p>
                    <small>{route.caveat}</small>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Domain-specific complaint format info */}
        {selectedRoute && (
          <div className="domain-format-card">
            <span className="mini-label">📋 COMPLAINT FORMAT FOR THIS AUTHORITY</span>
            <DomainFormatGuide routeName={selected} incidentType={incidentType} />
          </div>
        )}

        {/* Govt portals toggle */}
        <div className="portals-toggle-row">
          <button
            type="button"
            className={`tab-btn${showPortals ? " tab-btn--active" : ""}`}
            onClick={() => setShowPortals((v) => !v)}
            id="show-portals-btn"
          >
            🏛️ {showPortals ? "Hide" : "Show"} Official Govt Portals
          </button>
        </div>

        {showPortals && <GovtPortalSuggestions category={category} />}

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="page-actions">
          <Link className="text-link" to={`/reports/${reportId}/summary`}>← Back to summary</Link>
          <button className="primary-cta" type="button" disabled={!selected} onClick={continueToDraft} id="continue-draft-btn">
            Continue to draft <span aria-hidden="true">→</span>
          </button>
        </div>
      </>}
    </FlowFrame>
  );
}

function DomainFormatGuide({ routeName = "", incidentType = "" }) {
  const v = (routeName + " " + incidentType).toLowerCase();

  if (/cyber/.test(v)) return (
    <div className="domain-format-content">
      <h4>🛡️ Cyber Crime Complaint Format</h4>
      <ol>
        <li>Visit <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a> or nearest Cyber Crime Cell</li>
        <li>Select category: <em>Online Fraud / Cyber Harassment / Hacking</em></li>
        <li>Provide: Account IDs of perpetrator, screenshots (as exhibits), timeline of events, financial losses (if any)</li>
        <li>Complaint number issued immediately; case assigned within 3 working days</li>
        <li>Track status at: cybercrime.gov.in/Home/Index</li>
      </ol>
    </div>
  );

  if (/financial|bank|payment/.test(v)) return (
    <div className="domain-format-content">
      <h4>🏦 Financial Fraud Complaint Format</h4>
      <ol>
        <li><strong>First 24 hours:</strong> Call 1930 immediately to block fraudulent transaction</li>
        <li>File at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a> → Financial Fraud category</li>
        <li>Provide: Bank account details, UPI transaction ID / reference, SMS screenshots, amount lost, date-time</li>
        <li>Simultaneously file complaint with your bank's grievance officer</li>
        <li>Escalate to RBI Ombudsman (14448) if bank doesn't respond in 30 days</li>
      </ol>
    </div>
  );

  if (/workplace|hr/.test(v)) return (
    <div className="domain-format-content">
      <h4>🏢 Workplace Complaint Format (POSH Act)</h4>
      <ol>
        <li>Submit written complaint to Internal Complaints Committee (ICC) within <strong>3 months</strong> of incident</li>
        <li>If no ICC exists, file with Local Complaints Committee (LCC) of district</li>
        <li>For government employees: file with Sexual Harassment Electronic Box (<a href="https://shebox.nic.in" target="_blank" rel="noreferrer">SHe-Box</a>)</li>
        <li>Include: Dates, description of each incident, witnesses (optional), any communication records</li>
        <li>ICC must complete inquiry within 90 days</li>
      </ol>
    </div>
  );

  if (/police|physical|women/.test(v)) return (
    <div className="domain-format-content">
      <h4>🚔 Police / FIR Format</h4>
      <ol>
        <li>Visit nearest police station or use state police's online FIR portal</li>
        <li>Request a <strong>First Information Report (FIR)</strong> — police are legally obligated to register it</li>
        <li>Include: Incident description (who, what, when, where), any physical evidence, witness names if known</li>
        <li>Get a copy of the FIR with FIR number — keep it safe</li>
        <li>If police refuse to register FIR, approach Superintendent of Police or file complaint at Magistrate Court</li>
      </ol>
    </div>
  );

  return (
    <div className="domain-format-content">
      <h4>📋 General Complaint Format</h4>
      <ol>
        <li>Identify the appropriate authority based on incident type</li>
        <li>Include: Full description, dates, evidence references, and your contact details</li>
        <li>Make a copy of everything before submission</li>
        <li>Get an acknowledgement receipt with complaint number</li>
      </ol>
    </div>
  );
}
