import React, { useState } from "react";
import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const AGE_GROUPS = [
  {
    value: "child",
    label: "Under 14 (Child)",
    note: "POCSO Act applies. A guardian or parent must file the complaint. Report is mandatory for authorities.",
  },
  {
    value: "minor",
    label: "14–18 (Minor)",
    note: "You can file with guardian support. Schools and institutions have mandatory reporting duty under POCSO.",
  },
  {
    value: "adult",
    label: "18+ (Adult)",
    note: "You can file independently. This is the standard reporting flow.",
  },
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
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          Age confirmed: <strong>{group?.label}</strong> — {group?.note}
        </span>
      </div>
    );
  }

  return (
    <Card className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-card border-slate-100">
      <div>
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
          🔒 Legal Verification & Consent
        </span>
        <h3 className="text-xl font-bold text-slate-900">Before we begin</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          This helps us show you the right legal protections and reporting authorities for your situation.
        </p>
      </div>

      <div className="space-y-3">
        {AGE_GROUPS.map((g) => {
          const isSelected = ageGroup === g.value;
          return (
            <label
              key={g.value}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary-lavender/30 ring-2 ring-primary-light"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="age-group"
                value={g.value}
                checked={isSelected}
                onChange={() => setAgeGroup(g.value)}
                className="mt-0.5 text-primary focus:ring-primary h-4 w-4"
              />
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-900 block">
                  {g.label}
                </span>
                {isSelected && (
                  <p className="text-xs text-slate-600 leading-relaxed">{g.note}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {ageGroup === "child" && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold">POCSO Act Notice</strong>
            <p className="leading-relaxed">
              Under POCSO Act 2012, reporting of sexual offences against children is mandatory for anyone who becomes aware. A designated authority (police, SJPU, or CARA) must be notified within 24 hours.
            </p>
            <a
              href="https://ncpcr.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-bold hover:underline inline-block pt-1"
            >
              NCPCR (Child Rights) →
            </a>
          </div>
        </div>
      )}

      <label className="flex items-start gap-3 text-xs text-slate-600 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
        />
        <span className="leading-relaxed">
          I understand this tool is for report preparation only, not legal advice. I voluntarily provide information and can stop at any time.
        </span>
      </label>

      <div className="pt-2">
        <Button
          variant="pill"
          size="lg"
          showArrow
          disabled={!ageGroup || !consented}
          onClick={handleConfirm}
          className="w-full sm:w-auto"
        >
          Confirm & Continue
        </Button>
      </div>
    </Card>
  );
}
