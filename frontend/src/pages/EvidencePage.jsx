import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Stepper from "../components/ui/Stepper.jsx";
import FileRow from "../components/ui/FileRow.jsx";
import ChecklistItem from "../components/ui/ChecklistItem.jsx";
import { Plus, Upload, Loader2, Sparkles, X, CheckCircle2 } from "lucide-react";
import { getReport, addEvidence, removeEvidence } from "../services.js";
import { clearActiveReport,
  getActiveReportId, setActiveReportId, isMissingReportError } from "../reportUtils.js";
import { createWorker } from "tesseract.js";

const DEFAULT_CHECKLIST = [
  { id: "c1", label: "Screenshots / Images", checked: false },
  { id: "c2", label: "Links / URLs", checked: false },
  { id: "c3", label: "Emails / Documents", checked: false },
  { id: "c4", label: "Other relevant files", checked: false },
  { id: "c5", label: "Profile URL", checked: false },
  { id: "c6", label: "Username", checked: false },
];

export default function EvidencePage() {
  const params = useParams();
  const navigate = useNavigate();
  const reportId = getActiveReportId(params);

  const [files, setFiles] = useState([]);
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [showModal, setShowModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("screenshot");
  const [ocrText, setOcrText] = useState("");
  const [ocrScanning, setOcrScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reportId) {
      setError("Start a report before adding evidence.");
      return;
    }

    getReport(reportId)
      .then((rep) => {
        setActiveReportId(rep.id);
        const mapped = (rep.evidence || []).map((e, idx) => ({
          id: e.id || `ev-${idx}`,
          name: e.description || `Evidence_${idx + 1}`,
          meta: `${e.type?.replaceAll("_", " ") || "Evidence"}${e.source ? ` • ${e.source}` : ""}`,
          status: "Verified",
          fileType: e.type === "url" ? "link" : e.type === "document" ? "document" : "image",
        }));
        setFiles(mapped);
        setChecklist((items) => items.map((item) => ({
          ...item,
          checked: mapped.some((file) => file.meta.toLowerCase().includes(item.label.split(" ")[0].toLowerCase())),
        })));
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

  // Handle OCR scan with Tesseract.js
  async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadName(file.name);
    setSelectedImage(URL.createObjectURL(file));

    if (file.type.startsWith("image/")) {
      setOcrScanning(true);
      try {
        const worker = await createWorker("eng");
        const ret = await worker.recognize(file);
        setOcrText(ret.data.text.trim());
        await worker.terminate();
      } catch (err) {
                No evidence notes added yet.
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="pill"
              size="md"
              showArrow
              onClick={() => navigate(reportId ? `/reports/${reportId}/recommendation` : "/home")}
            >
              Continue to Timeline & Route
            </Button>
          </div>
        </div>

        {/* Right: Checklist Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 space-y-4 border-slate-100 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Evidence Checklist
              </h3>
              <span className="text-xs font-semibold text-primary">
                {verifiedCount} added
              </span>
            </div>

<<<<<<< HEAD
          {/* Tab 2: Evidence Exhibits */}
          {activeTab === "evidence" && (
            <section className="flow-card">
              <div className="panel-heading">
                <div>
                  <span className="mini-label">CHAIN OF CUSTODY</span>
                  <h2>Evidence &amp; Exhibits</h2>
                </div>
                <span className="count-chip">{evidence.length} exhibits</span>
              </div>
              <p className="muted-copy">
                Each item is tagged with an official exhibit reference ([Exhibit A], [Exhibit B]) and incorporated into your final complaint.
              </p>

              <div className="evidence-fields">
                <label>
                  Type
                  <select value={type} onChange={(event) => setType(event.target.value)}>
                    <option value="screenshot">Screenshot</option>
                    <option value="message">Message</option>
                    <option value="document">Document</option>
                    <option value="url">Link</option>
                    <option value="transaction_reference">Transaction reference</option>
                    <option value="photo_video">Photo or video</option>
                    <option value="ocr_extracted">OCR Extracted Text</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Description
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={500}
                    placeholder="e.g., Screenshot of abusive messages with handle visible"
                  />
                </label>
                <label>
                  Reference / File ID (optional)
                  <input
                    value={source}
                    onChange={(event) => setSource(event.target.value)}
                    maxLength={500}
                    placeholder="File name, URL, or UPI reference ID"
                  />
                </label>
              </div>
              <div className="evidence-actions-row">
                <button className="secondary-button" type="button" disabled={!description.trim() || busy} onClick={addItem}>
                  {busy ? "Adding…" : "＋ Add Evidence Exhibit"}
                </button>
                <button className="tab-btn" type="button" onClick={() => setActiveTab("ocr")}>
                  🔍 Scan Image for Text →
                </button>
              </div>

              {evidence.length ? (
                <ul className="evidence-list">
                  {evidence.map((item, idx) => {
                    const exhibitLabel = `[Exhibit ${chrFromIdx(idx + 1)}]`;
                    return (
                      <li key={item.id}>
                        <span className="exhibit-tag">{exhibitLabel}</span>
                        <span className="evidence-kind">{item.type.replaceAll("_", " ")}</span>
                        <span className="evidence-description">
                          <strong>{item.description}</strong>
                          {item.source && <small>Ref: {item.source}</small>}
                        </span>
                        <button className="remove-button" type="button" onClick={() => deleteItem(item.id)}>Remove</button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="muted-copy">No evidence exhibits added yet. You can continue without them or attach notes above.</p>
              )}
            </section>
          )}

          {/* Tab 3: OCR Image Scan */}
          {activeTab === "ocr" && (
            <section className="flow-card ocr-section">
              <div className="panel-heading">
                <div>
                  <span className="mini-label">IMAGE TEXT EXTRACTION</span>
                  <h2>OCR — Scan Evidence Images</h2>
                </div>
              </div>
              <p className="muted-copy">
                Upload a screenshot, photo of a document, or any image containing text. AWAAZ performs OCR locally in your browser and never uploads the image to a server.
              </p>

              {/* Drop zone */}
=======
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
>>>>>>> 42cf9ec (final)
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-1 divide-y divide-slate-100">
              {checklist.map((item) => (
                <ChecklistItem
                  key={item.id}
                  label={item.label}
                  checked={item.checked}
                  onToggle={() => handleToggleCheck(item.id)}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Upload & OCR Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4 shadow-modal">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-slate-900">
                  Upload Evidence & Scan OCR
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Evidence Label / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Threat message screenshot"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="screenshot">Screenshot / Image</option>
                  <option value="message">Message / Chat</option>
                  <option value="url">Profile Link / URL</option>
                  <option value="document">PDF / Document</option>
                  <option value="transaction_reference">Transaction Reference</option>
                  <option value="photo_video">Photo / Video</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* File upload input */}
              <div className="border-2 border-dashed border-slate-200 hover:border-primary rounded-xl p-4 text-center cursor-pointer relative bg-slate-50/50">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  Drop screenshot or browse file
                </p>
                <p className="text-[10px] text-slate-400">
                  PNG, JPG, PDF supported
                </p>
              </div>

              {/* OCR Scanning indicator */}
              {ocrScanning && (
                <div className="flex items-center gap-2 p-3 bg-primary-lavender/40 text-primary rounded-xl text-xs font-medium animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI OCR reading text from image…</span>
                </div>
              )}

              {/* OCR Result preview */}
              {ocrText && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>OCR Extracted Text:</span>
                  </span>
                  <div className="max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono">
                    {ocrText}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!uploadName.trim()}
                onClick={handleSaveEvidence}
              >
                Add to Evidence
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
