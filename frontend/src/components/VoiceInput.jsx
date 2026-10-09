import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

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
    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };
    recognition.onerror = () => {
      setListening(false);
      setInterimText("");
    };

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
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all select-none ${
          listening
            ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse ring-2 ring-rose-200"
            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-primary hover:border-primary-border"
        }`}
        onClick={listening ? stopListening : startListening}
        title={
          listening
            ? "Stop listening (click to stop)"
            : "Speak your story (click to start)"
        }
        aria-label={listening ? "Stop voice input" : "Start voice input"}
      >
        {listening ? (
          <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
        ) : (
          <Mic className="w-3.5 h-3.5 text-primary" />
        )}
        <span>{listening ? "Listening… tap to stop" : "Voice Input"}</span>
      </button>

      {interimText && (
        <p className="text-[11px] text-slate-500 italic bg-white/80 px-2 py-1 rounded border border-slate-100 max-w-sm">
          "{interimText}"
        </p>
      )}
    </div>
  );
}
