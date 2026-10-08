# 📋 Product Requirements Document (PRD)
### *PS04 — Incident Report AI (ReportFlow) | Git Jaipur 2026*

---

## 1. Problem Statement
When citizens experience cyberbullying, financial cyber fraud, online stalking, or workplace misconduct:
1. **High Emotional Trauma:** Victims struggle to organize thoughts into cold, bureaucratic chronological narratives.
2. **Procedural Complexity:** Different authorities (Local Police Stations, Cyber Cells, Workplace ICC, Bank Grievance Cells) have completely distinct jurisdiction criteria, required evidence, and complaint formats.
3. **High Rejection / Delay Rate:** Complaints filed with missing details (e.g. missing UPI transaction ID, burner handle URL, or exact timestamp) cause weeks of delay or outright rejection.
4. **General LLM Pitfalls:** Standard generative chatbots (e.g. ChatGPT) frequently hallucinate facts, invent penal codes, and fail to structure actionable evidence logs.

---

## 2. Product Vision & Differentiator

> **Vision:** "Empower anyone to transform an emotional incident story into a verified, structured, authority-specific legal reporting draft in under 3 minutes—with zero hallucinations."

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          THE REPORTFLOW DIFFERENCE                     │
├────────────────────────────────────────────────────────────────────────┤
│ Generic AI Assistants:                                                 │
│   Freeform Story ────────► LLM Output (High Hallucination Risk)        │
│                                                                        │
│ ReportFlow Platform:                                                   │
│   Freeform Story ──► Structured Facts ──► Gap Analysis ──► Timeline    │
│                  ──► Route Engine ──► Grounded Draft ──► Audit & PDF   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Target User Personas

| Persona | Context & Pain Point | How ReportFlow Solves It |
|---|---|---|
| **Priya (College Student, 20)** | Targeted by cyber stalker creating burner Instagram accounts. Terrified and confused. | Asks simple questions for handle & URLs; drafts Cyber Crime Portal compliant package with screenshot evidence checklist. |
| **Rajesh (Retired Senior, 64)** | Duped by a phishing SMS into sending Rs. 48,000 via UPI. Needs immediate action. | Immediately prompts for UTR transaction number, provides 1930 Helpline script, and drafts bank chargeback notice. |
| **Ananya (Corporate Analyst, 27)** | Facing inappropriate late-night WhatsApp harassment from manager. | Structures messages into chronological timeline; prepares formal POSH (Prevention of Sexual Harassment) complaint. |

---

## 4. Key Functional Capabilities

1. **Multi-Modal Narrative Intake:** Rich text area with pre-set synthetic demo buttons and audio transcription ready.
2. **Zero-Hallucination Extraction:** Strict Pydantic parsing into standardized JSON facts with sentence-level provenance.
3. **Proactive Missing-Information Detection:** Schema comparison against authority requirements to generate targeted follow-up questions.
4. **Evidence & Chain of Custody:** Cataloging screenshots, transaction receipts, call logs, and URLs with SHA-256 hashes.
5. **Dynamic Chronological Timeline:** Converts fuzzy temporal expressions ("last Tuesday", "2 days later") into ordered milestones.
6. **Smart Route Recommender:** Multi-criteria routing to National Cyber Portal, Police Station FIR, Workplace POSH, or Bank Ombudsman.
7. **Authority-Specific Draft Engine:** Markdown & rich-text editor populated with verified facts formatted into formal administrative language.
8. **Automated Grounding Audit:** Visual badge ensuring 100% of claims are anchored to verified user statements.
9. **Dual Export Formats:** Downloadable PDF and Word (DOCX) documents with print-ready headers and signature blocks.

---

## 5. Non-Goals (Scope Boundaries)
- ❌ **No Legal Advice:** The system explicitly states it is a documentation preparation assistant, not an advocate.
- ❌ **No Automatic Authority Filing:** The platform does not submit reports to external police APIs automatically without explicit user authorization and human review.
- ❌ **No Guilt Adjudication:** The platform does not make moral or legal verdicts regarding suspects.
