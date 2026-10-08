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


class IncidentExtraction(BaseModel):
    incident_type: IncidentType
    facts: list[ExtractedFact] = Field(default_factory=list)


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


class FactVerification(BaseModel):
    verified: bool


class FollowUpAnswer(BaseModel):
    answer: str = Field(min_length=1, max_length=1_000)

    @field_validator("answer")
    @classmethod
    def answer_must_contain_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Answer cannot be blank")
        return value
