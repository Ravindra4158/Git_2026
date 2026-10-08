from app.models import IncidentExtraction, IncidentType, MissingInformation


_QUESTIONS = {
    IncidentType.CYBER_HARASSMENT: [
        ("when", "Do you remember when this happened?", "A date or approximate time can help organize the timeline."),
        ("platform", "Which app, website, or service was involved?", "This helps identify where the messages or activity occurred."),
        ("people", "Is there an account name or other identifier you want to record?", "An identifier may help distinguish the people or accounts mentioned."),
        ("evidence", "Do you have messages, screenshots, or links you want to list?", "A list can help you keep track of material you may want to review."),
        ("impact", "Is there an impact or concern you want included in your own words?", "This can preserve how the incident affected you."),
    ],
    IncidentType.FINANCIAL_FRAUD: [
        ("when", "When did the payment or contact happen?", "A date or approximate time can help organize the sequence."),
        ("amount", "Do you know the amount involved?", "Recording the amount can help describe the reported transaction."),
        ("transaction", "Do you have a transaction reference or ID?", "A reference can help you locate the transaction details later."),
        ("platform", "Which bank, payment app, or service was involved?", "This helps identify where the transaction took place."),
        ("evidence", "Do you have a bank message, receipt, or link to list?", "A list can help you keep track of material you may want to review."),
    ],
    IncidentType.WORKPLACE_INCIDENT: [
        ("when", "When did this happen?", "A date or approximate time can help organize the timeline."),
        ("location", "Where did this happen, or which work channel was involved?", "This helps place the event in context."),
        ("people", "Are there people or roles you want to identify?", "This can clarify who was involved, using only details you choose to provide."),
        ("witnesses", "Was anyone else present or aware of the incident?", "You can note witnesses if you want to include them."),
        ("evidence", "Do you have messages, documents, or other material to list?", "A list can help you keep track of material you may want to review."),
    ],
    IncidentType.PHYSICAL_THREAT: [
        ("when", "When did this happen?", "A date or approximate time can help organize the timeline."),
        ("location", "Where did this happen?", "A location can help place the event in context."),
        ("people", "Are there people or identifiers you want to record?", "This can clarify who was involved, using only details you choose to provide."),
        ("witnesses", "Was anyone else present or aware of the incident?", "You can note witnesses if you want to include them."),
        ("evidence", "Is there any material you want to list?", "A list can help you keep track of material you may want to review."),
    ],
    IncidentType.OTHER: [
        ("when", "When did this happen?", "A date or approximate time can help organize the timeline."),
        ("location", "Where did this happen, or which service was involved?", "This helps place the event in context."),
        ("people", "Are there people or identifiers you want to record?", "This can clarify who was involved, using only details you choose to provide."),
        ("evidence", "Is there any material you want to list?", "A list can help you keep track of material you may want to review."),
    ],
}

_ALIASES = {
    "when": {"date", "time", "datetime", "when", "incident_date", "incident_time", "reported_date", "approximate_start_date"},
    "platform": {"platform", "platform_or_medium", "service", "app", "website", "channel", "medium"},
    "location": {"location", "place", "address", "where", "platform_or_location"},
    "people": {"person", "people", "people_involved", "perpetrator", "perpetrator_identity", "offender", "suspect", "username", "account", "handle", "contact"},
    "evidence": {"evidence", "evidence_mentioned", "attachment", "attachments", "screenshot", "screenshots", "document", "url"},
    "impact": {"impact", "impact_reported", "harm", "loss", "financial_loss"},
    "amount": {"amount", "financial_loss", "loss", "amount_lost", "money_lost"},
    "transaction": {"transaction_id", "transaction_reference", "utr", "utr_number", "reference_number", "dispute_token"},
    "witnesses": {"witness", "witnesses"},
}


def find_missing_information(extraction: IncidentExtraction, evidence_count: int = 0) -> list[MissingInformation]:
    known = {fact.field.strip().casefold().replace(" ", "_") for fact in extraction.facts}
    missing: list[MissingInformation] = []
    for field, question, reason in _QUESTIONS[extraction.incident_type]:
        if field == "evidence" and evidence_count:
            continue
        aliases = _ALIASES[field]
        if not known.intersection(aliases):
            missing.append(MissingInformation(field=field, question=question, reason=reason))
    return missing
