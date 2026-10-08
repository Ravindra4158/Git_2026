import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "../router.jsx";

const allPages = [
  { label: "Home", to: "/", icon: "⌂" },
  { label: "Report an Incident", to: "/report", icon: "🚨" },
  { label: "Dashboard", to: "/dashboard", icon: "◫" },
];

export default function SiteLayout({ children }) {
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handleKey);
    // Prevent background scroll when drawer is open
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(to) {
    setMenuOpen(false);
    navigate(to);
  }

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

      {/* Portal: renders drawer & backdrop directly on document.body so
          position:fixed is scoped to viewport, not the app-shell container */}
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

            <ul className="menu-section-list">
              <li className="menu-section-label">PAGES</li>
              {allPages.map(({ label, to, icon }) => (
                <li key={to}>
                  <button
                    type="button"
                    className="menu-page-link"
                    onClick={() => handleNavClick(to)}
                  >
                    <span className="menu-page-icon">{icon}</span>
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            <ul className="menu-section-list">
              <li className="menu-section-label">ON THIS PAGE</li>
              <li><a className="menu-anchor-link" href="/#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a></li>
              <li><a className="menu-anchor-link" href="/#features" onClick={() => setMenuOpen(false)}>Features</a></li>
              <li><a className="menu-anchor-link" href="/#safety" onClick={() => setMenuOpen(false)}>Safety &amp; Trust</a></li>
            </ul>

            <div className="menu-drawer-footer">
              <span>GIT JAIPUR 2026</span>
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
