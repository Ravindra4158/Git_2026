import React, { useState } from "react";
import Card from "./ui/Card.jsx";
import { Phone, ShieldAlert, Globe, ChevronDown, ChevronUp } from "lucide-react";

const EMERGENCY_DB = {
  cyber_harassment: {
    label: "Cyber Crime / Online Harassment",
    contacts: [
      { name: "National Cyber Helpline", number: "1930", desc: "24×7 cyber crime reporting" },
      { name: "Cyber Crime Portal", number: null, link: "https://cybercrime.gov.in", desc: "File online complaint" },
      { name: "Women Helpline", number: "1091", desc: "For women in distress" },
      { name: "Police Emergency", number: "112", desc: "Immediate danger" },
    ],
  },
  financial_fraud: {
    label: "Financial Fraud / UPI Scam",
    contacts: [
      { name: "National Cyber Helpline", number: "1930", desc: "Report financial fraud online" },
      { name: "RBI Ombudsman", number: "14448", desc: "Banking grievances" },
      { name: "NPCI Helpline", number: "1800-120-1740", desc: "UPI / payment issues" },
      { name: "Police Emergency", number: "112", desc: "Immediate danger" },
    ],
  },
  workplace_incident: {
    label: "Workplace / HR Incident",
    contacts: [
      { name: "SHe-Box Portal", number: null, link: "https://shebox.nic.in", desc: "Sexual harassment at workplace" },
      { name: "Labour Helpline", number: "1800-11-3090", desc: "Workplace rights & safety" },
      { name: "Women Helpline", number: "1091", desc: "For women in distress" },
      { name: "Police Emergency", number: "112", desc: "Immediate danger" },
    ],
  },
  physical_threat: {
    label: "Physical Threat / Assault",
    contacts: [
      { name: "Police Emergency", number: "112", desc: "Immediate danger — call NOW" },
      { name: "Women Helpline", number: "1091", desc: "Women in distress" },
      { name: "Ambulance", number: "108", desc: "Medical emergency" },
      { name: "Tele-MANAS Mental Health", number: "14416", desc: "Trauma support" },
    ],
  },
  default: {
    label: "General Emergency Numbers",
    contacts: [
      { name: "Police / Emergency", number: "112", desc: "Immediate danger" },
      { name: "National Cyber Helpline", number: "1930", desc: "Cyber crime" },
      { name: "Women Helpline", number: "1091", desc: "Women in distress" },
      { name: "Tele-MANAS Mental Health", number: "14416", desc: "Mental health support" },
    ],
  },
};

export default function EmergencyNumbers({ category = "default", compact = false }) {
  const [open, setOpen] = useState(false);
  const data = EMERGENCY_DB[category] || EMERGENCY_DB.default;

  if (compact) {
    return (
      <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-rose-800 font-bold">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>IMMEDIATE EMERGENCY HELPLINES</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:112"
            className="px-3 py-1 bg-white border border-rose-200 rounded-lg font-bold text-rose-700 hover:bg-rose-100/50 transition-colors"
          >
            112 Police
          </a>
          <a
            href="tel:1930"
            className="px-3 py-1 bg-white border border-rose-200 rounded-lg font-bold text-rose-700 hover:bg-rose-100/50 transition-colors"
          >
            1930 Cyber
          </a>
          <a
            href="tel:1091"
            className="px-3 py-1 bg-white border border-rose-200 rounded-lg font-bold text-rose-700 hover:bg-rose-100/50 transition-colors"
          >
            1091 Women
          </a>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-5 border-rose-100/80 bg-gradient-to-br from-white via-white to-rose-50/30">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Emergency & Helplines: {data.label}
            </h4>
            <p className="text-[11px] text-slate-500">
              Free, immediate 24×7 official numbers
            </p>
          </div>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 mt-3 border-t border-slate-100">
          {data.contacts.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-xs"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{c.name}</span>
                <span className="text-[10px] text-slate-400">{c.desc}</span>
              </div>
              {c.number ? (
                <a
                  href={`tel:${c.number}`}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>{c.number}</span>
                </a>
              ) : (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-lavender hover:bg-primary-light text-primary font-bold text-xs transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span>Portal</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
