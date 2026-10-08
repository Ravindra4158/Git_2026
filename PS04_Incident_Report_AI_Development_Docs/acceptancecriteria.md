# ✅ Hackathon Acceptance Criteria & Verification Matrix
### *PS04 — Incident Report AI (ReportFlow) | Git Jaipur 2026*

This checklist defines the empirical pass/fail test criteria for evaluating the hackathon deliverable.

---

## 📋 Hackathon MVP Evaluation Matrix

### 1. Intake & Presets
- [ ] User can paste or type an unstructured narrative of up to 5,000 words.
- [ ] One-click preset buttons load **Cyber Stalking**, **UPI Phishing**, and **Workplace POSH** scenarios instantly.
- [ ] Emergency keywords (e.g. "danger", "suicide", "bleeding") trigger an immediate Emergency SOS helpline banner.

### 2. Structured Extraction & Provenance
- [ ] Classification correctly identifies incident category and platform (e.g., Instagram, SBI UPI).
- [ ] Facts are extracted into discrete key-value items (Perpetrator, Date, Impact, Evidence).
- [ ] Each fact features a provenance badge showing the source text snippet.
- [ ] User can toggle verification status (Verified / Rejected / Edit) on every fact.

### 3. Missing Information & Q&A
- [ ] System identifies at least 2 critical missing fields required for official filing.
- [ ] System renders clear, concise follow-up questions with input fields and an *"I don't know"* button.
- [ ] User answers are immediately ingested into the verified facts pool.

### 4. Evidence & Chronological Timeline
- [ ] System automatically populates evidence items detected in the text (e.g., screenshots, bank SMS).
- [ ] User can add evidence attachments with descriptions and exhibit labels (`[Exhibit A]`).
- [ ] Relative dates in the story are converted into an ordered chronological timeline.
- [ ] User can add, edit, or reorder events in the timeline.

### 5. Authority Routing & Recommendations
- [ ] System evaluates facts against deterministic jurisdictional criteria.
- [ ] Recommends at least two legitimate reporting channels with clear rationale.
- [ ] Highlights the primary recommended filing route with an *"Official Portal"* tag.

### 6. Authority-Specific Draft Generation
- [ ] Generates formal complaint draft tailored to the selected authority template.
- [ ] Draft includes proper salutation, subject line, incident chronology, evidence list, and formal prayer/relief.
- [ ] Placeholders like `[REPORTER_FULL_NAME]` are clearly indicated for missing personal data.
- [ ] In-app rich text editor allows instant user modification of the generated draft.

### 7. Grounding Audit & Anti-Hallucination Guardrail
- [ ] Automated grounding validator audits the draft against the verified facts list.
- [ ] Grounding score is displayed visually (e.g., `100% Grounded - 0 Hallucinations`).
- [ ] Disclaimers clearly state the platform provides documentation assistance, not legal counsel.

### 8. Multi-Format Export
- [ ] User can download a clean, professionally formatted PDF with headers, exhibits, and signature block.
- [ ] One-click *"Copy to Clipboard"* function copies formatted plain-text for easy pasting into government web forms.
- [ ] User can download an editable `.docx` Word file.

### 9. Demo Stability & Zero-Quota Resilience
- [ ] Complete demo functions 100% offline or with zero LLM API quota via `AI_PROVIDER=mock`.
- [ ] Complete user journey from story intake to PDF export takes `< 3 minutes`.
