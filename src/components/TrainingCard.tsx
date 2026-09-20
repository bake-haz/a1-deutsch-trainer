"use client";

import { useState } from "react";
import type { LearningItem, ResponseQuality } from "../lib/types";
import { useTts } from "./TtsProvider";
import ClickableGerman from "./ClickableGerman";
import { MASTERY_LABEL } from "../lib/review-engine";
import { PROVENANCE_LABEL, PROVENANCE_CHIP, PROVENANCE_HINT } from "../lib/labels";

// Progressive hint levels (spec §10 / §37): gradually remove support.
// 0 = pure recall (only prompt + audio), 4 = full answer visible.
function firstWord(a: string) {
  return a.split(/\s+/)[0] ?? "";
}
function partial(a: string) {
  const w = a.split(/\s+/);
  if (w.length <= 1) return a;
  return w.slice(0, Math.ceil(w.length * 0.6)).join(" ") + " …";
}

export default function TrainingCard({
  item,
  initialHintLevel,
  audioRate,
  onGrade,
  onSkip,
}: {
  item: LearningItem;
  initialHintLevel: number;
  audioRate: number;
  onGrade: (q: ResponseQuality) => void;
  onSkip: () => void;
}) {
  const tts = useTts();
  const [level, setLevel] = useState(initialHintLevel);
  const [typed, setTyped] = useState("");
  const [hideText, setHideText] = useState(false);
  const [graded, setGraded] = useState<ResponseQuality | null>(null);

  const answer = item.answer ?? item.german;
  const semantic = item.hint ?? item.chinese;

  const play = (txt: string) => {
    if (!tts.germanVoiceAvailable) return;
    tts.speak(txt, audioRate);
  };

  const revealOne = () => setLevel((l) => Math.min(4, l + 1));

  // Normalize for a soft correctness hint (not used to override self-grade)
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const typedOk = typed.length > 0 && norm(typed) === norm(answer);

  const grade = (q: ResponseQuality) => {
    setGraded(q);
    // brief pause so the learner sees confirmation, then advance
    setTimeout(() => onGrade(q), 350);
  };

  const showFull = level >= 4;
  const showPartial = level >= 3;
  const showFirst = level >= 2;
  const showSemantic = level >= 1;

  return (
    <div className="card">
      {/* Top: priority + skill tags */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex gap-2 flex-wrap min-w-0">
          <span className={`chip ${item.priority === "FOUNDATION" ? "chip-learning" : item.priority === "PASS" ? "chip-mastered" : "chip-new"}`}>
            {item.priority === "FOUNDATION" ? "地基" : item.priority === "PASS" ? "拿分" : "扩展"}
          </span>
          <span className="chip chip-new">{item.skill}</span>
          <span className={`chip ${PROVENANCE_CHIP[item.sourceType]}`} title={PROVENANCE_HINT[item.sourceType]}>
            {PROVENANCE_LABEL[item.sourceType]}
          </span>
        </div>
        <button
          className="text-xs text-muted underline shrink-0 inline-flex items-center min-h-[36px] px-1"
          onClick={() => setHideText((h) => !h)}
          aria-label="切换显示文字"
        >
          {hideText ? "显示文字" : "隐藏文字"}
        </button>
      </div>

      {/* Prompt (the question / context) */}
      {item.prompt && (
        <div className="mb-2">
          <div className="text-xs text-muted mb-1">问题 / 情境</div>
          <div className="de-text flex items-start gap-2 min-w-0">
            {!hideText && <span className="flex-1 min-w-0"><ClickableGerman text={item.prompt} /></span>}
            <button
              className="tap btn-ghost !px-2 !min-h-[36px] !text-sm"
              onClick={() => play(item.prompt!)}
              aria-label="朗读问题"
            >
              🔊
            </button>
          </div>
        </div>
      )}

      {/* Target sentence with progressive reveal */}
      <div className="mb-3">
        <div className="text-xs text-muted mb-1">目标（德语）· 点词可查词</div>
        <div className="de-text flex items-start gap-2 flex-wrap min-w-0">
          {!hideText && (
            <span className="flex-1 min-w-0">
              <ClickableGerman
                text={
                  showFull
                    ? answer
                    : showPartial
                    ? `${partial(answer)}（剩余隐藏）`
                    : showFirst
                    ? `${firstWord(answer)} _____`
                    : "（先用中文回忆，需要时点「看提示」）"
                }
              />
            </span>
          )}
          <button
            className="tap btn-ghost !px-2 !min-h-[36px] !text-sm shrink-0"
            onClick={() => play(answer)}
            aria-label="朗读目标句"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Semantic hint */}
      {showSemantic && !hideText && (
        <div className="mb-3 p-3 rounded-lg bg-brandSoft text-sm text-ink">
          提示：{semantic}
        </div>
      )}

      {/* Answer input */}
      <div className="mb-2">
        <input
          className="field"
          placeholder="输入德语答案（可留空直接自评）"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
        />
        {typed.length > 0 && (
          <div className={`text-xs mt-1 ${typedOk ? "text-good" : "text-muted"}`}>
            {typedOk ? "✓ 拼写一致" : "（自评以你的判断为准，不强制）"}
          </div>
        )}
      </div>

      {/* Reveal controls */}
      <div className="flex gap-2 mb-4">
        <button className="tap btn-ghost flex-1 !min-h-[44px] !text-sm" onClick={revealOne} disabled={showFull}>
          看提示（{level}/4）
        </button>
        <button className="tap btn-ghost flex-1 !min-h-[44px] !text-sm" onClick={() => setLevel(4)} disabled={showFull}>
          显示答案
        </button>
      </div>

      {/* TTS status warning */}
      {!tts.germanVoiceAvailable && (
        <div className="mb-3 p-2 rounded-lg bg-warn/10 text-warn text-xs">
          ⚠️ 未检测到德语语音包（de-DE）。当前设备无法朗读德语，请安装系统德语语音或在设置中检查。绝不会用英语语音冒充德语。
        </div>
      )}

      {/* Self-grade (spec §11): 不会 / 想了一会儿 / 秒答 */}
      <div className="text-xs text-muted mb-2 text-center">你刚才的回忆情况？</div>
      <div className="grid grid-cols-3 gap-2">
        <button className="tap btn-danger !min-h-[56px] flex-col !px-1" onClick={() => grade("AGAIN")}>
          <span className="text-base">😣</span>
          <span className="text-[0.82rem] leading-tight">不会</span>
        </button>
        <button className="tap btn-warn !min-h-[56px] flex-col !px-1" onClick={() => grade("HARD")}>
          <span className="text-base">🤔</span>
          <span className="text-[0.82rem] leading-tight">想了一会儿</span>
        </button>
        <button className="tap btn-good !min-h-[56px] flex-col !px-1" onClick={() => grade("EASY")}>
          <span className="text-base">⚡</span>
          <span className="text-[0.82rem] leading-tight">秒答</span>
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 gap-2">
        <button
          className="text-xs text-muted underline inline-flex items-center min-h-[36px] px-1"
          onClick={onSkip}
        >
          跳过这一题
        </button>
        {graded && (
          <span className="text-xs text-muted">
            已记录：{graded === "AGAIN" ? "不会" : graded === "HARD" ? "想了一会儿" : "秒答"}
          </span>
        )}
      </div>
    </div>
  );
}
