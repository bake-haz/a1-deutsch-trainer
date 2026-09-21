"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { useTts } from "@/components/TtsProvider";
import {
  SPEAKING_CATEGORIES,
  SPEAKING_ITEMS,
  speakingTips,
  type SpeakingItem,
  type SpeakingKind,
} from "@/data/speaking";

type RecognitionResult = {
  transcript: string;
  score: number;
  missing: string[];
  extra: string[];
  feedback: string;
};

type SpeakingStats = Record<
  string,
  { attempts: number; lastScore: number; bestScore: number }
>;

type SpeechRecognitionEventLike = Event & {
  results: {
    length: number;
    [index: number]: {
      0: { transcript: string; confidence: number };
      isFinal: boolean;
      length: number;
    };
  };
};

type SpeechRecognitionErrorEventLike = Event & {
  error: string;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type RecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  }
}

function normalize(text: string): string[] {
  return text
    .toLocaleLowerCase("de-DE")
    .replace(/[.,!?;:“”"„()]/g, " ")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function scoreRecognition(target: string, heard: string): RecognitionResult {
  const a = normalize(target);
  const b = normalize(heard);

  if (!heard.trim()) {
    return {
      transcript: "",
      score: 0,
      missing: a,
      extra: [],
      feedback: "没有识别到清晰语音。请靠近麦克风，先听标准音，再重新读一次。",
    };
  }

  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  const op: string[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(""));

  for (let i = 1; i <= m; i++) {
    dp[i][0] = i;
    op[i][0] = "del";
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
    op[0][j] = "ins";
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const same = a[i - 1] === b[j - 1];
      const sub = dp[i - 1][j - 1] + (same ? 0 : 1);
      const del = dp[i - 1][j] + 1;
      const ins = dp[i][j - 1] + 1;
      const best = Math.min(sub, del, ins);
      dp[i][j] = best;
      op[i][j] = best === sub ? (same ? "same" : "sub") : best === del ? "del" : "ins";
    }
  }

  const missing: string[] = [];
  const extra: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    const step = op[i][j];
    if (step === "same") {
      i--;
      j--;
    } else if (step === "sub") {
      missing.push(a[i - 1]);
      extra.push(b[j - 1]);
      i--;
      j--;
    } else if (step === "del") {
      missing.push(a[i - 1]);
      i--;
    } else {
      if (j > 0) extra.push(b[j - 1]);
      j--;
    }
  }

  const distance = dp[m][n];
  const denom = Math.max(m, n, 1);
  const raw = Math.max(0, 1 - distance / denom);
  const score = Math.round(raw * 100);

  let feedback = "识别结果和目标已经很接近。再听一遍标准音，重点模仿节奏和重音。";
  if (score < 50) {
    feedback = "差距比较明显。先拆成短词组跟读，再回到整句，不要一口气硬读。";
  } else if (score < 75) {
    feedback = "已经能被识别，但仍有几个词不稳定。优先把漏掉或识别错的词单独练。";
  } else if (score < 90) {
    feedback = "整体不错。下一步重点是连贯性、重音和元音长度。";
  }

  return {
    transcript: heard.trim(),
    score,
    missing: [...new Set(missing.reverse())],
    extra: [...new Set(extra.reverse())],
    feedback,
  };
}

function scoreLabel(score: number): string {
  if (score >= 90) return "很接近目标";
  if (score >= 75) return "整体不错";
  if (score >= 50) return "还能听懂";
  return "需要再练";
}

