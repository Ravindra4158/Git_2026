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

export const getReport = (reportId) => request(`/reports/${reportId}`);
export const analyzeReport = (reportId) => request(`/reports/${reportId}/analyze`, { method: "POST" });
export const verifyFact = (reportId, factId, verified) => request(`/reports/${reportId}/facts/${factId}`, {
  method: "PATCH",
  body: JSON.stringify({ verified }),
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
export const getRoutes = (reportId) => request(`/reports/${reportId}/routes`);
export const createDraft = (reportId, templateId) => request(`/reports/${reportId}/drafts`, {
  method: "POST",
  body: JSON.stringify({ template_id: templateId }),
});
export const updateDraft = (reportId, draftId, content) => request(`/reports/${reportId}/drafts/${draftId}`, {
  method: "PATCH",
  body: JSON.stringify({ content }),
});
