import React from "react";
import { Link } from "../router.jsx";

const steps = [
  ["01", "Report incident", "Ready"],
  ["02", "Describe incident", "Ready"],
  ["03", "AI analysis", "Ready"],
  ["04", "Incident summary", "Ready"],
  ["05", "Authority recommendation", "Ready"],
  ["06", "Authority-specific draft", "Ready"],
  ["07", "User review & edit", "Ready"],
  ["08", "Save / download / share", "Ready"],
  ["09", "Dashboard", "Ready"],
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">A CLEARER WAY TO BE HEARD</p>
          <h1 id="hero-title">YOUR VOICE<br /><span>DESERVES ACTION.</span></h1>
          <p className="hero-lede">Tell us what happened. AWAAZ helps transform your experience into a structured, authority-specific report.</p>
          <div className="hero-actions">
            <Link className="primary-cta" to="/report"><span aria-hidden="true">↗</span> REPORT AN INCIDENT</Link>
            <a className="secondary-cta" href="#how-it-works">HOW IT WORKS <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-trust" aria-label="Product principles">
            <span><b aria-hidden="true">⌑</b> Privacy-aware</span>
            <span><b aria-hidden="true">✳</b> AI-assisted</span>
            <span><b aria-hidden="true">✎</b> User controlled</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <img src="/awaaz-logo.svg" alt="" />
          <span className="art-caption">WHEN SILENCE<br />ISN'T SAFE</span>
        </div>
      </section>

      <section className="process-section" id="how-it-works" aria-labelledby="process-heading">
        <div className="section-intro">
          <p className="eyebrow">FROM STORY TO STRUCTURE</p>
          <h2 id="process-heading">A guided path, at your pace.</h2>
          <p>AWAAZ helps organize your account step by step. You stay in control of what is reviewed and used.</p>
        </div>
        <ol className="process-grid">
          {steps.map(([number, title, status]) => (
            <li className="process-step available" key={number}>
              <span className="process-number">{number}</span><strong>{title}</strong><span className="process-status">{status}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="features-section" id="features" aria-labelledby="features-heading">
        <div className="section-intro">
          <p className="eyebrow">BUILT AROUND YOUR NEEDS</p>
          <h2 id="features-heading">A little more clarity.<br />A lot more control.</h2>
        </div>
        <div className="feature-cards">
          <article className="feature-card"><span className="feature-icon">01</span><h3>Start in your own words</h3><p>No formal language or legal terminology needed. Begin with what you remember.</p></article>
          <article className="feature-card"><span className="feature-icon">02</span><h3>See what was understood</h3><p>Review extracted details with the source text they came from before using them.</p></article>
          <article className="feature-card"><span className="feature-icon">03</span><h3>Shape the report yourself</h3><p>Choose a draft format, verify details, and edit the draft in your own words.</p></article>
        </div>
      </section>

      <section className="safety-section" id="safety" aria-labelledby="safety-heading">
        <div className="section-intro safety-intro">
          <p className="eyebrow">SAFETY & TRUST</p>
          <h2 id="safety-heading">HOW AWAAZ PROTECTS<br />YOUR VOICE</h2>
        </div>
        <div className="trust-grid">
          <article className="trust-card"><span className="trust-icon" aria-hidden="true">⌑</span><h3>Privacy-aware</h3><p>Reports stay in this local demo’s memory and clear when its backend stops. If you choose AI analysis, your story is sent to the configured AI provider.</p></article>
          <article className="trust-card"><span className="trust-icon" aria-hidden="true">✳</span><h3>AI-assisted analysis</h3><p>AI helps organize details and show source excerpts. It can make mistakes, so extracted information is presented for your review.</p></article>
          <article className="trust-card"><span className="trust-icon" aria-hidden="true">✎</span><h3>You stay in control</h3><p>You choose when to analyze, which facts to verify, and how to edit the draft before deciding what to do next.</p></article>
        </div>
        <p className="safety-footnote">AWAAZ is a report-preparation demo, not legal advice or an emergency service. It does not submit reports.</p>
      </section>

      <section className="dashboard-preview" id="dashboard" aria-labelledby="dashboard-heading">
        <div><p className="eyebrow">YOUR REPORTS, IN ONE PLACE</p><h2 id="dashboard-heading">Use the local dashboard.</h2><p>Generate demo data, reopen reports, and continue drafts from the current backend session.</p></div>
        <Link className="primary-cta" to="/dashboard">Open dashboard <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
