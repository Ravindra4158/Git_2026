from app.models import EvidenceType, IncidentType


DEMO_NARRATIVES = [
    {
        "key": "online-harassment",
        "title": "Online harassment",
        "category": IncidentType.CYBER_HARASSMENT,
        "narrative": (
            "For about two weeks, someone has been messaging me on Instagram and threatening to share private photos. "
            "After I blocked the first account, another account contacted me. I have saved screenshots."
        ),
        "evidence": [
            {
                "type": EvidenceType.SCREENSHOT,
                "description": "Saved screenshots of the Instagram messages and second account.",
                "source": "Phone gallery",
            }
        ],
    },
    {
        "key": "payment-scam",
        "title": "Payment scam",
        "category": IncidentType.FINANCIAL_FRAUD,
        "narrative": (
            "Yesterday afternoon I received a text about an electricity bill and followed a payment link. "
            "After I entered my UPI PIN, money was taken from my bank account. "
            "I have the bank message but need to find the transaction reference."
        ),
        "evidence": [
            {
                "type": EvidenceType.MESSAGE,
                "description": "Bank debit message and the suspicious electricity bill text.",
                "source": "SMS inbox",
            }
        ],
    },
    {
        "key": "workplace-pressure",
        "title": "Workplace incident",
        "category": IncidentType.WORKPLACE_INCIDENT,
        "narrative": (
            "My supervisor has repeatedly contacted me late at night on WhatsApp for personal conversations. "
            "When I asked to keep messages work-related, they said it could affect my performance review."
        ),
        "evidence": [
            {
                "type": EvidenceType.MESSAGE,
                "description": "WhatsApp chat screenshots showing late-night messages.",
                "source": "WhatsApp",
            }
        ],
    },
]
