import React, { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceInput({ onTranscript, language = "en-IN" }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognizerRef = useRef(null);

  useEffect(() => {
    setSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => { setListening(false); setInterimText(""); };
    recognition.onerror = () => { setListening(false); setInterimText(""); };

    recognition.onresult = (event) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) onTranscript(final);
      setInterimText(interim);
    };

    recognizerRef.current = recognition;
    recognition.start();
  }, [language, onTranscript]);

  const stopListening = useCallback(() => {
    recognizerRef.current?.stop();
    setListening(false);
    setInterimText("");
  }, []);

  if (!supported) return null;

  return (
    <div className="voice-input-wrap">
      <button
        type="button"
        className={`voice-mic-btn${listening ? " voice-mic-btn--active" : ""}`}
        onClick={listening ? stopListening : startListening}
        title={listening ? "Stop listening (click to stop)" : "Speak your story (click to start)"}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
      >
        <span className="voice-mic-icon" aria-hidden="true">
          {listening ? "⏹" : "🎤"}
        </span>
        <span className="voice-mic-label">
          {listening ? "Listening… tap to stop" : "Voice Input"}
        </span>
        {listening && <span className="voice-pulse-ring" aria-hidden="true" />}
      </button>
      {interimText && (
        <p className="voice-interim-text" aria-live="polite">
          <em>"{interimText}"</em>
        </p>
      )}
    </div>
  );
}
