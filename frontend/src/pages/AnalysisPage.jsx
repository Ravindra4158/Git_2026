import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Stepper from "../components/ui/Stepper.jsx";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Edit3,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { analyzeReport, getReport, verifyFact } from "../services.js";
import { cleanLabel, clearActiveReport,
  getActiveReportId, setActiveReportId, isMissingReportError } from "../reportUtils.js";

export default function AnalysisPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [editingFact, setEditingFact] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [busyFactId, setBusyFactId] = useState("");
  const [error, setError] = useState("");

  const reportId = getActiveReportId(params);

  useEffect(() => {
    if (!reportId) {
      setError("Start a report before viewing analysis.");
      return;
    }

    // Fetch the report; if it has no extraction, run analysis automatically
    getReport(reportId)
      .then((value) => {
        setReport(value);
        setActiveReportId(value.id);

        if (!value.extraction) {
          runAnalysis(value.id);
        }
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

  async function runAnalysis(id) {
    setAnalyzing(true);
    setError("");
    try {
      const updated = await analyzeReport(id || reportId);
      setReport(updated);
      setActiveReportId(updated.id);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleVerify(fact, verified) {
    if (!report?.id) return;
    setBusyFactId(fact.id);
    try {
      const updated = await verifyFact(report.id, fact.id, verified);
      setReport(updated);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyFactId("");
    }
  }

  async function handleEditSave(fact) {
    if (!report?.id || !editValue.trim()) return;
    setBusyFactId(fact.id);
    try {
      const updated = await verifyFact(report.id, fact.id, true, editValue.trim());
      setReport(updated);
      setEditingFact(null);
      setEditValue("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyFactId("");
    }
  }

  function handleNext() {
    navigate(report?.id ? `/reports/${report.id}/summary` : "/home");
  }

  const extraction = report?.extraction;
  const facts = extraction?.facts || [];
  const missingInfo = report?.missing_information || [];
  const routes = report?.recommended_routes || [];
  const primaryRoute = routes.find((r) => r.primary) || routes[0];
  const verifiedCount = facts.filter((f) => f.verified).length;
  const confidence = facts.length
    ? Math.round((verifiedCount / facts.length) * 100)
    : 0;

  return (
    <AppLayout>
      <TopBar
        title="Incident Analysis"
        subtitle="AI-extracted facts from your narrative. Verify or correct each one."
        showBack
        showClose
        onClose={() => navigate("/home")}
        badgeText={extraction ? "Ready for Review" : null}
        badgeVariant="verified"
      />

      <div className="mb-6">
        <Stepper currentStep={1} />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {analyzing ? (
        <Card className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-lavender text-primary flex items-center justify-center animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>AI is analyzing your incident story…</span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Extracting facts, building a timeline, and identifying the best
            reporting authority. This may take a few seconds.
          </p>
        </Card>
      ) : extraction ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Incident Type + Extracted Facts */}
          <div className="lg:col-span-8 space-y-5">
            {/* Incident Type + Recommended Route Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 space-y-3 border-slate-100 shadow-card">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Incident Type
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-lavender text-primary flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {cleanLabel(extraction.incident_type)}
                  </span>
                </div>
              </Card>

              {primaryRoute && (
                <Card className="p-5 space-y-3 border-slate-100 shadow-card">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Recommended Route
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="text-primary"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${confidence}, 100`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary">
                        {confidence}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {primaryRoute.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {primaryRoute.reason?.slice(0, 60)}
                        {primaryRoute.reason?.length > 60 ? "…" : ""}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Extracted Facts */}
            <Card className="p-6 md:p-8 space-y-5 border-slate-100 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Extracted Facts
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {verifiedCount} of {facts.length} verified
                  </p>
                </div>
                <Badge variant={verifiedCount === facts.length ? "verified" : "in-progress"}>
                  {verifiedCount === facts.length ? "All Verified" : `${facts.length - verifiedCount} Pending`}
                </Badge>
              </div>

              <div className="space-y-3">
                {facts.map((fact) => {
                  const isEditing = editingFact === fact.id;
                  const isBusy = busyFactId === fact.id;

                  return (
                    <div
                      key={fact.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                        fact.verified
                          ? "bg-emerald-50/50 border-emerald-200/60"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {/* Fact content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-primary">
                            {cleanLabel(fact.field)}
                          </span>
                          {fact.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>

                        {isEditing ? (
                          <div className="flex gap-2 mt-1.5">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                              autoFocus
                            />
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleEditSave(fact)}
                            >
                              {isBusy ? "…" : "Save"}
                            </Button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFact(null);
                                setEditValue("");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                            {fact.value}
                          </p>
                        )}

                        {fact.source_snippet && !isEditing && (
                          <p className="text-[10px] text-slate-400 mt-1 italic truncate">
                            Source: "{fact.source_snippet}"
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      {!isEditing && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!fact.verified && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleVerify(fact, true)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                              title="Verify"
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFact(fact.id);
                              setEditValue(fact.value);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-lavender/40 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="secondary" size="md" onClick={() => navigate("/home")}>
                Back to Home
              </Button>
              <Button variant="pill" size="md" showArrow onClick={handleNext}>
                Continue to Missing Info
              </Button>
            </div>
          </div>

          {/* Right Column: Missing Information */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-6 space-y-4 border-slate-100 shadow-card">
              <h3 className="text-sm font-bold text-slate-900">
                Missing Information
              </h3>

              {missingInfo.length ? (
                <div className="space-y-3">
                  {missingInfo.map((item, idx) => (
                    <div
                      key={item.field || idx}
                      className="flex items-start gap-2 text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">
                          {cleanLabel(item.field)}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  All required information has been extracted. No gaps detected.
                </p>
              )}
            </Card>

            <Card className="p-5 bg-gradient-to-br from-white via-primary-lavender/30 to-white border-primary-border/40 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700">
                Confidence Score
              </p>
              <div className="text-3xl font-extrabold text-primary">
                {confidence}%
              </div>
              <p className="text-[11px] text-slate-500">
                {verifiedCount} of {facts.length} facts verified by you
              </p>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center space-y-4">
          <p className="text-sm font-semibold text-slate-800">
            No analysis available yet.
          </p>
          <Button
            variant="primary"
            showArrow
            onClick={() => runAnalysis()}
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Run AI Analysis"}
          </Button>
        </Card>
      )}
    </AppLayout>
  );
}
