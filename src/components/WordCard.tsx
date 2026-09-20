"use client";

import { useEffect, useState } from "react";
import { useStore } from "./StoreProvider";
import { useTts } from "./TtsProvider";
import { lookupWord } from "@/data/dictionary";
import { wikiLookup } from "@/lib/wiktionary";
import type { LearningItem, Mastery } from "@/lib/types";
import { MASTERY_LABEL } from "@/lib/review-engine";

export default function WordCard({ word }: { word: string }) {
  const { store, addCustomItem } = useStore();
  const tts = useTts();
  const [wiki, setWiki] = useState<{ ipa?: string; gloss?: string } | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const local = lookupWord(word);
  const entry = local?.entry;

  // Best-effort Wiktionary for words not in the local lexicon.
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
    tts.speak(txt, store?.settings.audioRate ?? 0.85);
  };

  const addToReview = () => {
    const german = entry ? entry.lemma : word;
    const item: LearningItem = {
      id: `cw-${german.toLowerCase()}`,
      contentKind: "Vocabulary",
      type: "word",
      priority: "FOUNDATION",
      skill: "Vocab",
      german,
      chinese: entry ? entry.zh : wiki?.gloss ?? "（待补充释义）",
      answer: german,
      foundationValue: 2,
      examValue: 2,
      difficulty: 2,
      tags: ["词典", entry?.pos ?? "查词"],
      sourceType: "GENERAL_A1",
      sourceNote: "来自查词功能，你主动加入复习；属于通用 A1 词汇。",
    };
    addCustomItem(item);
    setAdded(true);
  };

  const status: Mastery | undefined = store?.reviewStates[`cw-${(entry?.lemma ?? word).toLowerCase()}`]?.mastery;

  return (
    <div className="card">
      {/* header: matched form + lemma */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="de-text !text-[1.5rem] flex items-start gap-2 min-w-0">
            <span className="break-any flex-1">{local?.matchedForm ?? word}</span>
            <button
              className="tap btn-ghost !px-2 !min-h-[36px] !text-sm shrink-0"
              onClick={() => speak(local?.matchedForm ?? word)}
              aria-label="朗读"
            >
              🔊
            </button>
          </div>

          {/* inflection note: "wohnst 是 wohnen 的 du 变位形式。" */}
          {local?.isInflected && entry && (
            <div className="text-xs text-warn mt-1 break-any">
              <b>{local.matchedForm}</b> 是 <b>{entry.lemma}</b> 的
              {local.grammaticalPerson ? <b> {local.grammaticalPerson} </b> : " "}
              变位形式。
            </div>
          )}

          {entry && (
            <div className="text-sm text-muted mt-1 break-any">
              {entry.article ? `${entry.article} ${entry.lemma}` : entry.lemma} · {entry.pos}
              {entry.plural ? ` · 复数 die ${entry.plural}` : ""}
            </div>
          )}
        </div>
        {status && <span className={`chip chip-${status.toLowerCase()} shrink-0`}>{MASTERY_LABEL[status]}</span>}
      </div>

      {/* IPA — only shown when we have a reliable value */}
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 min-w-0">
        <span className="text-sm text-ink font-mono break-any">
          {entry?.ipa ? `/${entry.ipa}/` : wiki?.ipa ? `/${wiki.ipa}/` : "—"}
        </span>
        {!(entry?.ipa || wiki?.ipa) && (
          <span className="text-xs text-muted">(IPA 暂无；可点 🔊 听发音)</span>
        )}
      </div>

      {/* Chinese */}
      <div className="text-base text-ink mt-1 break-any">{entry?.zh ?? wiki?.gloss ?? "（本地词库未收录）"}</div>

      {/* Conjugation (verbs) */}
      {entry?.conjugation && entry.conjugation.length > 0 && (
        <div className="mt-3 min-w-0">
          <div className="text-xs text-muted mb-1">基本变位（现在时 · 点一下可听）</div>
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {entry.conjugation.map((c) => (
              <button
                key={c.p + c.f}
                className="tap btn-ghost !px-2 !min-h-[34px] !text-[0.8rem] gap-1"
                onClick={() => speak(c.f)}
                aria-label={`朗读 ${c.p} ${c.f}`}
              >
                <span className="text-muted">{c.p}</span>
                <b>{c.f}</b>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {entry?.examples && entry.examples.length > 0 && (
        <div className="mt-3 space-y-2">
          {entry.examples.map((ex, i) => (
            <div key={i} className="text-sm border-l-2 border-line pl-2 min-w-0">
              <div className="de-text !text-[1.05rem] flex items-start gap-1 min-w-0">
                <span className="break-any flex-1">{ex.de}</span>
                <button className="tap btn-ghost !px-1 !min-h-[28px] !text-xs shrink-0" onClick={() => speak(ex.de)} aria-label="朗读例句">
                  🔊
                </button>
              </div>
              <div className="zh-text break-any">{ex.zh}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <button className="tap btn-primary flex-1 !min-h-[44px]" onClick={addToReview} disabled={added}>
          {added ? "✓ 已加入复习" : "加入复习"}
        </button>
        {!local && (
          <span className="tap btn-ghost !px-3 !min-h-[44px] !text-xs">
            {wikiLoading ? "查 Wiktionary…" : wiki ? "Wiktionary 补充" : "未收录"}
          </span>
        )}
      </div>

      {!tts.germanVoiceAvailable && (
        <div className="mt-2 text-xs text-warn">
          ⚠️ 当前设备没有可用的德语语音（de-DE），无法朗读。请在系统设置中安装德语语音；本应用不会用英语语音冒充德语。
        </div>
      )}
    </div>
  );
}
