"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreProvider";
import { useTts } from "./TtsProvider";
import { lookupWord } from "@/data/dictionary";
import { wikiLookup } from "@/lib/wiktionary";
import type { LearningItem } from "@/lib/types";
import { MASTERY_LABEL } from "@/lib/review-engine";
import type { Mastery } from "@/lib/types";

export default function WordCard({ word }: { word: string }) {
  const { store, addCustomItem } = useStore();
  const tts = useTts();
  const [wiki, setWiki] = useState<{ ipa?: string; gloss?: string } | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const local = lookupWord(word);
  const entry = local?.entry;

  // Best-effort Wiktionary for unknown words
  useEffect(() => {
    if (local) return;
    let aborted = false;
    setWikiLoading(true);
    wikiLookup(word).then((r) => {
      if (!aborted) {
        setWiki(r);
        setWikiLoading(false);
      }
    });
    return () => {
      aborted = true;
    };
  }, [word, local]);

  const speak = (txt: string) => {
    if (tts.germanVoiceAvailable) tts.speak(txt, store?.settings.audioRate ?? 0.85);
  };

  const addToReview = () => {
    if (!entry) return;
    const item: LearningItem = {
      id: `cw-${entry.lemma}`,
      courseUnit: entry.sourceUnit ?? 0,
      sourcePage: 0,
      sourceType: "Vocabulary",
      type: "word",
      priority: "FOUNDATION",
      skill: "Vocab",
      german: entry.lemma,
      chinese: entry.zh,
      answer: entry.lemma,
      foundationValue: 2,
      examValue: 2,
      difficulty: 2,
      tags: ["词典", entry.pos],
      pageApprox: true,
      verified: false,
      sourceNote: "来自查词功能，用户加入复习。",
    };
    addCustomItem(item);
    setAdded(true);
  };

  const status: Mastery | undefined = store?.reviewStates[`cw-${entry?.lemma}`]?.mastery;

  return (
    <div className="card">
      {/* header: matched form + lemma */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="de-text !text-[1.5rem] flex items-center gap-2">
            {local?.matchedForm && <span>{local.matchedForm}</span>}
            <button className="tap btn-ghost !px-2 !min-h-[36px] !text-sm" onClick={() => speak(local?.matchedForm ?? word)} aria-label="朗读">
              🔊
            </button>
          </div>
          {local?.isInflected && (
            <div className="text-xs text-warn mt-1">
              {local.matchedForm} 是 <b>{entry?.lemma}</b> 的变位 / 变化形式
            </div>
          )}
          {entry && (
            <div className="text-sm text-muted mt-1">
              {entry.lemma}
              {entry.article ? ` · ${entry.article}` : ""} · {entry.pos}
              {entry.plural ? ` · 复数 ${entry.plural}` : ""}
              {entry.sourceUnit ? ` · Unit ${entry.sourceUnit}` : ""}
            </div>
          )}
        </div>
        {status && (
          <span className={`chip chip-${status.toLowerCase()}`}>{MASTERY_LABEL[status]}</span>
        )}
      </div>

      {/* IPA */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-ink font-mono">
          {entry?.ipa ? `/${entry.ipa}/` : wiki?.ipa ? `/${wiki.ipa}/` : "—"}
        </span>
        {!(entry?.ipa || wiki?.ipa) && (
          <span className="text-xs text-muted">(IPA 暂无；可点 🔊 听发音)</span>
        )}
      </div>

      {/* Chinese */}
      <div className="text-base text-ink mt-1">{entry?.zh ?? wiki?.gloss ?? "（本地词库未收录）"}</div>

      {/* Examples */}
      {entry?.examples && entry.examples.length > 0 && (
        <div className="mt-3 space-y-2">
          {entry.examples.map((ex, i) => (
            <div key={i} className="text-sm border-l-2 border-line pl-2">
              <div className="de-text !text-[1.05rem] flex items-center gap-1">
                {ex.de}
                <button className="tap btn-ghost !px-1 !min-h-[28px] !text-xs" onClick={() => speak(ex.de)} aria-label="朗读例句">
                  🔊
                </button>
              </div>
              <div className="zh-text">{ex.zh}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        {entry ? (
          <button className="tap btn-primary flex-1 !min-h-[44px]" onClick={addToReview} disabled={added}>
            {added ? "✓ 已加入复习" : "加入复习"}
          </button>
        ) : (
          <button
            className="tap btn-primary flex-1 !min-h-[44px]"
            onClick={() => {
              const item: LearningItem = {
                id: `cw-${word.toLowerCase()}`,
                courseUnit: 0,
                sourcePage: 0,
                sourceType: "Vocabulary",
                type: "word",
                priority: "FOUNDATION",
                skill: "Vocab",
                german: word,
                chinese: wiki?.gloss ?? "（待补充释义）",
                answer: word,
                foundationValue: 2,
                examValue: 2,
                difficulty: 2,
                tags: ["词典"],
                pageApprox: true,
                verified: false,
                sourceNote: "来自查词功能（Wiktionary 补充），用户加入复习。",
              };
              addCustomItem(item);
              setAdded(true);
            }}
            disabled={added}
          >
            {added ? "✓ 已加入复习" : "加入复习（自建卡片）"}
          </button>
        )}
        {!local && (
          <span className="tap btn-ghost !px-3 !min-h-[44px] !text-xs">
            {wikiLoading ? "查 Wiktionary…" : wiki ? "Wiktionary 补充" : "未收录"}
          </span>
        )}
      </div>

      {!tts.germanVoiceAvailable && (
        <div className="mt-2 text-xs text-warn">
          ⚠️ 未检测到德语语音包（de-DE），无法朗读。请在系统设置中安装德语语音。
        </div>
      )}
    </div>
  );
}
