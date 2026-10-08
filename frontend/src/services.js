const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error("Could not reach the local API. Check that the backend is running.");
  }

  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.detail || "The request could not be completed.");
  return data;
}

export const createReport = (narrative) => request("/reports", {
  method: "POST",
  body: JSON.stringify({ narrative }),
});

export const listReports = () => request("/reports");
export const getReport = (reportId) => request(`/reports/${reportId}`);
export const analyzeReport = (reportId) => request(`/reports/${reportId}/analyze`, { method: "POST" });
export const verifyFact = (reportId, factId, verified, value = null) => request(`/reports/${reportId}/facts/${factId}`, {
  method: "PATCH",
  body: JSON.stringify({ verified, ...(value !== null ? { value } : {}) }),
});
export const answerFollowUp = (reportId, field, answer) => request(`/reports/${reportId}/answers/${encodeURIComponent(field)}`, {
  method: "PATCH",
  body: JSON.stringify({ answer }),
});
export const addEvidence = (reportId, item) => request(`/reports/${reportId}/evidence`, {
  method: "POST",
  body: JSON.stringify(item),
});
export const removeEvidence = (reportId, evidenceId) => request(`/reports/${reportId}/evidence/${evidenceId}`, { method: "DELETE" });
export const getTimeline = (reportId) => request(`/reports/${reportId}/timeline`);
export const addTimelineEvent = (reportId, item) => request(`/reports/${reportId}/timeline`, {
  method: "POST",
  body: JSON.stringify(item),
});
export const updateTimelineEvent = (reportId, eventId, item) => request(`/reports/${reportId}/timeline/${eventId}`, {
  method: "PATCH",
  body: JSON.stringify(item),
});
export const deleteTimelineEvent = (reportId, eventId) => request(`/reports/${reportId}/timeline/${eventId}`, {
  method: "DELETE",
});
export const reorderTimeline = (reportId, eventIds) => request(`/reports/${reportId}/timeline/reorder`, {
  method: "PUT",
  body: JSON.stringify({ event_ids: eventIds }),
});
export const getRoutes = (reportId) => request(`/reports/${reportId}/routes`);
export const createDraft = (reportId, templateId) => request(`/reports/${reportId}/drafts`, {
  method: "POST",
  body: JSON.stringify({ template_id: templateId }),
});
export const updateDraft = (reportId, draftId, content) => request(`/reports/${reportId}/drafts/${draftId}`, {
  method: "PATCH",
  body: JSON.stringify({ content }),
});
export const auditDraft = (reportId, draftId) => request(`/reports/${reportId}/drafts/${draftId}/audit`, {
  method: "POST",
});
export const getDemoNarratives = () => request("/demo/narratives");
export const generateDemoReports = () => request("/demo/reports", { method: "POST" });