export default function SpeakingPage() {
  const { speak, germanVoiceAvailable } = useTts();
  const [category, setCategory] = useState<string>("自我介绍");
  const [kind, setKind] = useState<SpeakingKind | "all">("all");
  const [index, setIndex] = useState(0);
  const [isListening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [support, setSupport] = useState<boolean | null>(null);
  const [stats, setStats] = useState<SpeakingStats>({});
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");

  const items = useMemo(
    () =>
      SPEAKING_ITEMS.filter(
        (x) => x.category === category && (kind === "all" || x.kind === kind)
      ),
    [category, kind]
  );

  const item: SpeakingItem = items[Math.min(index, Math.max(items.length - 1, 0))] ?? SPEAKING_ITEMS[0];

  useEffect(() => {
    setIndex(0);
    setResult(null);
    setLiveText("");
  }, [category, kind]);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupport(Boolean(Ctor));
    try {
      const raw = window.localStorage.getItem("a1dt:speaking-stats:v1");
      if (raw) setStats(JSON.parse(raw));
    } catch {
      // Ignore damaged or unavailable localStorage.
    }
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startRecognition = () => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor || isListening) return;

    setResult(null);
    setLiveText("");
    transcriptRef.current = "";

    const recognition = new Ctor();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let combined = "";
      for (let k = 0; k < event.results.length; k++) {
        combined += event.results[k][0]?.transcript ?? "";
        if (k < event.results.length - 1) combined += " ";
      }
      transcriptRef.current = combined;
      setLiveText(combined);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setResult({
          transcript: "",
          score: 0,
          missing: [],
          extra: [],
          feedback: "麦克风权限没有开启。请允许浏览器使用麦克风后再试。",
        });
      } else {
        setResult({
          transcript: "",
          score: 0,
          missing: [],
          extra: [],
          feedback: `语音识别暂时失败（${event.error}）。请再试一次。`,
        });
      }
    };

    recognition.onend = () => {
      setListening(false);
      const scored = scoreRecognition(item.de, transcriptRef.current);
      setResult(scored);
      if (scored.transcript) {
        setStats((prev) => {
          const old = prev[item.id] ?? { attempts: 0, lastScore: 0, bestScore: 0 };
          const next = {
            ...prev,
            [item.id]: {
              attempts: old.attempts + 1,
              lastScore: scored.score,
              bestScore: Math.max(old.bestScore, scored.score),
            },
          };
          try {
            window.localStorage.setItem("a1dt:speaking-stats:v1", JSON.stringify(next));
          } catch {
            // Scoring still works when storage is unavailable.
          }
          return next;
        });
      }
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
  };

  const next = () => {
    setIndex((v) => (v + 1) % items.length);
    setResult(null);
    setLiveText("");
  };

  const prev = () => {
    setIndex((v) => (v - 1 + items.length) % items.length);
    setResult(null);
    setLiveText("");
  };

  return (
    <AppFrame title="跟读评分" subtitle="听标准音 → 自己读 → 看差距">
      <section className="card mb-4">
        <div className="text-sm font-semibold text-ink mb-2">训练分类</div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {SPEAKING_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={
                "shrink-0 rounded-full border px-3 py-2 text-sm " +
                (category === c
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-ink")
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {([
            ["all", "全部"],
            ["word", "单词"],
            ["sentence", "句子"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={
                "tap !min-h-[40px] !px-2 text-sm " +
                (kind === value ? "btn-primary" : "btn-ghost")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="chip chip-learning">{item.kind === "word" ? "单词" : "句子"}</span>
          <span className="text-xs text-muted">
            {index + 1} / {items.length}
          </span>
        </div>

        <div className="de-text text-2xl font-bold mb-1">{item.de}</div>
        <div className="zh-text mb-3">{item.zh}</div>

        {stats[item.id] && (
          <div className="flex gap-2 mb-4 text-xs text-muted">
            <span>已练 {stats[item.id].attempts} 次</span>
            <span>上次 {stats[item.id].lastScore} 分</span>
            <span>最好 {stats[item.id].bestScore} 分</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="tap btn-ghost w-full"
            onClick={() => speak(item.de, 0.8)}
          >
            🔊 标准发音
          </button>
          <button
            type="button"
            className="tap btn-ghost w-full"
            onClick={() => speak(item.de, 0.62)}
          >
            🐢 慢速发音
          </button>
        </div>

        {!germanVoiceAvailable && (
          <p className="text-xs text-warn mt-2">
            当前设备没有检测到德语语音包，标准发音按钮可能不可用。
          </p>
        )}
      </section>

      <section className="card mb-4">
        <div className="text-sm font-semibold text-ink mb-2">现在轮到你读</div>
        <p className="text-sm text-muted mb-3">
          点麦克风后完整读一遍。系统会先看“浏览器听成了什么”，再给你一个可解释的近似分数。
        </p>

        {support === false ? (
          <div className="rounded-xl border border-warn bg-[#fff8ef] p-3 text-sm text-ink">
            这个浏览器没有开放网页语音识别。建议用最新版 Chrome / Edge 在电脑或安卓上打开。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {!isListening ? (
              <button
                type="button"
                onClick={startRecognition}
                className="tap btn-primary w-full !min-h-[58px] text-lg"
              >
                🎙️ 开始跟读
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecognition}
                className="tap btn-danger w-full !min-h-[58px] text-lg"
              >
                ■ 结束并评分
              </button>
            )}
          </div>
        )}

        {(isListening || liveText) && (
          <div className="mt-3 rounded-xl bg-[#f6f7f9] p-3">
            <div className="text-xs text-muted mb-1">当前识别</div>
            <div className="de-text text-base">{liveText || "正在听…"}</div>
          </div>
        )}
      </section>

      {result && (
        <section className="card mb-4">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <div className="text-sm text-muted">本次近似分数</div>
              <div className="text-4xl font-bold text-brand">{result.score}</div>
            </div>
            <div className="chip chip-stable">{scoreLabel(result.score)}</div>
          </div>

          {result.transcript && (
            <div className="mb-3">
              <div className="text-xs text-muted mb-1">浏览器听成</div>
              <div className="de-text text-base">{result.transcript}</div>
            </div>
          )}

          {result.missing.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-muted mb-1">重点重练</div>
              <div className="flex flex-wrap gap-2">
                {result.missing.map((w) => (
                  <button
                    type="button"
                    key={w}
                    className="chip chip-weak"
                    onClick={() => speak(w, 0.72)}
                  >
                    🔊 {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-ink mb-3">{result.feedback}</p>

          <div className="rounded-xl bg-[#f6f7f9] p-3">
            <div className="text-xs font-semibold text-muted mb-2">这条内容的发音提醒</div>
            <ul className="space-y-2 text-sm text-ink">
              {speakingTips(item.de).map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted mt-3">
            注意：这个分数基于语音识别结果，不等于专业音素级发音测评。它适合用来发现“哪些词没被正确听出来”和观察自己是否持续进步。
          </p>
        </section>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="tap btn-ghost" onClick={prev}>
          ← 上一个
        </button>
        <button type="button" className="tap btn-primary" onClick={next}>
          下一个 →
        </button>
      </div>
    </AppFrame>
  );
}
