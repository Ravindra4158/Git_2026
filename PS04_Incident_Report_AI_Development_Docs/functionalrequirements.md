# ⚙️ Functional Requirements Document (FRD)
### *PS04 — Incident Report AI (ReportFlow) | Git Jaipur 2026*

---

## 📌 Requirements Index

| ID | Module | Title | Priority |
|---|---|---|---|
| **FR-01** | Intake | Freeform Narrative Input & Demo Presets | **P0** |
| **FR-02** | Intake | Emergency SOS Detection & Safety Banner | **P1** |
| **FR-03** | AI Core | Structured Fact Extraction with JSON Schemas | **P0** |
| **FR-04** | AI Core | Fact Provenance & Confidence Scoring | **P0** |
| **FR-05** | Gap Engine | Missing Information & Field Dependency Analysis | **P0** |
| **FR-06** | Interactive | Follow-up Questions & User Clarification | **P0** |
| **FR-07** | Evidence | Evidence Catalog & Metadata Tagging | **P0** |
| **FR-08** | Timeline | Chronological Event Reconstruction | **P0** |
| **FR-09** | Timeline | Timeline Manual Edit, Add, & Reorder | **P0** |
| **FR-10** | Routing | Authority & Channel Recommendation Engine | **P0** |
| **FR-11** | Routing | Rule Engine Justification & Guidance | **P0** |
| **FR-12** | Drafting | Authority-Specific Template Draft Generation | **P0** |
| **FR-13** | Drafting | Interactive Rich-Text Draft Editor | **P0** |
| **FR-14** | Guardrail | Grounding & Anti-Hallucination Audit | **P0** |
| **FR-15** | Export | Formatted PDF, DOCX, & Clipboard Export | **P0** |
| **FR-16** | Privacy | One-Click Data Wipe & Privacy Controls | **P0** |

---

## 🔍 Detailed Specifications

### FR-01: Freeform Narrative Input & Demo Presets
- **Description:** System shall accept free-form natural language text (up to 5,000 words).
- **Hackathon Demo Support:** System shall display 3 preset buttons (`Cyber Stalking`, `Financial UPI Fraud`, `Workplace POSH`) that immediately populate the narrative box to enable instantaneous evaluation.

### FR-03: Structured Fact Extraction
- **Description:** Extraction pipeline parses raw text into standardized Pydantic models:
  - `incident_category`: Classification (e.g. `cyber_harassment`, `financial_fraud`, `stalking`).
  - `platform_or_medium`: E.g. Instagram, WhatsApp, Bank, Physical location.
  - `perpetrator_identifiers`: Handles, phone numbers, UPI IDs, physical descriptions.
  - `frequency_and_duration`: Ongoing status, recurrence patterns.
  - `impact_reported`: Financial loss, reputational harm, psychological distress.

### FR-04: Fact Provenance & Verification
- **Description:** Every extracted fact maintains a link to the exact source sentence (`source_snippet`) and an interactive toggle for the user to confirm, edit, or reject the fact.

### FR-05 & FR-06: Missing Information Detection & Follow-up Q&A
- **Description:** System evaluates extracted facts against mandatory reporting requirements of the target jurisdiction.
- **Behavior:** Renders interactive questions with options to type answers or click *"I don't know / Not available"*. Answers are immediately merged into verified facts.

### FR-07: Evidence Organization
- **Description:** Allows attaching screenshots, PDFs, URLs, and transaction IDs. Assigns unique evidence IDs (`[Exhibit A]`, `[Exhibit B]`) to reference in the final complaint draft.

### FR-08: Chronological Timeline
- **Description:** Resolves fuzzy relative dates (e.g., "three days after the first call") into ordered timestamps. Users can drag-and-drop or edit dates manually.

### FR-10: Route Recommendation
- **Description:** Evaluates facts to recommend reporting jurisdictions:
  1. *National Cyber Crime Reporting Portal (cybercrime.gov.in)*
  2. *Local Police Station (State Police FIR / BNS Sections)*
  3. *Internal Complaints Committee (POSH Act)*
  4. *Banking Ombudsman / National Cyber Helpline 1930*

### FR-12: Authority-Specific Draft Generation
- **Description:** Compiles verified facts into formal administrative report templates, including legal headers, formal statements of grievance, evidence exhibits, and formal relief requests.

### FR-14: Grounding & Anti-Hallucination Validation
- **Description:** Runs an automated audit comparing draft statements with verified user facts. Flags any ungrounded assertions before export.

### FR-15: Multi-Format Export
- **Description:** Generates formatted PDF documents (with official government header styles, signature lines, and exhibit tables) and editable Word (DOCX) files.
