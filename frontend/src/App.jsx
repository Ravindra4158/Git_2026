import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./components/ui/SplashScreen.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AnalysisPage from "./pages/AnalysisPage.jsx";
import MissingInfoPage from "./pages/MissingInfoPage.jsx";
import EvidencePage from "./pages/EvidencePage.jsx";
import TimelineRoutePage from "./pages/TimelineRoutePage.jsx";
import DraftsPage from "./pages/DraftsPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";

export default function App() {
  // Show splash screen for exactly 0.5 seconds on initial application load
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          {/* Landing Page (Photo 1) */}
          <Route path="/" element={<LandingPage />} />

          {/* Home / Dashboard / Start Report (Photo 2) */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/report" element={<HomePage />} />
          <Route path="/report/describe" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Step 1: Incident Analysis (Photo 3) */}
          <Route path="/report/analysis" element={<AnalysisPage />} />
          <Route path="/reports/:reportId/analysis" element={<AnalysisPage />} />

          {/* Step 2: Missing Information (Photo 4) */}
          <Route path="/report/missing-info" element={<MissingInfoPage />} />
          <Route path="/reports/:reportId/summary" element={<MissingInfoPage />} />

          {/* Step 3: Evidence Manager (Photo 5) */}
          <Route path="/report/evidence" element={<EvidencePage />} />
          <Route path="/reports/:reportId/evidence" element={<EvidencePage />} />

          {/* Step 4: Timeline & Route (Photo 6) */}
          <Route path="/report/timeline-route" element={<TimelineRoutePage />} />
          <Route path="/reports/:reportId/recommendation" element={<TimelineRoutePage />} />

          {/* Step 6: Authority Drafts (Photo 7) */}
          <Route path="/report/drafts" element={<DraftsPage />} />
          <Route path="/reports/:reportId/draft" element={<DraftsPage />} />

          {/* Report Editor & Review (Photo 8) */}
          <Route path="/report/editor" element={<EditorPage />} />
          <Route path="/reports/:reportId/review" element={<EditorPage />} />
          <Route path="/reports/:reportId/save" element={<EditorPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
