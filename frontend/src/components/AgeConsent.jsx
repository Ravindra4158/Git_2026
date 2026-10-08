import React, { useState } from "react";

const AGE_GROUPS = [
  { value: "child", label: "Under 14 (Child)", note: "POCSO Act applies. A guardian or parent must file the complaint. Report is mandatory for authorities." },
  { value: "minor", label: "14–18 (Minor)", note: "You can file with guardian support. Schools have mandatory reporting duty under POCSO." },
  { value: "adult", label: "18+ (Adult)", note: "You can file independently. This is the standard reporting flow." },
];

export default function AgeConsent({ onConfirm }) {
  const [ageGroup, setAgeGroup] = useState("");
  const [consented, setConsented] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function handleConfirm() {
    if (!ageGroup || !consented) return;
    setConfirmed(true);
    onConfirm?.({ ageGroup, consented: true });
  }

  if (confirmed) {
    const group = AGE_GROUPS.find((g) => g.value === ageGroup);
    return (
      <div className="age-consent-confirmed">
        <span>✅</span>
        <span>Age confirmed: <strong>{group?.label}</strong> — {group?.note}</span>
      </div>
    );
  }

  return (
    <div className="age-consent-card">
      <div className="age-consent-header">
        <span className="mini-label">🔒 AGE VERIFICATION &amp; CONSENT</span>
        <h3>Before we begin</h3>
        <p>This helps us show you the right legal protections and reporting authorities for your situation.</p>
      </div>

      <div className="age-group-options">
        {AGE_GROUPS.map((g) => (
          <label
            key={g.value}
            className={`age-option${ageGroup === g.value ? " age-option--selected" : ""}`}
          >
            <input
              type="radio"
              name="age-group"
              value={g.value}
              checked={ageGroup === g.value}
              onChange={() => setAgeGroup(g.value)}
            />
            <div>
              <strong>{g.label}</strong>
              {ageGroup === g.value && <p className="age-note">{g.note}</p>}
            </div>
          </label>
        ))}
      </div>

      {ageGroup === "child" && (
        <div className="pocso-alert">
          <span>⚠️</span>
          <div>
            <strong>POCSO Act Notice</strong>
            <p>Under POCSO Act 2012, reporting of sexual offences against children is mandatory for anyone who becomes aware. A designated authority (police, SJPU, or CARA) must be notified within 24 hours.</p>
            <a href="https://ncpcr.gov.in" target="_blank" rel="noreferrer">NCPCR (Child Rights) →</a>
          </div>
        </div>
      )}

      <label className="consent-checkbox">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
        />
        <span>
          I understand this tool is for report preparation only, not legal advice. I voluntarily provide information and can stop at any time.
        </span>
      </label>

      <button
        type="button"
        className="primary-cta"
        disabled={!ageGroup || !consented}
        onClick={handleConfirm}
        id="age-consent-confirm"
      >
        Confirm &amp; Continue →
      </button>
    </div>
  );
}
