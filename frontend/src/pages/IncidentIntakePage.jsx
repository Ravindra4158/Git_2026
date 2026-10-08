import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "../router.jsx";
import FlowFrame from "../components/FlowFrame.jsx";
import VoiceInput from "../components/VoiceInput.jsx";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
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
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDemoNarratives()
      .then((items) => setDemoSamples(items.map((item) => [item.title, item.narrative])))
      .catch(() => setDemoSamples(samples));
  }, []);

  useEffect(() => setCharCount(story.length), [story]);

  function handleStoryChange(e) {
    setStory(e.target.value);
  }

  // Voice input appends to existing text
  function handleVoiceTranscript(transcript) {
    setStory((prev) => {
      const joined = prev ? prev.trimEnd() + " " + transcript : transcript;
      return joined;
    });
    textareaRef.current?.focus();
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const report = await createReport(story.trim());
      sessionStorage.setItem("awaaz-active-report-id", report.id);
      navigate(`/reports/${report.id}/analysis`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  const EMERGENCY_KEYWORDS = ["danger", "suicide", "bleeding", "threat", "attack", "kill", "harm", "weapon", "emergency", "assault", "rape", "stalking"];
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => story.toLowerCase().includes(kw));

  const progressPercent = Math.min((charCount / 500) * 100, 100);

  return (
    <FlowFrame step={1} title="Describe the incident" description="Start in your own words — you can use your voice or type. Leave out names if you prefer.">
      <section className="flow-card intake-card">

        {/* Emergency Banner */}
        {isEmergency && (
          <div className="emergency-sos-banner" role="alert">
            <div className="sos-badge">🚨 IMMEDIATE EMERGENCY HELPLINES</div>
            <div className="sos-numbers">
              <a href="tel:112" className="sos-number-link"><strong>112</strong> Police / Emergency</a>
              <a href="tel:1930" className="sos-number-link"><strong>1930</strong> Cyber Helpline</a>
              <a href="tel:1091" className="sos-number-link"><strong>1091</strong> Women Helpline</a>
              <a href="tel:14416" className="sos-number-link"><strong>14416</strong> Mental Health</a>
            </div>
          </div>
        )}

        {/* Sample presets */}
        <div className="sample-row">
          <span>TRY A SAMPLE</span>
          {demoSamples.map(([name, text]) => (
            <button className="sample-button" type="button" key={name} onClick={() => setStory(text)}>
              ＋ {name}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          {/* Textarea + Voice Input */}
          <div className="story-input-wrap">
            <label className="field-label" htmlFor="incident-story">
              What happened?
            </label>
            <div className="story-toolbar">
              <VoiceInput onTranscript={handleVoiceTranscript} />
            </div>
            <textarea
              id="incident-story"
              ref={textareaRef}
              className="story-input"
              value={story}
              onChange={handleStoryChange}
              maxLength={20000}
              required
              placeholder="Tell us what happened, when it happened, and anything you want help organizing. You can also tap the 🎤 microphone button above to speak your story."
            />

            {/* Progress bar */}
            <div className="story-progress-wrap">
              <div className="story-progress-bar">
                <div
                  className="story-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="story-char-count">{charCount.toLocaleString()} / 20,000</span>
            </div>
          </div>

          <div className="form-caption">
            <span>Your story stays in this local session until the backend stops.</span>
          </div>

          {/* Smart emergency numbers based on content */}
          {story.length > 40 && (
            <EmergencyNumbers narrative={story} />
          )}

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <p>AI analysis is a separate step. You'll choose when to send the story to the configured AI provider.</p>
            <button className="primary-cta" disabled={!story.trim() || saving} id="intake-continue-btn">
              {saving ? "Starting…" : "Continue to AI analysis"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </FlowFrame>
  );
}
