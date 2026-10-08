# API Specification

Base URL:

```text
/api/v1
```

## Authentication

### POST /auth/register
Create account.

### POST /auth/login
Authenticate.

### POST /auth/logout
Invalidate session.

## Reports

### POST /reports
Create report.

Request:
```json
{
  "title": "Optional title"
}
```

### GET /reports/{report_id}
Return report.

### PATCH /reports/{report_id}
Update report metadata.

### DELETE /reports/{report_id}
Delete report.

## Analysis

### POST /reports/{report_id}/analyze

Runs:
- Classification
- Extraction
- Missing field detection

Response:
```json
{
  "incident_type": "cyber_harassment",
  "facts": [],
  "missing_information": []
}
```

## Questions

### POST /reports/{report_id}/questions
Generate/return follow-up questions.

### POST /reports/{report_id}/answers
Store answers and update facts.

## Evidence

### POST /reports/{report_id}/evidence
Create evidence metadata/upload reference.

### GET /reports/{report_id}/evidence
List evidence.

### DELETE /evidence/{evidence_id}
Delete evidence.

## Timeline

### GET /reports/{report_id}/timeline
Return timeline.

### PATCH /timeline/{event_id}
Edit event.

## Routes

### POST /reports/{report_id}/routes
Return possible reporting routes.

## Drafts

### POST /reports/{report_id}/drafts
Generate draft.

Request:
```json
{
  "template_id": "cyber-incident-v1"
}
```

### GET /drafts/{draft_id}
Get draft.

### PATCH /drafts/{draft_id}
Edit draft.

### POST /drafts/{draft_id}/validate
Run grounding/fact validation.

## Export

### GET /drafts/{draft_id}/export/pdf
PDF.

### GET /drafts/{draft_id}/export/docx
DOCX.

### GET /drafts/{draft_id}/export/text
Plain text.

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

## API Rules

- Never return another user's report.
- Validate ownership server-side.
- Never trust report IDs from the client.
- Avoid logging sensitive request bodies.
