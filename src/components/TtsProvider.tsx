"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { initTts, speakGerman, cancelSpeech, hasGermanVoice, germanVoices } from "../lib/tts";

interface TtsContextValue {
  ready: boolean;
  germanVoiceAvailable: boolean;
  voiceList: SpeechSynthesisVoice[];
  speak: (text: string, rate?: number) => { ok: boolean; reason?: string };
  stop: () => void;
}

const TtsContext = createContext<TtsContextValue | null>(null);

export function TtsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [germanVoiceAvailable, setAvail] = useState(false);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    initTts();
    // voices may not be ready synchronously; re-check shortly after
    const t = setTimeout(() => {
      setAvail(hasGermanVoice());
      setVoiceList(germanVoices());
      setReady(true);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const speak = useCallback((text: string, rate?: number) => {
    const r = speakGerman(text, { rate });
    if (!r.ok && r.reason === "no-german-voice") {
      setAvail(false);
    }
    return r;
  }, []);

  const stop = useCallback(() => cancelSpeech(), []);

  const value = useMemo<TtsContextValue>(
    () => ({ ready, germanVoiceAvailable, voiceList, speak, stop }),
    [ready, germanVoiceAvailable, voiceList, speak, stop]
  );

  return <TtsContext.Provider value={value}>{children}</TtsContext.Provider>;
}

export function useTts(): TtsContextValue {
  const ctx = useContext(TtsContext);
  if (!ctx) throw new Error("useTts must be used within TtsProvider");
  return ctx;
}
