from datetime import datetime, timezone
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator


class ReportStatus(str, Enum):
    INTAKE = "intake"


class IncidentType(str, Enum):
    CYBER_HARASSMENT = "cyber_harassment"
    FINANCIAL_FRAUD = "financial_fraud"
    WORKPLACE_INCIDENT = "workplace_incident"
    PHYSICAL_THREAT = "physical_threat"
    OTHER = "other"


class ExtractedFact(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    field: str = Field(min_length=1, max_length=80)
    value: str = Field(min_length=1, max_length=500)
    source_snippet: str = Field(min_length=1, max_length=1_000)
    verified: bool = False


class IncidentEvent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    date_text: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=500)
    source_snippet: str = Field(min_length=1, max_length=1_000)
    verified: bool = False


class IncidentExtraction(BaseModel):
    incident_type: IncidentType
    facts: list[ExtractedFact] = Field(default_factory=list)
    events: list[IncidentEvent] = Field(default_factory=list)


class RecommendedRoute(BaseModel):
    name: str
    reason: str
    caveat: str
    primary: bool = False


class DraftTemplate(str, Enum):
    CYBER_INCIDENT = "cyber_incident"
    POLICE_REPORT = "police_report"
    FINANCIAL_INCIDENT = "financial_incident"
    WORKPLACE_REPORT = "workplace_report"


class GroundingAuditResult(BaseModel):
    is_grounded: bool
    grounding_score: float = Field(ge=0.0, le=1.0)
    hallucination_count: int = 0
    verified_facts_count: int = 0
    unsupported_claims: list[str] = Field(default_factory=list)
    audit_notes: str


class ReportDraft(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    template_id: DraftTemplate
    content: str
    audit: GroundingAuditResult | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DraftCreate(BaseModel):
    template_id: DraftTemplate


class DraftUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=20_000)

    @field_validator("content")
    @classmethod
    def content_must_contain_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Draft cannot be blank")
        return value


class MissingInformation(BaseModel):
    field: str
    question: str
    reason: str


class EvidenceType(str, Enum):
    SCREENSHOT = "screenshot"
    MESSAGE = "message"
    DOCUMENT = "document"
    URL = "url"
    TRANSACTION_REFERENCE = "transaction_reference"
    PHOTO_VIDEO = "photo_video"
    OTHER = "other"


class EvidenceCreate(BaseModel):
    type: EvidenceType
    description: str = Field(min_length=1, max_length=500)
    source: str | None = Field(default=None, max_length=500)

    @field_validator("description")
    @classmethod
    def description_must_contain_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Description cannot be blank")
        return value


class EvidenceItem(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    type: EvidenceType
    description: str
    source: str | None = None
    added_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReportCreate(BaseModel):
    narrative: str = Field(min_length=1, max_length=20_000)

    @field_validator("narrative")
    @classmethod
    def narrative_must_contain_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Narrative cannot be blank")
        return value


class Report(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    narrative: str
    status: ReportStatus = ReportStatus.INTAKE
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    extraction: IncidentExtraction | None = None
    missing_information: list[MissingInformation] = Field(default_factory=list)
    evidence: list[EvidenceItem] = Field(default_factory=list)
    timeline: list[IncidentEvent] = Field(default_factory=list)
    recommended_routes: list[RecommendedRoute] = Field(default_factory=list)
    drafts: list[ReportDraft] = Field(default_factory=list)


class EventCreate(BaseModel):
    date_text: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=500)
    source_snippet: str | None = Field(default="Added by user", max_length=1_000)


class EventUpdate(BaseModel):
    date_text: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, min_length=1, max_length=500)
    verified: bool | None = None


class TimelineReorder(BaseModel):
    event_ids: list[UUID]


class FactVerification(BaseModel):
    verified: bool
    value: str | None = None


class FollowUpAnswer(BaseModel):
    answer: str = Field(min_length=1, max_length=1_000)

    @field_validator("answer")
    @classmethod
    def answer_must_contain_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Answer cannot be blank")
        return value


class DemoNarrative(BaseModel):
    key: str
    title: str
    category: IncidentType
    narrative: str
