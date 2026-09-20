// ============================================================================
// Text-to-Speech via the browser-native SpeechSynthesis API.
// Reused, not reinvented (spec engineering principle §2). No custom voice engine.
// CRITICAL: only ever use a German (de-DE) voice for German text. If no German
// voice is available we MUST warn the user — never fall back to an English voice
// and pretend it is German (spec §16).
// ============================================================================

let cachedVoices: SpeechSynthesisVoice[] = [];
let germanVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  cachedVoices = window.speechSynthesis.getVoices();
  // Prefer a de-DE voice; fall back to any 'de' voice.
  germanVoice =
    cachedVoices.find((v) => v.lang === "de-DE") ||
    cachedVoices.find((v) => v.lang?.startsWith("de")) ||
    null;
}

export function initTts(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  loadVoices();
  // Voices may load asynchronously in some browsers
  window.speechSynthesis.onvoiceschanged = () => loadVoices();
}

export function hasGermanVoice(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  if (!cachedVoices.length) loadVoices();
  return germanVoice != null;
}

// Returns the list of detected German voices (for UI display).
export function germanVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  if (!cachedVoices.length) loadVoices();
  return cachedVoices.filter((v) => v.lang?.startsWith("de"));
}

let lastUtterance: SpeechSynthesisUtterance | null = null;

export function speakGerman(
  text: string,
  opts: { rate?: number; onEnd?: () => void } = {}
): { ok: boolean; reason?: string } {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { ok: false, reason: "unsupported" };
  }
  if (!text) return { ok: false, reason: "empty" };
  if (!hasGermanVoice()) {
    return { ok: false, reason: "no-german-voice" };
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.voice = germanVoice!;
  u.rate = opts.rate ?? 0.85;
  u.pitch = 1;
  u.onend = () => opts.onEnd?.();
  lastUtterance = u;
  window.speechSynthesis.speak(u);
  return { ok: true };
}

export function cancelSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
