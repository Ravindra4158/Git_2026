import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Plus, Sparkles, Trash2, Upload, X } from "lucide-react";
import AppLayout from "../components/layout/AppLayout.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ChecklistItem from "../components/ui/ChecklistItem.jsx";
import FileRow from "../components/ui/FileRow.jsx";
import Stepper from "../components/ui/Stepper.jsx";
import { addEvidence, getReport, removeEvidence } from "../services.js";
import { clearActiveReport, getActiveReportId, isMissingReportError, setActiveReportId } from "../reportUtils.js";
import { createWorker } from "tesseract.js";

const CHECKLIST = [
  { id: "screenshots", label: "Screenshots / Images", types: ["screenshot", "photo_video"] },
  { id: "links", label: "Links / URLs", types: ["url"] },
  { id: "documents", label: "Emails / Documents", types: ["document", "message"] },
  { id: "transactions", label: "Transaction references", types: ["transaction_reference"] },
  { id: "other", label: "Other relevant files", types: ["other"] },
];

function mapEvidence(item, index) {
  return {
    ...item,
    id: item.id || `evidence-${index}`,
    name: item.description || `Evidence ${index + 1}`,
    meta: `${(item.type || "other").replaceAll("_", " ")}${item.source ? ` • ${item.source}` : ""}`,
    status: "Verified",
    fileType: item.type === "url" ? "link" : item.type === "document" ? "document" : "image",
  };
}

export default function EvidencePage() {
  const params = useParams();
  const navigate = useNavigate();
  const reportId = getActiveReportId(params);
  const [report, setReport] = useState(null);
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState("screenshot");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrScanning, setOcrScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reportId) {
      setError("Start a report before adding evidence.");
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
  }, [navigate, reportId]);

  async function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setDescription(file.name);
    setOcrText("");

    if (!file.type.startsWith("image/")) return;
    setOcrScanning(true);
    try {
      const worker = await createWorker("eng");
      const result = await worker.recognize(file);
      setOcrText(result.data.text.trim());
      await worker.terminate();
    } catch (requestError) {
      setError(`OCR could not read this image: ${requestError.message}`);
    } finally {
      setOcrScanning(false);
    }
  }

  async function handleSaveEvidence() {
    if (!reportId || !description.trim()) return;
    setBusy(true);
    setError("");
    try {
      const updated = await addEvidence(reportId, {
        type,
        description: description.trim(),
        source: source.trim() || null,
      });
      setReport(updated);
      setDescription("");
      setSource("");
      setSelectedFile(null);
      setOcrText("");
      setShowModal(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveEvidence(evidenceId) {
    if (!reportId) return;
    setBusy(true);
    setError("");
    try {
      setReport(await removeEvidence(reportId, evidenceId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const evidence = (report?.evidence || []).map(mapEvidence);
  const checkedCount = CHECKLIST.filter((item) => evidence.some((file) => item.types.includes(file.type))).length;
  const progress = (checkedCount / CHECKLIST.length) * 100;

  return (
    <AppLayout>
      <TopBar title="Evidence & Sources" subtitle="Add the files and links that support your incident report." showBack showClose onClose={() => navigate("/home")} />
      <div className="mb-6"><Stepper currentStep={3} /></div>
      {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div className="space-y-5 lg:col-span-8">
          <Card className="space-y-5 p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="text-xl font-bold text-slate-900">Your evidence</h2><p className="mt-1 text-xs text-slate-500">Keep original files and links available for review.</p></div>
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}><Plus className="mr-1.5 h-4 w-4" />Add evidence</Button>
            </div>
            <div className="space-y-3">
              {evidence.length ? evidence.map((file) => (
                <div key={file.id} className="flex items-center gap-2"><div className="min-w-0 flex-1"><FileRow file={file} /></div><button type="button" disabled={busy} onClick={() => handleRemoveEvidence(file.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${file.name}`}><Trash2 className="h-4 w-4" /></button></div>
              )) : <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">No evidence added yet.</p>}
            </div>
            <div className="flex justify-end border-t border-slate-100 pt-4"><Button variant="pill" size="md" showArrow onClick={() => navigate(reportId ? `/reports/${reportId}/recommendation` : "/home")}>Continue to Timeline & Route</Button></div>
          </Card>
        </div>

        <div className="lg:col-span-4"><Card className="space-y-4 p-6"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900">Evidence checklist</h3><span className="text-xs font-semibold text-primary">{checkedCount} added</span></div><div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div><div className="divide-y divide-slate-100">{CHECKLIST.map((item) => <ChecklistItem key={item.id} label={item.label} checked={evidence.some((file) => item.types.includes(file.type))} />)}</div></Card></div>
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><Card className="w-full max-w-lg space-y-5 p-6"><div className="flex items-center justify-between border-b border-slate-100 pb-3"><h3 className="text-base font-bold text-slate-900">Add evidence</h3><button type="button" onClick={() => setShowModal(false)} aria-label="Close"><X className="h-5 w-5 text-slate-400" /></button></div><label className="block text-xs font-semibold text-slate-700">Type<select value={type} onChange={(event) => setType(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-normal"><option value="screenshot">Screenshot / Image</option><option value="message">Message / Chat</option><option value="url">Link / URL</option><option value="document">Document</option><option value="transaction_reference">Transaction reference</option><option value="photo_video">Photo / Video</option><option value="other">Other</option></select></label><label className="block text-xs font-semibold text-slate-700">Description<input value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-normal" placeholder="What does this evidence show?" /></label><label className="block text-xs font-semibold text-slate-700">Reference (optional)<input value={source} onChange={(event) => setSource(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-normal" placeholder="File name, URL, or reference ID" /></label><div className="relative rounded-xl border-2 border-dashed border-slate-200 p-4 text-center"><input type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="absolute inset-0 cursor-pointer opacity-0" /><Upload className="mx-auto mb-1 h-5 w-5 text-slate-400" /><p className="text-xs text-slate-600">Choose an image or document</p>{selectedFile && <p className="mt-1 text-[11px] text-slate-400">{selectedFile.name}</p>}</div>{ocrScanning && <div className="flex items-center gap-2 rounded-xl bg-primary-lavender/40 p-3 text-xs text-primary"><Loader2 className="h-4 w-4 animate-spin" />Scanning image text...</div>}{ocrText && <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><div className="mb-1 flex items-center gap-1 font-semibold"><Sparkles className="h-3.5 w-3.5 text-primary" />OCR text</div>{ocrText}</div>}<div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" size="sm" disabled={busy || !description.trim()} onClick={handleSaveEvidence}>{busy ? "Adding..." : "Add evidence"}</Button></div></Card></div>}
    </AppLayout>
  );
}
