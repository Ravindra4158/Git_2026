from app.models import IncidentType, RecommendedRoute


_ROUTES = {
    IncidentType.CYBER_HARASSMENT: [
        RecommendedRoute(
            name="Cyber Crime Cell / National Cyber Crime Reporting Portal",
            reason="The described incident involves online activity or communication.",
            caveat="Check the current official reporting options for your location.",
            primary=True,
        ),
        RecommendedRoute(
            name="Local police or public safety service",
            reason="A local service may be relevant, especially if there are threats or immediate safety concerns.",
            caveat="If someone is in immediate danger, contact local emergency services.",
        ),
    ],
    IncidentType.FINANCIAL_FRAUD: [
        RecommendedRoute(
            name="Bank Fraud Cell / RBI Ombudsman / 1930 Cyber Fraud Helpline",
            reason="The incident description involves a payment or account transaction.",
            caveat="Use the contact details published by your bank or payment provider.",
            primary=True,
        ),
        RecommendedRoute(
            name="Cyber Crime Cell / National Cyber Crime Reporting Portal",
            reason="A digital payment or online scam may also be reported through an official cyber channel.",
            caveat="Available reporting options vary by location; confirm through official sources.",
        ),
    ],
    IncidentType.WORKPLACE_INCIDENT: [
        RecommendedRoute(
            name="Internal Complaints Committee (ICC) / Human Resources",
            reason="The description relates to a workplace situation.",
            caveat="Review your organization's current policies and available support options.",
            primary=True,
        ),
        RecommendedRoute(
            name="External public grievance or labour authority",
            reason="An external option may be relevant depending on the situation and location.",
            caveat="This prototype cannot determine legal rights or jurisdiction.",
        ),
    ],
    IncidentType.PHYSICAL_THREAT: [
        RecommendedRoute(
            name="Local Police Station / Station House Officer (SHO)",
            reason="The story is classified as involving a reported physical threat.",
            caveat="If someone is in immediate danger, contact local emergency services.",
            primary=True,
        ),
    ],
    IncidentType.OTHER: [
        RecommendedRoute(
            name="Relevant local police or organizational authority",
            reason="The incident category is unclear, so a suitable reporting route cannot be determined here.",
            caveat="Consider checking official local information or a trusted support service.",
            primary=True,
        ),
    ],
}


def recommend_routes(incident_type: IncidentType) -> list[RecommendedRoute]:
    return [route.model_copy(deep=True) for route in _ROUTES[incident_type]]
