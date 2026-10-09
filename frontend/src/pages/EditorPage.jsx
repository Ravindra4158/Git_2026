import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import { ArrowLeft, Check, Copy, Download, Edit3, Paperclip, Repeat, Save, ShieldCheck } from "lucide-react";
import { auditDraft, getReport, updateDraft } from "../services.js";
import { cleanLabel, formatForTemplate, clearActiveReport,
  getActiveReportId, setActiveReportId, isMissingReportError } from "../reportUtils.js";

export default function EditorPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [draft, setDraft] = useState(null);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const reportId = getActiveReportId(params);

  useEffect(() => {
    if (!reportId) {
      setError("Start a report and generate a department draft first.");
      return;
    }

    getReport(reportId)
      .then((value) => {
        setReport(value);
        setActiveReportId(value.id);
        const storedDraftId = sessionStorage.getItem(`awaaz-draft-${value.id}`);
        const latest =
          value.drafts.find((item) => item.id === storedDraftId) ||
          value.drafts[value.drafts.length - 1];

        if (!latest) {
          setError("Generate a draft before opening the editor.");
          return;
        }

        setDraft(latest);
        setContent(latest.content);
        setSavedContent(latest.content);
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

  const format = useMemo(() => formatForTemplate(draft?.template_id), [draft]);
  const audit = draft?.audit;
  const hasUnsavedChanges = content !== savedContent;

  async function saveDraft() {
    if (!report?.id || !draft?.id) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateDraft(report.id, draft.id, content);
      setDraft(updated);
      setContent(updated.content);
      setSavedContent(updated.content);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function rerunAudit() {
    if (!report?.id || !draft?.id) return;
    setError("");
    try {
      const result = await auditDraft(report.id, draft.id);
      setDraft((current) => ({ ...current, audit: result }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function copyDraft() {
    navigator.clipboard?.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function printDraft() {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 250);
  }

  return (
    <AppLayout>
      <TopBar
        title="User Review & Edit"
        subtitle="Review the authority-specific draft before saving, copying, or printing it."
        showBack
      />

      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {!draft ? (
          <Card className="p-8 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-800">
              No generated draft is available yet.
            </p>
            <Button variant="primary" showArrow onClick={() => navigate(report?.id ? `/reports/${report.id}/draft` : "/home")}>
              Go to Draft Selection
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {format.title}
                  </span>
                  <Badge variant={audit?.is_grounded ? "verified" : "missing"}>
                    {audit?.is_grounded ? "Audit Passed" : "Needs Review"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Department: {format.authority} · Incident: {cleanLabel(report?.extraction?.incident_type || "Not analyzed")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" onClick={copyDraft}>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
                <Button variant="secondary" size="sm" onClick={saveDraft} disabled={!hasUnsavedChanges || saving}>
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Edits"}</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <Card className="lg:col-span-8 p-6 md:p-8 space-y-5 bg-white border-slate-200 shadow-card">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Authority-Specific Draft
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Format: {format.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/80">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{Math.round((audit?.grounding_score ?? 1) * 100)}% grounded</span>
                  </div>
                </div>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="min-h-[560px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/40 p-5 font-mono text-xs leading-6 text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Generated report draft"
                />
              </Card>

              <div className="lg:col-span-4 space-y-4">
                <Card className="p-6 space-y-4 border-slate-100 shadow-card">
                  <h4 className="text-sm font-bold text-slate-900">Draft Actions</h4>
                  <div className="space-y-1.5 text-xs font-medium text-slate-700">
                    <button
                      type="button"
                      onClick={saveDraft}
                      disabled={!hasUnsavedChanges || saving}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors disabled:opacity-50"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                      <span>{hasUnsavedChanges ? "Save edited draft" : "All edits saved"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/reports/${report.id}/evidence`)}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                    >
                      <Paperclip className="w-4 h-4 text-slate-500" />
                      <span>Add Evidence</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/reports/${report.id}/recommendation`)}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                    >
                      <Repeat className="w-4 h-4 text-slate-500" />
                      <span>Change Department Route</span>
                    </button>

                    <button
                      type="button"
                      onClick={printDraft}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>{downloading ? "Preparing..." : "Download / Print"}</span>
                    </button>
                  </div>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-white via-primary-lavender/30 to-white border-primary-border/40 space-y-2">
                  <p className="text-xs font-bold text-slate-800">
                    Grounding Audit
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {audit?.audit_notes || "Audit will run when the draft is generated or saved."}
                  </p>
                  <Button variant="secondary" size="sm" onClick={rerunAudit}>
                    Recheck Draft
                  </Button>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate(`/reports/${report.id}/draft`)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Draft Formats</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                showArrow
                onClick={printDraft}
              >
                Save / Download / Share
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
