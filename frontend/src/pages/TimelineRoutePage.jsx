import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Stepper from "../components/ui/Stepper.jsx";
import Badge from "../components/ui/Badge.jsx";
import GovtPortalSuggestions from "../components/GovtPortalSuggestions.jsx";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { getReport, getRoutes, getTimeline } from "../services.js";
import { cleanLabel, clearActiveReport,
  getActiveReportId, setActiveReportId,
  isMissingReportError, templateForRoute } from "../reportUtils.js";

export default function TimelineRoutePage() {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [error, setError] = useState("");

  const reportId = getActiveReportId(params);

  useEffect(() => {
    if (!reportId) {
      setError("Start a report before choosing an authority.");
      return;
    }

    Promise.all([getReport(reportId), getTimeline(reportId), getRoutes(reportId)])
      .then(([reportValue, timelineValue, routeValue]) => {
        setReport(reportValue);
        setActiveReportId(reportValue.id);
        setTimeline(timelineValue || []);
        setRoutes(routeValue || []);
        const primary = routeValue?.find((item) => item.primary) || routeValue?.[0];
        setSelectedRoute(primary?.name || "");
      })
      .catch((requestError) => {
        if (isMissingReportError(requestError)) {
          clearActiveReport(reportId);
          navigate("/home", { replace: true });
          return;
        }
        setError(requestError.message);
      });
  }, [reportId]);

  function handleNext() {
    const route = routes.find((item) => item.name === selectedRoute) || routes[0];
    const template = templateForRoute(route?.name, report?.extraction?.incident_type);
    sessionStorage.setItem(`awaaz-route-${report.id}`, route?.name || "");
    sessionStorage.setItem(`awaaz-template-${report.id}`, template);
    navigate(`/reports/${report.id}/draft`);
  }

  const primaryRoute = routes.find((item) => item.name === selectedRoute) || routes.find((item) => item.primary) || routes[0];

  return (
    <AppLayout>
      <TopBar
        title="Authority Recommendation"
        subtitle="Review timeline and choose the department that fits this report."
        showBack
        showClose
        onClose={() => navigate("/home")}
      />

      <div className="mb-6">
        <Stepper currentStep={4} />
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      {report && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 space-y-6 border-slate-100 shadow-card">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Incident Timeline
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Category: {cleanLabel(report.extraction?.incident_type || "Not analyzed")}
                  </p>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">
                  {timeline.length ? timeline.map((event) => (
                    <div key={event.id} className="relative group">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                      <div>
                        <span className="text-[11px] font-semibold text-primary block">
                          {event.date_text}
                        </span>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500">No timeline events yet.</p>
                  )}
                </div>
              </Card>

              <EmergencyNumbers category={report.extraction?.incident_type || "default"} compact />
            </div>

            <div className="lg:col-span-7 space-y-5">
              {primaryRoute && (
                <Card className="p-6 md:p-8 space-y-5 border-primary-border/60 bg-gradient-to-br from-white via-white to-primary-lavender/20 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-lavender text-primary flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {primaryRoute.name}
                          </h3>
                          {primaryRoute.primary && <Badge variant="recommended">Recommended</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {primaryRoute.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Why this fits:
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{primaryRoute.caveat}</span>
                    </div>
                  </div>

                  <Button variant="pill" size="md" showArrow onClick={handleNext}>
                    Select Department & Draft
                  </Button>
                </Card>
              )}

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Authority Options
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {routes.map((route) => (
                    <Card
                      key={route.name}
                      hover
                      padding="p-4"
                      onClick={() => setSelectedRoute(route.name)}
                      className={`space-y-2 cursor-pointer ${selectedRoute === route.name ? "border-primary ring-4 ring-primary-light/40" : ""}`}
                    >
                      <h5 className="text-xs font-bold text-slate-900">
                        {route.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {route.reason}
                      </p>
                      <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 pt-1">
                        {selectedRoute === route.name ? "Selected" : "Choose"}
                      </span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <GovtPortalSuggestions category={report.extraction?.incident_type || "default"} />
        </div>
      )}
    </AppLayout>
  );
}
