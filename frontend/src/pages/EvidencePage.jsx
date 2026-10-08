import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import {
  addEvidence,
  addTimelineEvent,
  deleteTimelineEvent,
  getReport,
  removeEvidence,
  reorderTimeline,
  updateTimelineEvent,
} from "../services.js";

export default function EvidencePage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline"); // "timeline" | "evidence"

  // Evidence state
  const [type, setType] = useState("screenshot");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");

  // Timeline new event state
  const [newDateText, setNewDateText] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Timeline editing state
  const [editingEventId, setEditingEventId] = useState(null);
  const [editDateText, setEditDateText] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReport(reportId).then(setReport).catch((e) => setError(e.message));
  }, [reportId]);

  // Evidence handlers
  async function addItem() {
    if (!description.trim()) return;
    setBusy(true); setError("");
    try {
      setReport(await addEvidence(reportId, { type, description: description.trim(), source: source.trim() || null }));
      setDescription(""); setSource("");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function deleteItem(id) {
    try { setReport(await removeEvidence(reportId, id)); }
    catch (e) { setError(e.message); }
  }

  // Timeline handlers
  async function handleAddEvent() {
    if (!newDateText.trim() || !newDescription.trim()) return;
    setBusy(true); setError("");
    try {
      setReport(await addTimelineEvent(reportId, { date_text: newDateText.trim(), description: newDescription.trim() }));
      setNewDateText("");
      setNewDescription("");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  function startEditEvent(event) {
    setEditingEventId(event.id);
    setEditDateText(event.date_text);
    setEditDescription(event.description);
  }

  async function saveEditEvent(eventId) {
    if (!editDateText.trim() || !editDescription.trim()) return;
    setBusy(true); setError("");
    try {
      setReport(await updateTimelineEvent(reportId, eventId, { date_text: editDateText.trim(), description: editDescription.trim() }));
      setEditingEventId(null);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function handleDeleteEvent(eventId) {
    setBusy(true); setError("");
    try {
      setReport(await deleteTimelineEvent(reportId, eventId));
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function moveEvent(index, direction) {
    if (!report?.timeline) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= report.timeline.length) return;
    const items = [...report.timeline];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    const eventIds = items.map((item) => item.id);
    setBusy(true); setError("");
    try {
      setReport(await reorderTimeline(reportId, eventIds));
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  const timeline = report?.timeline || [];
  const evidence = report?.evidence || [];

  return (
    <FlowFrame step={3} title="Evidence & Chronological Timeline" description="Verify chronological sequence of events and catalog evidence exhibits for official complaint filing.">
      {!report ? (
        <p>{error || "Loading your report…"}</p>
      ) : (
        <>
          {/* Navigation Tabs */}
          <div className="tab-control-bar">
            <button
              type="button"
              className={`tab-btn ${activeTab === "timeline" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              📅 Chronological Timeline ({timeline.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "evidence" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("evidence")}
            >
              📎 Evidence Exhibits ({evidence.length})
            </button>
          </div>

          {/* Tab 1: Chronological Timeline */}
          {activeTab === "timeline" && (
            <section className="flow-card">
              <div className="panel-heading">
                <div>
                  <span className="mini-label">CHRONOLOGY ENGINE</span>
                  <h2>Incident Timeline</h2>
                </div>
                <span className="count-chip">{timeline.length} milestones</span>
              </div>
              <p className="muted-copy">
                Events are arranged chronologically. You can edit dates, add missing milestones, or reorder entries to ensure legal accuracy.
              </p>

              {/* Add New Milestone */}
              <div className="timeline-add-box">
                <div className="evidence-fields">
                  <label>
                    Date / Time
                    <input
                      value={newDateText}
                      onChange={(e) => setNewDateText(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., Yesterday afternoon, Oct 8"
                    />
                  </label>
                  <label>
                    What happened?
                    <input
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      maxLength={500}
                      placeholder="e.g., Received threatening direct message from suspect account"
                    />
                  </label>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  disabled={!newDateText.trim() || !newDescription.trim() || busy}
                  onClick={handleAddEvent}
                >
                  {busy ? "Adding…" : "＋ Add Timeline Milestone"}
                </button>
              </div>

              {/* Timeline List */}
              {timeline.length ? (
                <ul className="interactive-timeline-list">
                  {timeline.map((event, index) => {
                    const isEditing = editingEventId === event.id;
                    return (
                      <li key={event.id} className="timeline-item-card">
                        <div className="timeline-item-header">
                          <span className="timeline-step-badge">#{index + 1}</span>
                          {!isEditing ? (
                            <span className="timeline-date-chip">{event.date_text}</span>
                          ) : (
                            <input
                              className="edit-input-field"
                              value={editDateText}
                              onChange={(e) => setEditDateText(e.target.value)}
                              placeholder="Date / Time"
                            />
                          )}
                          <div className="timeline-item-actions">
                            <button
                              type="button"
                              className="reorder-btn"
                              disabled={index === 0 || busy}
                              onClick={() => moveEvent(index, -1)}
                              title="Move Earlier"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              className="reorder-btn"
                              disabled={index === timeline.length - 1 || busy}
                              onClick={() => moveEvent(index, 1)}
                              title="Move Later"
                            >
                              ▼
                            </button>
                            {!isEditing ? (
                              <button
                                type="button"
                                className="small-action-btn"
                                onClick={() => startEditEvent(event)}
                              >
                                Edit
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="small-action-btn save-btn"
                                onClick={() => saveEditEvent(event.id)}
                              >
                                Save
                              </button>
                            )}
                            <button
                              type="button"
                              className="remove-button"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {!isEditing ? (
                          <div className="timeline-item-body">
                            <p className="timeline-desc">{event.description}</p>
                            {event.source_snippet && (
                              <blockquote className="timeline-source">
                                Source: “{event.source_snippet}”
                              </blockquote>
                            )}
                          </div>
                        ) : (
                          <div className="timeline-item-edit-body">
                            <textarea
                              className="edit-textarea-field"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Milestone description"
                            />
                            <button
                              type="button"
                              className="text-link"
                              onClick={() => setEditingEventId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="muted-copy">No chronological events extracted yet. You can add milestones above.</p>
              )}
            </section>
          )}

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
              <button
                className="secondary-button"
                type="button"
                disabled={!description.trim() || busy}
                onClick={addItem}
              >
                {busy ? "Adding…" : "＋ Add Evidence Exhibit"}
              </button>

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
                        <button className="remove-button" type="button" onClick={() => deleteItem(item.id)}>
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="muted-copy">No evidence exhibits added yet. You can continue without them or attach notes above.</p>
              )}
            </section>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="page-actions">
            <Link className="text-link" to={`/reports/${reportId}/summary`}>← Back to summary</Link>
            <button
              className="primary-cta"
              type="button"
              onClick={() => navigate(`/reports/${reportId}/recommendation`)}
            >
              Continue to authority recommendation <span aria-hidden="true">→</span>
            </button>
          </div>
        </>
      )}
    </FlowFrame>
  );
}

function chrFromIdx(num) {
  return num <= 26 ? String.fromCharCode(64 + num) : String(num);
}
