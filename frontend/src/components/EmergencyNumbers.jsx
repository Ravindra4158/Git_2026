import React, { useRef, useState } from "react";

// Emergency contacts database by incident keywords
const EMERGENCY_DB = {
  cyber_harassment: {
    label: "Cyber Crime / Online Harassment",
    contacts: [
      { name: "National Cyber Helpline", number: "1930", icon: "🛡️", desc: "24×7 cyber crime reporting" },
      { name: "Cyber Crime Portal", number: null, link: "https://cybercrime.gov.in", icon: "🌐", desc: "File online complaint" },
      { name: "Women Helpline", number: "1091", icon: "👩", desc: "For women in distress" },
      { name: "Police Emergency", number: "112", icon: "🚔", desc: "Immediate danger" },
    ],
  },
  financial_fraud: {
    label: "Financial Fraud / UPI Scam",
    contacts: [
      { name: "National Cyber Helpline", number: "1930", icon: "🛡️", desc: "Report financial fraud online" },
      { name: "RBI Ombudsman", number: "14448", icon: "🏦", desc: "Banking grievances" },
      { name: "NPCI Helpline", number: "1800-120-1740", icon: "💳", desc: "UPI / payment issues" },
      { name: "Police Emergency", number: "112", icon: "🚔", desc: "Immediate danger" },
    ],
  },
  workplace_incident: {
    label: "Workplace / HR Incident",
    contacts: [
      { name: "SHe-Box Portal", number: null, link: "https://shebox.nic.in", icon: "⚖️", desc: "Sexual harassment at workplace" },
      { name: "Labour Helpline", number: "1800-11-3090", icon: "👷", desc: "Workplace rights & safety" },
      { name: "Women Helpline", number: "1091", icon: "👩", desc: "For women in distress" },
      { name: "Police Emergency", number: "112", icon: "🚔", desc: "Immediate danger" },
    ],
  },
  physical_threat: {
    label: "Physical Threat / Assault",
    contacts: [
      { name: "Police Emergency", number: "112", icon: "🚔", desc: "Immediate danger — call NOW" },
      { name: "Women Helpline", number: "1091", icon: "👩", desc: "Women in distress" },
      { name: "Ambulance", number: "108", icon: "🚑", desc: "Medical emergency" },
      { name: "Tele-MANAS Mental Health", number: "14416", icon: "🧠", desc: "Trauma support" },
    ],
  },
  default: {
    label: "General Emergency Numbers",
    contacts: [
      { name: "Police / Emergency", number: "112", icon: "🚔", desc: "Immediate danger" },
      { name: "National Cyber Helpline", number: "1930", icon: "🛡️", desc: "Cyber crime" },
      { name: "Women Helpline", number: "1091", icon: "👩", desc: "Women in distress" },
      { name: "Tele-MANAS Mental Health", number: "14416", icon: "🧠", desc: "Mental health support" },
    ],
  },
};

function detectCategory(text) {
  const t = (text || "").toLowerCase();
  if (/instagram|whatsapp|facebook|twitter|online|message|hack|password|phishing|cyber|email|threat.*send|leak.*photo/.test(t)) return "cyber_harassment";
  if (/upi|bank|money|transfer|fraud|scam|atm|account|otp|payment|credit|debit|stolen.*money/.test(t)) return "financial_fraud";
  if (/workplace|office|boss|supervisor|hr|manager|colleague|employer|harass.*work/.test(t)) return "workplace_incident";
  if (/attack|hit|assault|threaten|weapon|knife|gun|stab|beat|hurt|bleed|physical/.test(t)) return "physical_threat";
  return "default";
}

export default function EmergencyNumbers({ narrative = "", forceCategory = null, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const category = forceCategory || detectCategory(narrative);
  const data = EMERGENCY_DB[category] || EMERGENCY_DB.default;

  const EMERGENCY_KEYWORDS = ["danger", "suicide", "bleeding", "threat", "attack", "kill", "harm", "weapon", "emergency", "assault", "rape", "stalking"];
  const isUrgent = EMERGENCY_KEYWORDS.some((kw) => narrative.toLowerCase().includes(kw));

  if (!narrative && !forceCategory && !compact) return null;

  return (
    <div className={`emergency-panel${isUrgent ? " emergency-panel--urgent" : ""}${compact ? " emergency-panel--compact" : ""}`}>
      <div className="emergency-panel-header" onClick={() => setExpanded((v) => !v)}>
        <span className="emergency-panel-badge">
          {isUrgent ? "🚨 IMMEDIATE HELP NEEDED?" : "📞 Helplines for your situation"}
        </span>
        <span className="emergency-label-text">{data.label}</span>
        <button type="button" className="emergency-toggle-btn" aria-label={expanded ? "Collapse" : "Expand"}>
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {(expanded || isUrgent) && (
        <div className="emergency-contacts-grid">
          {data.contacts.map((c) => (
            <div key={c.name} className={`emergency-contact-card${c.number === "112" ? " emergency-contact-card--primary" : ""}`}>
              <span className="ec-icon">{c.icon}</span>
              <div className="ec-info">
                <strong>{c.name}</strong>
                <span>{c.desc}</span>
              </div>
              {c.number ? (
                <a className="ec-dial" href={`tel:${c.number}`}>{c.number}</a>
              ) : c.link ? (
                <a className="ec-dial ec-link" href={c.link} target="_blank" rel="noreferrer">Visit →</a>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { detectCategory };
