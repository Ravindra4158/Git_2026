import React from "react";
import { RouteView, Router } from "./router.jsx";
import SiteLayout from "./layout/SiteLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ReportIncidentPage from "./pages/ReportIncidentPage.jsx";
import IncidentIntakePage from "./pages/IncidentIntakePage.jsx";
import AnalysisPage from "./pages/AnalysisPage.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import EvidencePage from "./pages/EvidencePage.jsx";
import RecommendationPage from "./pages/RecommendationPage.jsx";
import DraftPage from "./pages/DraftPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import SaveExportPage from "./pages/SaveExportPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

export default function App() {
  const routes = [
    { path: "/", component: LandingPage },
    { path: "/report", component: ReportIncidentPage },
    { path: "/report/describe", component: IncidentIntakePage },
    { path: "/reports/:reportId/analysis", component: AnalysisPage },
    { path: "/reports/:reportId/summary", component: SummaryPage },
    { path: "/reports/:reportId/evidence", component: EvidencePage },
    { path: "/reports/:reportId/recommendation", component: RecommendationPage },
    { path: "/reports/:reportId/draft", component: DraftPage },
    { path: "/reports/:reportId/review", component: ReviewPage },
    { path: "/reports/:reportId/save", component: SaveExportPage },
    { path: "/dashboard", component: DashboardPage },
  ];

  return (
    <Router>
      <SiteLayout>
        <RouteView routes={routes} />
      </SiteLayout>
    </Router>
  );
}
