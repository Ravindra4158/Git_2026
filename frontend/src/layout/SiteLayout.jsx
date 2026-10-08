import React, { useState } from "react";
import { Link } from "../router.jsx";

export default function SiteLayout({ children }) {
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="AWAAZ home"><img src="/awaaz-logo.svg" alt="AWAAZ" /></Link>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="/#how-it-works">How It Works</a>
          <a href="/#features">Features</a>
          <a href="/#safety">Safety</a>
          <Link to="/dashboard">Dashboard</Link>
          <button type="button" onClick={() => setShowLoginNotice((visible) => !visible)}>Login</button>
        </nav>
        {showLoginNotice && (
          <div className="login-notice" role="status">
            <strong>Login is not part of this demo.</strong>
            <span>AWAAZ currently runs as a local hackathon prototype.</span>
            <button type="button" onClick={() => setShowLoginNotice(false)} aria-label="Dismiss">×</button>
          </div>
        )}
      </header>
      {children}
      <footer className="site-footer">
        <Link className="footer-brand" to="/">AWAAZ</Link>
        <span>Organize your story. Review every detail.</span>
        <a href="/#safety">Safety & privacy</a>
        <span>GIT JAIPUR 2026</span>
      </footer>
    </div>
  );
}
