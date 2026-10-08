import React, { useEffect, useRef, useState } from "react";

const GOVT_PORTALS = {
  cyber_harassment: [
    { name: "Cyber Crime Portal", url: "https://cybercrime.gov.in", desc: "National portal for reporting cyber crimes including harassment, stalking, online fraud", icon: "🛡️", dept: "Ministry of Home Affairs" },
    { name: "Social Media Complaint (Meta)", url: "https://www.facebook.com/help/contact/144059062408922", desc: "Report harassment on Facebook/Instagram directly to Meta", icon: "📱", dept: "Platform Grievance" },
    { name: "TRAI Consumer Portal", url: "https://consumerportal.trai.gov.in", desc: "For unsolicited communication or spam calls/messages", icon: "📡", dept: "TRAI" },
    { name: "iGoK Kerala / State Portal", url: "https://www.keralapolice.gov.in/citizen-services", desc: "State-level police cyber cell filing", icon: "🏛️", dept: "State Police" },
  ],
  financial_fraud: [
    { name: "Cyber Crime Portal (Financial)", url: "https://cybercrime.gov.in", desc: "Mandatory for online financial fraud. File within 24 hours for best recovery chances.", icon: "🏦", dept: "Ministry of Home Affairs" },
    { name: "Sachet Portal (RBI)", url: "https://sachet.rbi.org.in", desc: "Report unauthorized banking / illegal collection agents", icon: "🏛️", dept: "Reserve Bank of India" },
    { name: "SEBI SCORES", url: "https://scores.gov.in", desc: "For investment fraud, fake trading platforms, stock scams", icon: "📈", dept: "SEBI" },
    { name: "NPCI UPI Dispute", url: "https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism", desc: "Raise UPI transaction dispute with NPCI", icon: "💳", dept: "NPCI" },
  ],
  workplace_incident: [
    { name: "SHe-Box (Sexual Harassment)", url: "https://shebox.nic.in", desc: "Mandatory portal for workplace sexual harassment complaints under POSH Act 2013", icon: "⚖️", dept: "Ministry of Women & Child" },
    { name: "eSHRAM Portal", url: "https://eshram.gov.in", desc: "For unorganized sector worker grievances", icon: "👷", dept: "Ministry of Labour" },
    { name: "Centralised Public Grievance Portal", url: "https://pgportal.gov.in", desc: "Escalate to senior government officials for unresolved workplace complaints", icon: "🏛️", dept: "DARPG" },
    { name: "Labour Department Grievance", url: "https://labour.gov.in", desc: "State labour commission for employer misconduct", icon: "📋", dept: "Ministry of Labour" },
  ],
  physical_threat: [
    { name: "Police FIR Online", url: "https://eservices.rajpolice.gov.in", desc: "File FIR online with your state police (link varies by state)", icon: "🚔", dept: "State Police" },
    { name: "National Commission for Women", url: "http://ncwapps.nic.in/onlinecomplaint", desc: "For gender-based physical violence and domestic abuse", icon: "👩", dept: "NCW" },
    { name: "POCSO (for minors)", url: "https://ncpcr.gov.in", desc: "If victim is a child under 18 — mandatory reporting under POCSO Act", icon: "👶", dept: "NCPCR" },
    { name: "Centralised Victim Compensation", url: "https://slsakarnataka.gov.in", desc: "Claim compensation under victim compensation scheme (state-specific)", icon: "💼", dept: "DLSA / SLSA" },
  ],
  other: [
    { name: "CPGRAMS", url: "https://pgportal.gov.in", desc: "Centralized Public Grievance Redress system for any government complaint", icon: "🏛️", dept: "DARPG" },
    { name: "National Cyber Helpline", url: "https://cybercrime.gov.in", desc: "Even non-cyber incidents can be reported if digital evidence exists", icon: "🛡️", dept: "MHA" },
    { name: "National Consumer Helpline", url: "https://consumerhelpline.gov.in", desc: "For consumer fraud, deficiency of services, defective products", icon: "🛒", dept: "Ministry of Consumer Affairs" },
    { name: "Human Rights Commission", url: "https://nhrc.nic.in/en/node/add/nhrc-complaint", desc: "Escalate systematic violations of fundamental rights", icon: "⚖️", dept: "NHRC" },
  ],
  default: [
    { name: "Cyber Crime Portal", url: "https://cybercrime.gov.in", desc: "National hub for most digital complaints", icon: "🛡️", dept: "MHA" },
    { name: "CPGRAMS", url: "https://pgportal.gov.in", desc: "Public grievance for any government-related issue", icon: "🏛️", dept: "DARPG" },
    { name: "National Consumer Helpline", url: "https://consumerhelpline.gov.in", desc: "Consumer fraud and services", icon: "🛒", dept: "Consumer Affairs" },
  ],
};

export default function GovtPortalSuggestions({ category = "default" }) {
  const portals = GOVT_PORTALS[category] || GOVT_PORTALS.default;

  return (
    <section className="govt-portals-section">
      <div className="govt-portals-header">
        <span className="mini-label">🏛️ OFFICIAL GOVERNMENT PORTALS</span>
        <h3>Where to file your complaint directly</h3>
        <p className="muted-copy">These are official Government of India portals. AWAAZ does not submit on your behalf — you retain full control.</p>
      </div>
      <div className="govt-portals-grid">
        {portals.map((portal) => (
          <a
            key={portal.url}
            href={portal.url}
            target="_blank"
            rel="noreferrer"
            className="govt-portal-card"
          >
            <span className="gp-icon">{portal.icon}</span>
            <div className="gp-content">
              <strong>{portal.name}</strong>
              <p>{portal.desc}</p>
              <span className="gp-dept">{portal.dept}</span>
            </div>
            <span className="gp-arrow">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
