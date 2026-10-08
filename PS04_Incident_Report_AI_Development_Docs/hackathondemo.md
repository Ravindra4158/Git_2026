# 🎤 Hackathon Demo & 3-Minute Pitch Script
### *PS04 — Incident Report AI (ReportFlow) | Git Jaipur 2026*

> [!IMPORTANT]
> **Hackathon Golden Rule:** Never rely on live external LLM API rate limits or internet connectivity during judging. ReportFlow ships with pre-loaded **synthetic scenario presets** and an instant `MockProvider` fallback that runs 100% deterministically in under 300ms.

---

## ⏱️ 3-Minute Pitch Structure

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 00:00 - 00:45 | The Problem: The Trauma-to-Bureaucracy Barrier        │
│ 00:45 - 01:15 | The Innovation: Structured Anti-Hallucination Pipeline │
│ 01:15 - 02:15 | Live Interactive Demo: Story → Verified Police Draft   │
│ 02:15 - 02:45 | Tech Architecture: Pydantic + Rules Engine + Grounding │
│ 02:45 - 03:00 | The Impact & Call to Action                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Live Presentation Script (Word-for-Word)

### 1. The Hook (0:00 – 0:45)
> "Judges, imagine this: You're an 18-year-old student. For the past two weeks, someone has been sending you terrifying messages on Instagram. You block them; they create another account with your photos. You're shaking, crying, and overwhelmed.
> 
> You go to report it to the National Cyber Crime Portal or the local police station. What happens? You are confronted with a cold, intimidating form asking for IP addresses, specific timestamps, transaction hashes, and formal legal language. 
> 
> Most victims give up. Those who don't submit messy, disjointed emotional paragraphs that take weeks for law enforcement to decipher.
> 
> Introducing **ReportFlow**—an AI-assisted incident preparation platform that turns chaotic traumatic stories into structured, legally defensible, authority-specific complaints—**with guaranteed zero hallucinations**."

### 2. Live Demo: 1-Click Synthetic Incident (0:45 – 2:00)
> *(Click the "Load Preset: Cyber Stalking & Harassment" button in the UI)*
> 
> **Step 1: Intake & Extraction**
> "Notice what we just pasted: *'Someone has been messaging me on Instagram for two weeks. They threaten me and created another account after I blocked them.'*
> 
> We click **Analyze**. Within 1.2 seconds, our Pydantic extraction engine isolates the platform (*Instagram*), the pattern (*repeated contact, stalking, burner accounts*), and identified evidence (*screenshots*). Every single fact has a provenance badge pointing to the exact sentence."
> 
> **Step 2: Proactive Missing-Information Detection**
> *(Point to the amber highlight section)*
> "Here is why this isn't just ChatGPT: ChatGPT would just hallucinate a fake username or write a vague letter. Our engine compares the incident against the National Cybercrime Portal schema and immediately detects what's missing:
> 1. What was the exact handle?
> 2. What date was the first message received?
> 3. Do you have the profile URL?
> 
> The user simply types `@stalker_account_99`, selects the approximate date, and uploads two sample screenshots."
> 
> **Step 3: Chronological Timeline & Route Engine**
> *(Click Timeline tab, then Route Selection)*
> "The engine auto-organizes the events into an immutable chronological timeline. Then, our deterministic rule engine recommends two precise reporting routes:
> 1. **National Cyber Crime Portal (cybercrime.gov.in / Category: Women/Child Cyber Crime)**
> 2. **Local Police Station (Formal Written Complaint / Section 354D IPC / BNS Stalking)**."
> 
> **Step 4: Draft Generation & Grounding Audit**
> *(Click Generate Draft)*
> "Watch this draft generate. Every paragraph is structured into official police format: Incident Summary, Offender Identifiers, Digital Evidence Chain-of-Custody, and Formal Relief Requested.
> 
> Most importantly: **Look at the green Grounding Audit badge at the top**. Our secondary validation model scanned every claim against verified user facts. Unsupported claims: ZERO. Hallucinations: ZERO."
> 
> **Step 5: Export**
> *(Click 'Download Official PDF')*
> "In one click, the victim has a formatted, print-ready, timestamped PDF package ready to hand directly to the investigating officer."

