import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Stepper from "../components/ui/Stepper.jsx";
import { Building2, CheckCircle, FileText, ShieldAlert, WalletCards } from "lucide-react";
import { createDraft, getReport } from "../services.js";
import {
  TEMPLATE_OPTIONS,
  formatForTemplate,
  clearActiveReport,
  getActiveReportId,
  setActiveReportId,
  isMissingReportError,
  templateForIncidentType,
  templateForRoute,
} from "../reportUtils.js";

export default function DraftsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reportId = getActiveReportId(params);

  useEffect(() => {
    if (!reportId) {
      setError("Start a report before generating a draft.");
      return;
    }

    getReport(reportId)
      .then((value) => {
        setReport(value);
        setActiveReportId(value.id);
        const primaryRoute = value.recommended_routes?.find((route) => route.primary) || value.recommended_routes?.[0];
        const stored = sessionStorage.getItem(`awaaz-template-${value.id}`);
        const fallback = templateForRoute(primaryRoute?.name, value.extraction?.incident_type);
        setSelectedFormat(stored || fallback);
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

  const recommendedTemplate = useMemo(() => {
    const primaryRoute = report?.recommended_routes?.find((route) => route.primary) || report?.recommended_routes?.[0];
    return templateForRoute(primaryRoute?.name, report?.extraction?.incident_type);
  }, [report]);

  const getFormatIcon = (id) => {
    switch (id) {
      case "cyber_incident":
        return ShieldAlert;
      case "financial_incident":
        return WalletCards;
      case "workplace_report":
        return Building2;
      case "police_report":
      default:
        return FileText;
    }
  };

  async function handleGenerate() {
    if (!report?.id || !selectedFormat) return;
    setBusy(true);
    setError("");
    try {
      const draft = await createDraft(report.id, selectedFormat);
      sessionStorage.setItem(`awaaz-template-${report.id}`, selectedFormat);
      sessionStorage.setItem(`awaaz-draft-${report.id}`, draft.id);
      navigate(`/reports/${report.id}/review`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const selectedMeta = formatForTemplate(selectedFormat || templateForIncidentType(report?.extraction?.incident_type));

  return (
    <AppLayout>
      <TopBar
        title="Authority-Specific Draft"
        subtitle="Choose the department format before AWAAZ generates the report."
        showBack
        showClose
        onClose={() => navigate("/home")}
      />

      <div className="mb-6">
        <Stepper currentStep={6} />
      </div>

      <div className="max-w-4xl mx-auto space-y-6 w-full">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Select the correct department format
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Recommended default: {formatForTemplate(recommendedTemplate).authority}. You can still choose another format if needed.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEMPLATE_OPTIONS.map((fmt) => {
            const Icon = getFormatIcon(fmt.id);
            const isSelected = selectedFormat === fmt.id;
            const isRecommended = recommendedTemplate === fmt.id;

            return (
              <Card
                key={fmt.id}
                hover
                onClick={() => setSelectedFormat(fmt.id)}
                className={`relative p-5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-primary ring-4 ring-primary-light/50 bg-primary-lavender/10"
                    : "border-slate-200/80"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-primary">
                    <CheckCircle className="w-5 h-5 fill-primary text-white" />
                  </div>
                )}

                <div className="w-10 h-10 rounded-xl bg-primary-lavender text-primary flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{fmt.title}</h3>
                  {isRecommended && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-primary block mt-0.5">
                  {fmt.subtitle}
                </span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {fmt.desc}
                </p>
              </Card>
            );
          })}
        </div>

        <Card className="p-5 bg-primary-lavender/20 border-primary-border/40">
          <p className="text-xs text-slate-600">
            Selected draft will be addressed to <strong>{selectedMeta.authority}</strong> and generated only from the report facts, timeline, and evidence saved in this backend session.
          </p>
        </Card>

        <div className="pt-4 flex justify-end">
          <Button variant="pill" size="lg" showArrow onClick={handleGenerate} disabled={busy || !report?.extraction}>
            {busy ? "Generating..." : "Generate Correct Draft"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
