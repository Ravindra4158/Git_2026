import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "../router.jsx";

const mainPages = [
  { label: "Home", to: "/", icon: "⌂" },
  { label: "Report an Incident", to: "/report", icon: "🚨" },
  { label: "Describe & Presets", to: "/report/describe", icon: "✍️" },
  { label: "Incident Dashboard", to: "/dashboard", icon: "◫" },
];

const workflowSteps = [
  { label: "1. Intake & Presets", pathSuffix: null, fallbackTo: "/report/describe", icon: "📝" },
  { label: "2. AI Fact Extraction", pathSuffix: "analysis", fallbackTo: "/report/describe", icon: "🔍" },
  { label: "3. Fact Verification & Q&A", pathSuffix: "summary", fallbackTo: "/report/describe", icon: "📋" },
  { label: "4. Evidence Catalog", pathSuffix: "evidence", fallbackTo: "/report/describe", icon: "📎" },
  { label: "5. Authority Routing", pathSuffix: "recommendation", fallbackTo: "/report/describe", icon: "⚖️" },
  { label: "6. Draft Generation", pathSuffix: "draft", fallbackTo: "/report/describe", icon: "📄" },
  { label: "7. Review & Grounding Audit", pathSuffix: "review", fallbackTo: "/report/describe", icon: "🛡️" },
  { label: "8. Export, PDF & Copy", pathSuffix: "save", fallbackTo: "/report/describe", icon: "💾" },
];

export default function SiteLayout({ children }) {
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeReportId, setActiveReportId] = useState(() => {
    if (typeof window === "undefined") return null;
    const urlMatch = window.location.pathname.match(/^\/reports\/([^/]+)/);
    return urlMatch ? decodeURIComponent(urlMatch[1]) : (sessionStorage.getItem("awaaz-active-report-id") || null);
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const urlMatch = window.location.pathname.match(/^\/reports\/([^/]+)/);
    if (urlMatch) {
      const id = decodeURIComponent(urlMatch[1]);
      setActiveReportId(id);
      sessionStorage.setItem("awaaz-active-report-id", id);
    } else {
      const stored = sessionStorage.getItem("awaaz-active-report-id");
      if (stored) setActiveReportId(stored);
    }
  }, [window.location.pathname, menuOpen]);

  function handleNavClick(to) {
    setMenuOpen(false);
    navigate(to);
  }

  function getStepTarget(step) {
    if (!step.pathSuffix) return step.fallbackTo;
    return activeReportId ? `/reports/${activeReportId}/${step.pathSuffix}` : step.fallbackTo;
  }

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="AWAAZ home">
          <img src="/awaaz-logo.svg" alt="AWAAZ" />
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="/#how-it-works">How It Works</a>
          <a href="/#features">Features</a>
          <a href="/#safety">Safety</a>
          <Link to="/report">New Report</Link>
          <Link to="/dashboard">Dashboard</Link>
          <button type="button" onClick={() => setShowLoginNotice((v) => !v)}>Login</button>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`hamburger-icon${menuOpen ? " open" : ""}`}>
            <span /><span /><span />
          </span>
        </button>

        {showLoginNotice && (
          <div className="login-notice" role="status">
            <strong>Login is not part of this demo.</strong>
            <span>AWAAZ currently runs as a local hackathon prototype.</span>
            <button type="button" onClick={() => setShowLoginNotice(false)} aria-label="Dismiss">×</button>
          </div>
        )}
      </header>

      {/* Portal: renders drawer & backdrop directly on document.body */}
      {menuOpen && createPortal(
        <>
          <div
            className="menu-backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="menu-drawer menu-drawer--open" aria-label="All pages">
            <div className="menu-drawer-header">
              <span className="footer-brand">AWAAZ</span>
              <button
                type="button"
                className="menu-close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >×</button>
            </div>

            {/* Core Pages */}
            <ul className="menu-section-list">
              <li className="menu-section-label">PAGES & WORKSPACE</li>
              {mainPages.map(({ label, to, icon }) => (
                <li key={to}>
                  <button
                    type="button"
                    className={`menu-page-link ${currentPath === to ? "menu-page-link--active" : ""}`}
                    onClick={() => handleNavClick(to)}
                  >
                    <span className="menu-page-icon">{icon}</span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Incident Workflow Pipeline */}
            <ul className="menu-section-list">
              <li className="menu-section-label">
                INCIDENT PIPELINE
                {activeReportId && <span className="menu-active-pill">ACTIVE REPORT</span>}
              </li>
              {workflowSteps.map((step) => {
                const target = getStepTarget(step);
                const isActive = currentPath === target;
                return (
                  <li key={step.label}>
                    <button
                      type="button"
                      className={`menu-page-link ${isActive ? "menu-page-link--active" : ""}`}
                      onClick={() => handleNavClick(target)}
                      title={!activeReportId && step.pathSuffix ? "Starts new report intake" : ""}
                    >
                      <span className="menu-page-icon">{step.icon}</span>
                      <span>{step.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Anchor sections */}
            <ul className="menu-section-list">
              <li className="menu-section-label">DOCUMENTATION &amp; SECTIONS</li>
              <li><a className="menu-anchor-link" href="/#how-it-works" onClick={() => setMenuOpen(false)}>⚡ How It Works</a></li>
              <li><a className="menu-anchor-link" href="/#features" onClick={() => setMenuOpen(false)}>🛡️ Features &amp; Guardrails</a></li>
              <li><a className="menu-anchor-link" href="/#safety" onClick={() => setMenuOpen(false)}>🔒 Safety &amp; Trust</a></li>
            </ul>

            <div className="menu-drawer-footer">
              <span>GIT JAIPUR 2026 · PS04</span>
            </div>
          </nav>
        </>,
        document.body
      )}

      {children}

      <footer className="site-footer">
        <Link className="footer-brand" to="/">AWAAZ</Link>
        <span>Organize your story. Review every detail.</span>
        <a href="/#safety">Safety &amp; privacy</a>
        <span>GIT JAIPUR 2026</span>
      </footer>
    </div>
  );
}
