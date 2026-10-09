import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Stepper from "../components/ui/Stepper.jsx";
import { HeartHandshake } from "lucide-react";
import { answerFollowUp, getReport } from "../services.js";
import { clearActiveReport,
  getActiveReportId, setActiveReportId, isMissingReportError } from "../reportUtils.js";

export default function MissingInfoPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [answers, setAnswers] = useState({});
  const [busyField, setBusyField] = useState("");
  const [error, setError] = useState("");

  const reportId = getActiveReportId(params);

  useEffect(() => {
    if (!reportId) {
      setError("Start a report before reviewing missing information.");
      return;
    }

    getReport(reportId)
      .then((value) => {
        setReport(value);
        setActiveReportId(value.id);
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

  function handleChange(field, value) {
    setAnswers((current) => ({ ...current, [field]: value }));
  }

  async function saveAnswer(item) {
    const answer = (answers[item.field] || "").trim();
    if (!answer || !report?.id) return;
    setBusyField(item.field);
    setError("");
    try {
      const updated = await answerFollowUp(report.id, item.field, answer);
      setReport(updated);
      setAnswers((current) => ({ ...current, [item.field]: "" }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyField("");
    }
  }

  function handleNext() {
    navigate(report?.id ? `/reports/${report.id}/evidence` : "/home");
  }

  return (
    <AppLayout>
      <TopBar
        title="Incident Summary"
        subtitle="Add optional details before AWAAZ recommends the right department."
        showBack
        showClose
        onClose={() => navigate("/home")}
      />

      <div className="mb-6">
        <Stepper currentStep={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Fill gaps if you know them
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                These answers become verified facts and can be used in the department-specific draft.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {report?.missing_information?.length ? report.missing_information.map((item) => (
                <div key={item.field} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {item.question}
                  </label>
                  <p className="text-[11px] text-slate-400">{item.reason}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a detail, if you know it"
                      value={answers[item.field] || ""}
                      onChange={(event) => handleChange(item.field, event.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={busyField === item.field || !(answers[item.field] || "").trim()}
                      onClick={() => saveAnswer(item)}
                    >
                      {busyField === item.field ? "Saving..." : "Add"}
                    </Button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-600">
                  No missing details remain. Continue to authority recommendation.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip For Now
              </button>

              <Button variant="pill" size="md" showArrow onClick={handleNext}>
                Continue to Authority
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="p-6 bg-gradient-to-br from-white via-primary-lavender/40 to-white text-center space-y-4 border-primary-border/40">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-lavender text-primary flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              You can continue without every answer.
            </p>
            <p className="text-xs text-slate-500">
              AWAAZ only uses details that are in the report session and reviewed by you.
            </p>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
