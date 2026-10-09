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
    {
        "key": "physical-threat",
        "title": "Physical threat",
        "category": IncidentType.PHYSICAL_THREAT,
        "narrative": (
            "A neighbour has been following me near my lane for the last three evenings and threatened to harm me if I complained. "
            "I noted the time and place and my friend saw one incident."
        ),
        "evidence": [
            {
                "type": EvidenceType.OTHER,
                "description": "Friend witnessed the threat near the lane in the evening.",
                "source": "Witness note",
            }
        ],
    },
    {
        "key": "consumer-cyber-scam",
        "title": "Fake shopping scam",
        "category": IncidentType.FINANCIAL_FRAUD,
        "narrative": (
            "I ordered a phone from a social media seller after paying an advance through UPI. "
            "The seller stopped responding, deleted the product post, and the courier tracking number appears fake."
        ),
        "evidence": [
            {
                "type": EvidenceType.TRANSACTION_REFERENCE,
                "description": "UPI payment reference and seller chat screenshots.",
                "source": "UPI app and social media chat",
            }
        ],
    },

]
