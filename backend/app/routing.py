from app.models import IncidentType, RecommendedRoute


_ROUTES = {
    IncidentType.CYBER_HARASSMENT: [
        RecommendedRoute(
            name="Cyber incident reporting channel",
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
            name="Bank or payment provider support",
            reason="The incident description involves a payment or account transaction.",
            caveat="Use the contact details published by your bank or payment provider.",
            primary=True,
        ),
        RecommendedRoute(
            name="Official cyber incident reporting channel",
            reason="A digital payment or online scam may also be reported through an official cyber channel.",
            caveat="Available reporting options vary by location; confirm through official sources.",
        ),
    ],
    IncidentType.WORKPLACE_INCIDENT: [
        RecommendedRoute(
            name="Workplace reporting or support channel",
            reason="The description relates to a workplace situation.",
            caveat="Review your organization's current policies and available support options.",
            primary=True,
        ),
        RecommendedRoute(
            name="External support or public authority",
            reason="An external option may be relevant depending on the situation and location.",
            caveat="This prototype cannot determine legal rights or jurisdiction.",
        ),
    ],
    IncidentType.PHYSICAL_THREAT: [
        RecommendedRoute(
            name="Local police or public safety service",
            reason="The story is classified as involving a reported physical threat.",
            caveat="If someone is in immediate danger, contact local emergency services.",
            primary=True,
        ),
    ],
    IncidentType.OTHER: [
        RecommendedRoute(
            name="A relevant local or organizational support channel",
            reason="The incident category is unclear, so a suitable reporting route cannot be determined here.",
            caveat="Consider checking official local information or a trusted support service.",
            primary=True,
        ),
    ],
}


def recommend_routes(incident_type: IncidentType) -> list[RecommendedRoute]:
    return [route.model_copy(deep=True) for route in _ROUTES[incident_type]]
