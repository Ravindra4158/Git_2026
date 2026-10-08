import React, { useEffect, useState } from "react";
import { useNavigate } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import { createReport, getDemoNarratives } from "../services.js";

const samples = [
  ["Online harassment", "For about two weeks, someone has been messaging me on Instagram and threatening to share private photos. After I blocked the first account, another account contacted me. I have saved screenshots."],
  ["Payment scam", "Yesterday afternoon I received a text about an electricity bill and followed a payment link. After I entered my UPI PIN, money was taken from my account. I have the bank message but need to find the transaction reference."],
  ["Workplace incident", "My supervisor has repeatedly contacted me late at night on WhatsApp for personal conversations. When I asked to keep messages work-related, they said it could affect my performance review."],
];

export default function IncidentIntakePage() {
  const [story, setStory] = useState("");
  const [demoSamples, setDemoSamples] = useState(samples);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDemoNarratives()
      .then((items) => setDemoSamples(items.map((item) => [item.title, item.narrative])))
      .catch(() => setDemoSamples(samples));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const report = await createReport(story.trim());
      navigate(`/reports/${report.id}/analysis`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <FlowFrame step={1} title="Describe the incident" description="Start in your own words. You can leave out names and add only what feels useful.">
      <section className="flow-card">
        <div className="sample-row"><span>TRY A SAMPLE</span>{demoSamples.map(([name, text]) => <button className="sample-button" type="button" key={name} onClick={() => setStory(text)}>＋ {name}</button>)}</div>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="incident-story">What happened?</label>
          <textarea id="incident-story" className="story-input" value={story} onChange={(event) => setStory(event.target.value)} maxLength={20000} required placeholder="Tell us what happened, when it happened, and anything you want help organizing." />
          <div className="form-caption"><span>Your story stays in this local session until the backend stops.</span><span>{story.length.toLocaleString()} / 20,000</span></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><p>AI analysis is a separate step. You’ll choose when to send the story to the configured AI provider.</p><button className="primary-cta" disabled={!story.trim() || saving}>{saving ? "Starting…" : "Continue to AI analysis"}<span aria-hidden="true">→</span></button></div>
        </form>
      </section>
    </FlowFrame>
  );
}
