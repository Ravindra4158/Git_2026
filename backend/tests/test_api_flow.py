import unittest

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

        evidence = add_evidence(
            report_id,
            EvidenceCreate(type="message", description="Bank debit message", source="SMS inbox"),
        )
        self.assertEqual(len(evidence.evidence), 1)

        routes = get_routes(report_id)
        self.assertTrue(any(route.primary for route in routes))

        draft = create_draft(report_id, DraftCreate(template_id="financial_incident"))
        self.assertIn("Verified details", draft.content)

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


if __name__ == "__main__":
    unittest.main()