### 3. Architecture & Vision (2:00 – 3:00)
> "Under the hood, we built this with Next.js 14, FastAPI, PostgreSQL, and a provider-agnostic AI layer supporting Gemini, OpenAI, or local offline inference.
> 
> We built ReportFlow because justice shouldn't depend on how well a victim can write formal legal bureaucracy in their darkest hour. 
> Thank you, and we're ready for your questions!"

---

## 🧪 The 3 Built-in Synthetic Demo Scenarios

### Scenario A: Cyber Harassment & Stalking (Primary Demo)
```json
{
  "title": "Instagram Stalking & Burner Account Harassment",
  "narrative": "Someone has been messaging me on Instagram for about two weeks. They keep threatening to leak private photos and created another account (@dark_eyes_22) after I blocked their first account (@mystery_raj). I have 5 screenshots of the threats.",
  "category": "cyber_harassment",
  "platform": "Instagram",
  "missing_fields": ["approximate_start_date", "profile_url", "evidence_files"],
  "recommended_routes": ["cybercrime_portal_women_child", "local_police_fir"]
}
```

### Scenario B: UPI Phishing & Financial Fraud
```json
{
  "title": "Fake Electricity Bill APK & Rs. 48,000 Unauthorized Debit",
  "narrative": "Yesterday at 4 PM, I received an SMS saying my electricity would be disconnected tonight. I called the number given, and the person asked me to pay Rs. 10 via a link to update my bill. As soon as I entered my UPI PIN on the link, Rs. 48,000 was debited from my SBI account to UPI ID billpay@ybl.",
  "category": "financial_cyber_fraud",
  "platform": "SMS / UPI / SBI Net Banking",
  "missing_fields": ["bank_transaction_id", "phone_number_of_caller", "dispute_token"],
  "recommended_routes": ["national_cybercrime_helpline_1930", "bank_chargeback_grievance"]
}
```

### Scenario C: Workplace Harassment & Hostile Environment
```json
{
  "title": "Supervisor Retaliation & After-Hours Inappropriate Contact",
  "narrative": "My project manager has been repeatedly calling me after 11 PM on WhatsApp for non-work personal chats. When I politely asked him to keep communication on Slack during work hours, he threatened to give me a negative rating on my quarterly review.",
  "category": "workplace_misconduct",
  "platform": "WhatsApp / Corporate Slack",
  "missing_fields": ["employee_id", "hr_manager_name", "date_of_performance_review"],
  "recommended_routes": ["internal_complaints_committee_posh", "hr_ethics_portal"]
}
```

---

## 🛡️ Judge Q&A Defense Matrix (Top Inquiries)

| Question | Winning Response |
|---|---|
| **"Why not just give ChatGPT a prompt to write a letter?"** | *"ChatGPT is conversational and generative—it frequently hallucinates dates, fills in fake names, and has zero awareness of mandatory filing schemas. ReportFlow is a deterministic workflow pipeline with schema validation, Pydantic extraction, missing field detection, and grounding audits."* |
| **"How do you guarantee the AI doesn't hallucinate or frame someone?"** | *"Our Grounding Validator compares every extracted claim against the original user input. If a fact cannot be traced to the input or an interactive answer, it is flagged and stripped. The user must manually check off facts before draft generation is permitted."* |
| **"Is this giving legal advice?"** | *"No. We make this explicitly clear in our UI disclaimers. We are an administrative documentation and pre-filling assistant, not a legal counsel. We help organize facts for authorities to review."* |
| **"What if someone is in immediate physical danger right now?"** | *"Our emergency detection keyword filter immediately displays an emergency banner with direct dialing for 112, 100, 1091 (Women's Helpline), and 1930 (Cyber Fraud) rather than forcing them through a 7-step wizard."* |
| **"How do you handle sensitive data and privacy?"** | *"We feature a zero-log PII mode where reports can be processed locally in-browser or encrypted in PostgreSQL with immediate user-controlled purge after export."* |
