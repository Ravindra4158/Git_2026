import React from "react";
import Card from "./ui/Card.jsx";
import { ExternalLink, Landmark } from "lucide-react";

const GOVT_PORTALS = {
  cyber_harassment: [
    { name: "Cyber Crime Portal", url: "https://cybercrime.gov.in", desc: "National portal for reporting cyber crimes including harassment, stalking, online fraud", dept: "Ministry of Home Affairs" },
    { name: "Social Media Complaint (Meta)", url: "https://www.facebook.com/help/contact/144059062408922", desc: "Report harassment on Facebook/Instagram directly to Meta", dept: "Platform Grievance" },
    { name: "TRAI Consumer Portal", url: "https://consumerportal.trai.gov.in", desc: "For unsolicited communication or spam calls/messages", dept: "TRAI" },
    { name: "State Cyber Cell", url: "https://www.keralapolice.gov.in/citizen-services", desc: "State-level police cyber cell filing", dept: "State Police" },
  ],
  financial_fraud: [
    { name: "Cyber Crime Portal (Financial)", url: "https://cybercrime.gov.in", desc: "Mandatory for online financial fraud. File within 24 hours for best recovery chances.", dept: "Ministry of Home Affairs" },
    { name: "Sachet Portal (RBI)", url: "https://sachet.rbi.org.in", desc: "Report unauthorized banking / illegal collection agents", dept: "Reserve Bank of India" },
    { name: "SEBI SCORES", url: "https://scores.gov.in", desc: "For investment fraud, fake trading platforms, stock scams", dept: "SEBI" },
    { name: "NPCI UPI Dispute", url: "https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism", desc: "Raise UPI transaction dispute with NPCI", dept: "NPCI" },
  ],
  workplace_incident: [
    { name: "SHe-Box (Sexual Harassment)", url: "https://shebox.nic.in", desc: "Mandatory portal for workplace sexual harassment complaints under POSH Act 2013", dept: "Ministry of Women & Child" },
    { name: "eSHRAM Portal", url: "https://eshram.gov.in", desc: "For unorganized sector worker grievances", dept: "Ministry of Labour" },
    { name: "Centralised Public Grievance Portal", url: "https://pgportal.gov.in", desc: "Escalate to senior government officials for unresolved workplace complaints", dept: "DARPG" },
    { name: "Labour Department Grievance", url: "https://labour.gov.in", desc: "State labour commission for employer misconduct", dept: "Ministry of Labour" },
  ],
  physical_threat: [
    { name: "Police FIR Online", url: "https://eservices.rajpolice.gov.in", desc: "File FIR online with your state police (link varies by state)", dept: "State Police" },
    { name: "National Commission for Women", url: "http://ncwapps.nic.in/onlinecomplaint", desc: "For gender-based physical violence and domestic abuse", dept: "NCW" },
    { name: "POCSO (for minors)", url: "https://ncpcr.gov.in", desc: "If victim is a child under 18 — mandatory reporting under POCSO Act", dept: "NCPCR" },
    { name: "Centralised Victim Compensation", url: "https://slsakarnataka.gov.in", desc: "Claim compensation under victim compensation scheme", dept: "DLSA / SLSA" },
  ],
  default: [
    { name: "Cyber Crime Portal", url: "https://cybercrime.gov.in", desc: "National hub for most digital complaints", dept: "MHA" },
    { name: "CPGRAMS", url: "https://pgportal.gov.in", desc: "Public grievance for any government-related issue", dept: "DARPG" },
    { name: "National Consumer Helpline", url: "https://consumerhelpline.gov.in", desc: "Consumer fraud and services", dept: "Consumer Affairs" },
  ],
};

export default function GovtPortalSuggestions({ category = "default" }) {
  const portals = GOVT_PORTALS[category] || GOVT_PORTALS.default;

  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-1">
          🏛️ Official Government Portals
        </span>
        <h3 className="text-base font-bold text-slate-900">
          Where to file your complaint directly
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          These are official Government of India portals. AWAAZ does not submit on your behalf — you retain full control.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {portals.map((portal) => (
          <Card
            key={portal.url}
            hover
            padding="p-4"
            className="flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {portal.name}
                </h4>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary shrink-0 transition-colors" />
              </div>
              <span className="text-[10px] font-semibold text-primary/80 block mt-0.5">
                {portal.dept}
              </span>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                {portal.desc}
              </p>
            </div>

            <div className="pt-2">
              <a
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span>Open Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
