import unittest
from unittest.mock import patch
from urllib.error import URLError

from app.main import (
    add_evidence,
    analyze_report,
    create_draft,
    create_report,
    generate_demo_reports,
    get_demo_narratives,
    get_routes,
    list_reports,
    reports,
    update_draft,
    verify_fact,
)
from app.models import DraftCreate, DraftUpdate, EvidenceCreate, FactVerification, ReportCreate


class AwaazApiFlowTest(unittest.TestCase):
    def setUp(self) -> None:
        reports.clear()

    def test_report_can_move_from_intake_to_draft_without_external_ai(self) -> None:
        created = create_report(
            ReportCreate(
                narrative=(
                    "Yesterday afternoon I received a text about an electricity bill and followed a payment link. "
                    "After I entered my UPI PIN, money was taken from my bank account. I have the bank message."
                )
            )
        )
        report_id = created.id

        analyzed = analyze_report(report_id)
        self.assertEqual(analyzed.extraction.incident_type.value, "financial_fraud")
        self.assertGreater(len(analyzed.extraction.facts), 0)

        fact_id = analyzed.extraction.facts[0].id
        verified = verify_fact(report_id, fact_id, FactVerification(verified=True))
        self.assertTrue(verified.extraction.facts[0].verified)

        # Test fact value editing
        edited_fact = verify_fact(report_id, fact_id, FactVerification(verified=True, value="Yesterday at 3 PM"))
        self.assertEqual(edited_fact.extraction.facts[0].value, "Yesterday at 3 PM")

        # Test adding timeline event
        from app.main import add_timeline_event, update_timeline_event, reorder_timeline
        from app.models import EventCreate, EventUpdate, TimelineReorder
        tl_report = add_timeline_event(report_id, EventCreate(date_text="Yesterday 3:00 PM", description="Received fake electricity SMS"))
        self.assertGreaterEqual(len(tl_report.timeline), 1)
        event_id = tl_report.timeline[-1].id

        # Test editing timeline event
        tl_updated = update_timeline_event(report_id, event_id, EventUpdate(description="Received fraudulent electricity bill link"))
        self.assertEqual(tl_updated.timeline[-1].description, "Received fraudulent electricity bill link")

        evidence = add_evidence(
            report_id,
            EvidenceCreate(type="message", description="Bank debit message", source="SMS inbox"),
        )
        self.assertEqual(len(evidence.evidence), 1)

        routes = get_routes(report_id)
        self.assertTrue(any(route.primary for route in routes))

        draft = create_draft(report_id, DraftCreate(template_id="financial_incident"))
        self.assertIn("Verified details", draft.content)
        self.assertIn("[Exhibit A]", draft.content)
        self.assertIsNotNone(draft.audit)
        self.assertTrue(draft.audit.is_grounded)
        self.assertEqual(draft.audit.hallucination_count, 0)

        updated = update_draft(
            report_id,
            draft.id,
            DraftUpdate(content="Reviewed AWAAZ draft content"),
        )
        self.assertEqual(updated.content, "Reviewed AWAAZ draft content")

        self.assertEqual(len(list_reports()), 1)

    def test_demo_report_generation_is_complete_and_idempotent(self) -> None:
        narratives = get_demo_narratives()
        self.assertGreaterEqual(len(narratives), 3)

        first_reports = generate_demo_reports()
        second_reports = generate_demo_reports()

        self.assertEqual(len(first_reports), len(narratives))
        self.assertEqual(len(second_reports), len(first_reports))
        self.assertEqual(len(list_reports()), len(first_reports))
        self.assertEqual(
            {report.extraction.incident_type.value for report in second_reports},
            {"cyber_harassment", "financial_fraud", "workplace_incident"},
        )

        for report in second_reports:
            self.assertIsNotNone(report.extraction)
            self.assertGreater(len(report.evidence), 0)
            self.assertGreater(len(report.recommended_routes), 0)
            self.assertGreater(len(report.drafts), 0)
            self.assertTrue(all(fact.verified for fact in report.extraction.facts))

    def test_analysis_falls_back_to_local_rules_when_network_is_unavailable(self) -> None:
        created = create_report(
            ReportCreate(
                narrative=(
                    "Last night someone sent me a fake UPI payment request and money was debited. "
                    "I have screenshots and the bank SMS."
                )
            )
        )
        report_id = created.id

        with patch.dict("os.environ", {"OPENAI_API_KEY": "demo-key"}, clear=False):
            with patch("app.extraction.urlopen", side_effect=URLError("offline")):
                analyzed = analyze_report(report_id)

        self.assertEqual(analyzed.extraction.incident_type.value, "financial_fraud")
        self.assertGreater(len(analyzed.extraction.facts), 0)


if __name__ == "__main__":
    unittest.main()
