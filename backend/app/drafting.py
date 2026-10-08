from app.models import DraftTemplate, ExtractedFact


_TEMPLATES = {
    DraftTemplate.CYBER_INCIDENT: (
        "[CYBER INCIDENT REPORTING CHANNEL]",
        "Report of an online incident",
    ),
    DraftTemplate.POLICE_REPORT: (
        "[LOCAL POLICE OR PUBLIC SAFETY SERVICE]",
        "Report of an incident",
    ),
    DraftTemplate.FINANCIAL_INCIDENT: (
        "[BANK OR PAYMENT PROVIDER]",
        "Report of a financial incident",
    ),
    DraftTemplate.WORKPLACE_REPORT: (
        "[WORKPLACE REPORTING CHANNEL]",
        "Workplace incident report",
    ),
}


def generate_draft(template_id: DraftTemplate, facts: list[ExtractedFact]) -> str:
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

    return (
        "[YOUR NAME]\n[YOUR CONTACT DETAILS]\n[DATE]\n\n"
        f"To: {recipient}\nSubject: {subject}\n\n"
        "Dear Sir/Madam,\n\n"
        "I am preparing this report to document an incident. The details below are the "
        "information I have reviewed and confirmed.\n\n"
        "Verified details\n"
        + "\n".join(fact_lines)
        + "\n\nRequested assistance\n"
        "Please record this report and let me know what additional information or next steps "
        "are appropriate.\n\n"
        "This draft was prepared with ReportFlow. Please review it and replace any remaining "
        "placeholders before use.\n"
    )
