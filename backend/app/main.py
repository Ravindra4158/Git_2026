from uuid import UUID

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.demo_data import DEMO_NARRATIVES
from app.extraction import ExtractionFailed, ExtractionUnavailable, extract_incident
from app.drafting import generate_draft
from app.missing_info import find_missing_information
from app.models import (
    DemoNarrative,
    DraftTemplate,
    EvidenceCreate,
    EvidenceItem,
    DraftCreate,
    DraftUpdate,
    ExtractedFact,
    FactVerification,
    FollowUpAnswer,
    IncidentEvent,
    RecommendedRoute,
    Report,
    ReportDraft,
    ReportCreate,
)
from app.routing import recommend_routes

app = FastAPI(title="AWAAZ API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

reports: dict[UUID, Report] = {}


_DEFAULT_TEMPLATES = {
    "cyber_harassment": DraftTemplate.CYBER_INCIDENT,
    "financial_fraud": DraftTemplate.FINANCIAL_INCIDENT,
    "workplace_incident": DraftTemplate.WORKPLACE_REPORT,
    "physical_threat": DraftTemplate.POLICE_REPORT,
    "other": DraftTemplate.POLICE_REPORT,
}


def _analyze(report: Report) -> Report:
    report.extraction = extract_incident(report.narrative)
    report.missing_information = find_missing_information(report.extraction, len(report.evidence))
    report.timeline = report.extraction.events
    report.recommended_routes = recommend_routes(report.extraction.incident_type)
    return report


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/reports", response_model=Report, status_code=201)
def create_report(payload: ReportCreate) -> Report:
    report = Report(narrative=payload.narrative.strip())
    reports[report.id] = report
    return report


@app.get("/api/reports", response_model=list[Report])
def list_reports() -> list[Report]:
    return sorted(reports.values(), key=lambda report: report.created_at, reverse=True)


@app.get("/api/reports/{report_id}", response_model=Report)
def get_report(report_id: UUID) -> Report:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@app.post("/api/reports/{report_id}/analyze", response_model=Report)
def analyze_report(report_id: UUID) -> Report:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    try:
        _analyze(report)
    except ExtractionUnavailable as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except ExtractionFailed as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    return report


@app.get("/api/demo/narratives", response_model=list[DemoNarrative])
def get_demo_narratives() -> list[DemoNarrative]:
    return [
        DemoNarrative(
            key=item["key"],
            title=item["title"],
            category=item["category"],
            narrative=item["narrative"],
        )
        for item in DEMO_NARRATIVES
    ]


@app.post("/api/demo/reports", response_model=list[Report], status_code=201)
def generate_demo_reports() -> list[Report]:
    seeded: list[Report] = []
    existing_by_narrative = {report.narrative: report for report in reports.values()}

    for item in DEMO_NARRATIVES:
        report = existing_by_narrative.get(item["narrative"])
        if report is None:
            report = Report(narrative=item["narrative"])
            reports[report.id] = report

        if not report.evidence:
            report.evidence.extend(EvidenceItem(**evidence) for evidence in item["evidence"])

        if report.extraction is None:
            _analyze(report)

        if report.extraction is not None:
            for fact in report.extraction.facts:
                fact.verified = True
            report.missing_information = find_missing_information(report.extraction, len(report.evidence))

        if not report.drafts and report.extraction is not None:
            template_id = _DEFAULT_TEMPLATES[report.extraction.incident_type.value]
            draft = ReportDraft(template_id=template_id, content=generate_draft(template_id, report.extraction.facts))
            report.drafts.append(draft)

        seeded.append(report)

    return seeded


@app.get("/api/reports/{report_id}/timeline", response_model=list[IncidentEvent])
def get_timeline(report_id: UUID) -> list[IncidentEvent]:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return report.timeline


@app.get("/api/reports/{report_id}/routes", response_model=list[RecommendedRoute])
def get_routes(report_id: UUID) -> list[RecommendedRoute]:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return report.recommended_routes


@app.post("/api/reports/{report_id}/drafts", response_model=ReportDraft, status_code=201)
def create_draft(report_id: UUID, payload: DraftCreate) -> ReportDraft:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if report.extraction is None:
        raise HTTPException(status_code=409, detail="Analyze this report before generating a draft")
    try:
        content = generate_draft(payload.template_id, report.extraction.facts)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    draft = ReportDraft(template_id=payload.template_id, content=content)
    report.drafts.append(draft)
    return draft


@app.patch("/api/reports/{report_id}/drafts/{draft_id}", response_model=ReportDraft)
def update_draft(report_id: UUID, draft_id: UUID, payload: DraftUpdate) -> ReportDraft:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    draft = next((item for item in report.drafts if item.id == draft_id), None)
    if draft is None:
        raise HTTPException(status_code=404, detail="Draft not found")
    draft.content = payload.content
    return draft


@app.patch("/api/reports/{report_id}/facts/{fact_id}", response_model=Report)
def verify_fact(report_id: UUID, fact_id: UUID, payload: FactVerification) -> Report:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if report.extraction is None:
        raise HTTPException(status_code=409, detail="Analyze this report before reviewing facts")

    fact = next((item for item in report.extraction.facts if item.id == fact_id), None)
    if fact is None:
        raise HTTPException(status_code=404, detail="Fact not found")
    fact.verified = payload.verified
    return report


@app.patch("/api/reports/{report_id}/answers/{field}", response_model=Report)
def answer_follow_up(report_id: UUID, field: str, payload: FollowUpAnswer) -> Report:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if report.extraction is None:
        raise HTTPException(status_code=409, detail="Analyze this report before answering prompts")
    if not any(item.field == field for item in report.missing_information):
        raise HTTPException(status_code=404, detail="Follow-up prompt not found")

    report.extraction.facts.append(
        ExtractedFact(field=field, value=payload.answer, source_snippet=payload.answer, verified=True)
    )
    report.missing_information = find_missing_information(report.extraction, len(report.evidence))
    return report


@app.post("/api/reports/{report_id}/evidence", response_model=Report, status_code=201)
def add_evidence(report_id: UUID, payload: EvidenceCreate) -> Report:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    report.evidence.append(EvidenceItem(**payload.model_dump()))
    if report.extraction is not None:
        report.missing_information = find_missing_information(report.extraction, len(report.evidence))
    return report


@app.delete("/api/reports/{report_id}/evidence/{evidence_id}", response_model=Report)
def delete_evidence(report_id: UUID, evidence_id: UUID) -> Report:
    report = reports.get(report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    item = next((item for item in report.evidence if item.id == evidence_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Evidence item not found")
    report.evidence.remove(item)
    if report.extraction is not None:
        report.missing_information = find_missing_information(report.extraction, len(report.evidence))
    return report
