# ReportFlow

Hackathon prototype for preparing an incident report draft from a user's own account of events.

## Phase 1

Phase 1 provides a simple incident intake screen, three synthetic demo presets, and a FastAPI endpoint that creates an in-memory report. Phase 2 adds optional AI fact extraction with structured output, exact source excerpts, and fact review. Phase 3 adds optional follow-up prompts that accept user answers, plus an evidence notes list. Answers are saved as verified user-provided facts. Evidence notes store descriptions and references only; files are not uploaded. Reports and notes disappear when the backend restarts. Database persistence, report routing, and document export are later work.

## Run locally

Start the backend in one terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY="your-api-key"  # Optional; required only for AI extraction
uvicorn app.main:app --reload --port 8000
```

The app uses `gpt-4o-mini` by default for extraction. Set `OPENAI_MODEL` to use another model that supports structured outputs. Without an API key, intake still works and the extraction endpoint reports that AI is not configured.

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend sends requests to `http://localhost:8000`.

This is a local hackathon prototype. It does not provide legal advice or submit reports to authorities. Use synthetic examples for demos.
