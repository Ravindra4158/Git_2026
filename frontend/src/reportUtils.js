export const TEMPLATE_OPTIONS = [
  {
    id: "cyber_incident",
    title: "Cyber Crime Report",
    subtitle: "Cyber Crime Cell / cybercrime.gov.in",
    desc: "For online harassment, cyber threats, social media abuse, and digital evidence.",
    authority: "Cyber Crime Cell",
  },
  {
    id: "financial_incident",
    title: "Financial Fraud Report",
    subtitle: "Bank Fraud Cell / RBI Ombudsman / 1930",
    desc: "For UPI scams, bank fraud, unauthorized transactions, and payment disputes.",
    authority: "Bank Fraud Cell",
  },
  {
    id: "workplace_report",
    title: "Workplace ICC / HR Report",
    subtitle: "Internal Complaints Committee / HR",
    desc: "For workplace harassment, supervisor misconduct, and POSH or HR complaints.",
    authority: "ICC / HR",
  },
  {
    id: "police_report",
    title: "Police Report",
    subtitle: "Local Police Station / SHO",
    desc: "For physical threats, safety risks, or incidents requiring local police action.",
    authority: "Local Police",
  },
];

export function cleanLabel(value = "") {
  return String(value).replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getActiveReportId(params = {}) {
  return params.reportId || sessionStorage.getItem("awaaz-active-report-id") || "";
}

export function setActiveReportId(reportId) {
  if (reportId) sessionStorage.setItem("awaaz-active-report-id", reportId);
}

export function clearActiveReport(reportId = "") {
  const activeId = sessionStorage.getItem("awaaz-active-report-id");
  if (!reportId || activeId === reportId) {
    sessionStorage.removeItem("awaaz-active-report-id");
  }
  if (reportId) {
    sessionStorage.removeItem(`awaaz-template-${reportId}`);
    sessionStorage.removeItem(`awaaz-route-${reportId}`);
    sessionStorage.removeItem(`awaaz-draft-${reportId}`);
  }
}

export function isMissingReportError(error) {
  return String(error?.message || error).toLowerCase().includes("report not found");
}

export function templateForIncidentType(incidentType = "") {
  switch (incidentType) {
    case "financial_fraud":
      return "financial_incident";
    case "workplace_incident":
      return "workplace_report";
    case "physical_threat":
      return "police_report";
    case "cyber_harassment":
      return "cyber_incident";
    default:
      return "police_report";
  }
}

export function templateForRoute(routeName = "", incidentType = "") {
  const name = routeName.toLowerCase();
  if (name.includes("bank") || name.includes("payment") || name.includes("fraud") || name.includes("rbi")) {
    return "financial_incident";
  }
  if (name.includes("workplace") || name.includes("hr") || name.includes("icc") || name.includes("posh")) {
    return "workplace_report";
  }
  if (name.includes("cyber")) {
    return "cyber_incident";
  }
  if (name.includes("police") || name.includes("public safety")) {
    return "police_report";
  }
  return templateForIncidentType(incidentType);
}

export function formatForTemplate(templateId) {
  return TEMPLATE_OPTIONS.find((item) => item.id === templateId) || TEMPLATE_OPTIONS[0];
}

export function nextReportPath(report) {
  if (!report?.id) return "/home";
  if (!report.extraction) return `/reports/${report.id}/analysis`;
  if (!report.recommended_routes?.length) return `/reports/${report.id}/recommendation`;
  if (!report.drafts?.length) return `/reports/${report.id}/draft`;
  return `/reports/${report.id}/review`;
}

export function reportStatus(report) {
  if (!report?.extraction) return { label: "Needs Analysis", variant: "warning" };
  if (!report?.drafts?.length) return { label: "Needs Draft", variant: "draft" };
  return { label: "Draft Ready", variant: "success" };
}
