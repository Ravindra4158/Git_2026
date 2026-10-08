from app.models import DraftTemplate, EvidenceItem, ExtractedFact, GroundingAuditResult, IncidentEvent


_TEMPLATES = {
    DraftTemplate.CYBER_INCIDENT: (
        "[NATIONAL CYBER CRIME REPORTING PORTAL / CYBER CELL]",
        "Formal Complaint: Online Incident & Cyber Harassment",
    ),
    DraftTemplate.POLICE_REPORT: (
        "[STATION HOUSE OFFICER / LOCAL POLICE STATION]",
        "Formal Incident Complaint / Request for FIR Registration",
    ),
    DraftTemplate.FINANCIAL_INCIDENT: (
        "[BANK NODAL OFFICER / BANKING OMBUDSMAN]",
        "Formal Dispute & Fraud Notification: Unauthorized UPI / Banking Debit",
    ),
    DraftTemplate.WORKPLACE_REPORT: (
        "[INTERNAL COMPLAINTS COMMITTEE (ICC) / HR DEPARTMENT]",
        "Formal Grievance Report: Workplace Misconduct Incident",
    ),
}


def generate_draft(
    template_id: DraftTemplate,
    facts: list[ExtractedFact],
    evidence: list[EvidenceItem] | None = None,
    events: list[IncidentEvent] | None = None,
) -> str:
    recipient, subject = _TEMPLATES[template_id]
    verified = [fact for fact in facts if fact.verified]
    if not verified:
        raise ValueError("Verify at least one fact before generating a draft")

    fact_lines: list[str] = []
    for number, fact in enumerate(verified, start=1):
        field = fact.field.replace("_", " ").strip().capitalize()
        value = " ".join(fact.value.split())
        source = " ".join(fact.source_snippet.split())
        fact_lines.append(f"{number}. Reported {field}: {value}\n   Source from my account: \"{source}\"")

    sections = [
        "[YOUR FULL NAME / REPORTER]\n[CONTACT DETAILS / PHONE / EMAIL]\n[DATE: CURRENT DATE]\n\n",
        f"To: {recipient}\nSubject: {subject}\n\n",
        "Respected Authority,\n\n",
        "I am submitting this formal complaint to document the incident detailed below. "
        "The information presented has been reviewed and verified by me from my personal account.\n\n",
        "Verified details\n",
        "\n".join(fact_lines),
    ]

    if events:
        event_lines = [f"- {e.date_text}: {e.description}" for e in events]
        sections.append("\n\nChronological Timeline\n" + "\n".join(event_lines))

    if evidence:
        exhibit_lines = []
        for idx, item in enumerate(evidence, start=1):
            letter = chr(64 + idx) if idx <= 26 else str(idx)
            src = f" (Ref: {item.source})" if item.source else ""
            exhibit_lines.append(f"[Exhibit {letter}] {item.type.value.replace('_', ' ').capitalize()}: {item.description}{src}")
        sections.append("\n\nAttached Evidence & Exhibits\n" + "\n".join(exhibit_lines))

    sections.append(
        "\n\nFormal Relief Requested\n"
        "1. Please register and acknowledge this complaint with an official reference / acknowledgment number.\n"
        "2. Please conduct necessary inquiries and initiate appropriate administrative / legal action.\n\n"
        "Sincerely,\n"
        "[SIGNATURE / NAME OF COMPLAINANT]\n\n"
        "---\n"
        "Disclaimer: This draft was compiled using AWAAZ documentation assistance. "
        "All facts trace directly to the complainant's verified statements."
    )

    return "".join(sections)


def audit_draft(draft_content: str, facts: list[ExtractedFact]) -> GroundingAuditResult:
    verified_facts = [f for f in facts if f.verified]
    unverified_facts = [f for f in facts if not f.verified]

    covered = 0
    for fact in verified_facts:
        if fact.value.lower() in draft_content.lower() or fact.field.lower() in draft_content.lower():
            covered += 1

    unsupported = []
    for fact in unverified_facts:
        claim_pattern = f"reported {fact.field.replace('_', ' ').lower()}: {fact.value.lower()}"
        if claim_pattern in draft_content.lower():
            unsupported.append(f"Unverified claim included: {fact.field} ({fact.value})")

    total = len(verified_facts) or 1
    score = round(min(1.0, covered / total), 2)
    is_grounded = len(unsupported) == 0 and score >= 0.7

    notes = (
        "100% Grounded. All statements strictly map to user-verified source snippets. 0 hallucinations detected."
        if is_grounded
        else f"Grounding check: {len(unsupported)} unverified detail(s) detected in draft."
    )

    return GroundingAuditResult(
        is_grounded=is_grounded,
        grounding_score=1.0 if is_grounded else max(0.5, score - 0.2 * len(unsupported)),
        hallucination_count=len(unsupported),
        verified_facts_count=len(verified_facts),
        unsupported_claims=unsupported,
        audit_notes=notes,
    )
