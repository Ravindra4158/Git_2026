import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import VoiceInput from "../components/VoiceInput.jsx";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
import { Paperclip, Image, Link2, Sparkles, AlertCircle } from "lucide-react";
import { createReport, listReports } from "../services.js";
import { loadDemoNarratives, seedDemoReports } from "../data/api.js";
import { cleanLabel, nextReportPath, reportStatus, setActiveReportId } from "../reportUtils.js";

export default function HomePage() {
  const [reports, setReports] = useState([]);
  const [storyInput, setStoryInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [demoNarratives, setDemoNarratives] = useState([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  // Load recent reports from the active backend session only.
  useEffect(() => {
    loadReports();
    loadDemoNarratives().then(setDemoNarratives);
  }, []);

  async function loadReports() {
    try {
      const data = await listReports();
      setReports(data || []);
    } catch (e) {
      setError(e.message);
    }
  }

  function handleVoiceTranscript(transcript) {
    setStoryInput((prev) => {
      const joined = prev ? prev.trimEnd() + " " + transcript : transcript;
      return joined;
    });
    textareaRef.current?.focus();
  }

  async function handleStartReport() {
    if (!storyInput.trim()) {
      setError("Write the incident story before starting analysis.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const rep = await createReport(storyInput.trim());
      setActiveReportId(rep.id);
      navigate(`/reports/${rep.id}/analysis`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedDemoReports() {
    setDemoLoading(true);
    setError("");
    try {
      const seededReports = await seedDemoReports();
      setReports(seededReports || []);
      if (seededReports?.[0]?.id) {
        setActiveReportId(seededReports[0].id);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setDemoLoading(false);
    }
  }

  // Emergency SOS keywords detection
  const EMERGENCY_KEYWORDS = [
    "danger",
    "threat",
    "attack",
    "kill",
    "harm",
    "weapon",
    "emergency",
    "assault",
    "stalking",
    "blackmail",
  ];
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) =>
    storyInput.toLowerCase().includes(kw)
  );

  return (
    <AppLayout>
      <TopBar
        title="Good Morning, Anvi"
        subtitle="Let's turn your story into a structured report."
      />

      <div className="space-y-6">
        {/* Emergency SOS Banner when high-risk words detected */}
        {isEmergency && (
          <EmergencyNumbers category="cyber_harassment" compact />
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Card: Start a New Report */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-6 md:p-8 space-y-5 border-slate-100 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-lavender text-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Start a New Report
                    </h2>
                    <p className="text-xs text-slate-500">
                      Describe what happened in your own words. You can add screenshots, links or files.
                    </p>
                  </div>
                </div>

                <VoiceInput onTranscript={handleVoiceTranscript} />
              </div>

              <textarea
                ref={textareaRef}
                rows={4}
                value={storyInput}
                onChange={(e) => setStoryInput(e.target.value)}
                placeholder="e.g. Someone has been messaging me on Instagram for about two weeks..."
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-800 placeholder:text-slate-400 resize-none transition-all leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => setError("Start the report first, then add evidence from the evidence step.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach Files</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setError("Start the report first, then add screenshots from the evidence step.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Image className="w-3.5 h-3.5" />
                    <span>Add Screenshot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setError("Start the report first, then add links from the evidence step.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <Button
                  variant="pill"
                  size="md"
                  showArrow
                  disabled={saving}
                  onClick={handleStartReport}
                >
                  {saving ? "Analyzing..." : "Next"}
                </Button>
              </div>
            </Card>

            <Card className="p-5 border-dashed border-primary-border/70 bg-white/80 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Judge demo data</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Use these only when you need a quick demo. They fill real AWAAZ flows and generate backend reports.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleSeedDemoReports} disabled={demoLoading}>
                  {demoLoading ? "Loading demo..." : "Seed Demo Reports"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demoNarratives.map((demo) => (
                  <button
                    type="button"
                    key={demo.key}
                    onClick={() => {
                      setStoryInput(demo.narrative);
                      setError("");
                      textareaRef.current?.focus();
                    }}
                    className="text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-primary/40 hover:bg-primary-lavender/20 transition-colors"
                  >
                    <span className="block text-xs font-bold text-slate-900">{demo.title}</span>
                    <span className="block text-[11px] text-primary font-semibold mt-0.5">{cleanLabel(demo.category)}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Your Recent Reports Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Your Recent Reports
                </h3>
              </div>

              {reports.length ? <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reports.slice(0, 3).map((report, idx) => {
                  const title =
                    cleanLabel(report.extraction?.incident_type) ||
                    "Incident Report";
                  const time = report.created_at
                    ? new Date(report.created_at).toLocaleDateString()
                    : "Recently";
                  const status = reportStatus(report);

                  return (
                    <Card
                      key={report.id || idx}
                      hover
                      padding="p-4"
                      onClick={() => {
                        setActiveReportId(report.id);
                        navigate(nextReportPath(report));
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
                      </div>
                      <div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </Card>
                  );
                })}
              </div> : (
                <Card className="p-5 text-center">
                  <p className="text-sm font-semibold text-slate-800">No reports yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Write an incident story above to create your first report.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column: Side Quote & Helplines */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-white via-primary-lavender/30 to-brand-cream/30 border-primary-border/40 space-y-3 text-center">
              <p className="text-sm font-bold text-slate-800 italic">
                "Not just a complaint. A prepared voice."
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                AWAAZ empowers you to document facts objectively and route to the proper authority with verified legal accuracy.
              </p>
            </Card>

            <EmergencyNumbers category="cyber_harassment" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
