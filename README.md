# AWAAZ

Hackathon prototype for preparing an incident report draft from a user's own account of events.

## Phase 1

Phase 1 provides a simple incident intake screen, three synthetic demo presets, and a FastAPI endpoint that creates an in-memory report. Phase 2 adds optional AI fact extraction with structured output, exact source excerpts, and fact review. Phase 3 adds optional follow-up prompts that accept user answers, plus an evidence notes list. Phase 4 adds a timeline from quoted events and general category-based route guidance. Phase 5 generates editable report drafts from facts the user has verified. Dates remain in the user's wording; route suggestions are not legal advice. Answers are saved as verified user-provided facts. Evidence notes store descriptions and references only; files are not uploaded. Reports and drafts disappear when the backend restarts. Database persistence and document export remain later work.

## Run locally

The frontend lives in `frontend/src/pages/`, with one file per workflow screen. Shared API requests are in `frontend/src/services.js`; the AWAAZ vector logo is `frontend/public/awaaz-logo.svg`.

Start the backend in one terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY="your-api-key"  # Optional; required only for AI extraction
.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000```

The app uses `gpt-4o-mini` by default for extraction. Set `OPENAI_MODEL` to use another model that supports structured outputs. Without an API key, intake still works and the extraction endpoint reports that AI is not configured.

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend sends requests to `http://localhost:8000`.

This is a local hackathon prototype. It does not provide legal advice or submit reports to authorities. Use synthetic examples for demos.
