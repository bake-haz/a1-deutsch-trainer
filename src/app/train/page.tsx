"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppFrame from "@/components/AppFrame";
import TrainingCard from "@/components/TrainingCard";
import { useStore } from "@/components/StoreProvider";
import { buildSessionQueue } from "@/lib/review-engine";
import type { LearningItem, ResponseQuality, DailySession } from "@/lib/types";

type Mode = "today" | "low" | "foundation" | "review";

function initialLevelFor(stage: number): number {
  // stage 1 (NEW) -> show full sentence; stage 5 (MASTERED) -> pure recall
  return Math.max(0, 5 - stage);
}

function TrainInner() {
  const params = useSearchParams();
  const { store, recordReview, addDailySession, allItems } = useStore();

  const mode = (params.get("mode") as Mode) || "today";
  const foundationFilter = params.get("foundation") || undefined;
  const focusId = params.get("focus") || undefined;

  const queue = useMemo(() => {
    if (!store) return [] as LearningItem[];
    const sel = buildSessionQueue(allItems, store.reviewStates, {
      newLimit: store.settings.dailyNewLimit,
      reviewLimit: mode === "low" ? 6 : 14,
      lowMode: mode === "low",
      foundationFilter,
      now: new Date().toISOString(),
    });
    // Warm-up with reviews (weakest first), then a few new items.
    let combined = [...sel.reviewItems, ...sel.newItems];
    // If a specific item was requested ("强化这个知识点"), bring it to the front.
    if (focusId) {
      const fi = allItems.find((i) => i.id === focusId);
      if (fi) {
        combined = [fi, ...combined.filter((i) => i.id !== focusId)];
      }
    }
    return combined;
  }, [store, mode, foundationFilter, focusId, store?.settings.dailyNewLimit]);

  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  if (!store) {
    return (
      <AppFrame title="训练">
        <div className="text-muted">正在加载…</div>
      </AppFrame>
    );
  }

  if (queue.length === 0) {
    const title =
      mode === "low" ? "保底模式" : foundationFilter ? "地基训练" : "今天";
    return (
      <AppFrame title="训练" subtitle={title} back={!!(focusId || foundationFilter)}>
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-lg font-bold text-ink mb-2">暂时没有需要练习的内容</div>
          <p className="text-sm text-muted mb-4">
            当前没有到期的复习项，新内容也已达今日上限。明天再来，或去「地基」看看已掌握的内容。
          </p>
          <Link href="/" className="tap btn-primary">
            返回今天
          </Link>
        </div>
      </AppFrame>
    );
  }

  const item = queue[idx];
  const state = store.reviewStates[item.id];
  const level = initialLevelFor(state?.stage ?? 1);

  const handleGrade = (q: ResponseQuality) => {
    recordReview(item.id, q);
    setDone((d) => d + 1);
    if (state == null) setNewCount((c) => c + 1);
    else setReviewCount((c) => c + 1);

    if (idx + 1 >= queue.length) {
      // session finished -> save daily session
      const sess: DailySession = {
        date: new Date().toISOString().slice(0, 10),
        mode: mode === "review" ? "review" : mode === "low" ? "low" : foundationFilter ? "foundation" : "today",
        items: queue.map((i) => i.id),
        completedItems: done + 1,
        newItems: newCount + (state == null ? 1 : 0),
        reviewItems: reviewCount + (state == null ? 0 : 1),
        durationSec: Math.round((Date.now() - startRef.current) / 1000),
      };
      addDailySession(sess);
      setIdx(queue.length); // trigger summary
    } else {
      setIdx((i) => i + 1);
    }
  };

  const handleSkip = () => {
    if (idx + 1 >= queue.length) setIdx(queue.length);
    else setIdx((i) => i + 1);
  };

  // Summary view
  if (idx >= queue.length) {
    return (
      <AppFrame title="训练完成" back={!!(focusId || foundationFilter)}>
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-xl font-bold text-ink mb-1">本轮训练完成</div>
          <p className="text-sm text-muted mb-4">德语不断档，今天就很棒。</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="card !p-3">
              <div className="text-2xl font-bold text-brand">{done}</div>
              <div className="text-xs text-muted">完成</div>
            </div>
            <div className="card !p-3">
              <div className="text-2xl font-bold text-accent">{newCount + (state == null ? 0 : 0)}</div>
              <div className="text-xs text-muted">新内容</div>
            </div>
            <div className="card !p-3">
              <div className="text-2xl font-bold text-warn">{reviewCount}</div>
              <div className="text-xs text-muted">复习</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="tap btn-ghost flex-1">
              今天
            </Link>
            <Link href="/progress" className="tap btn-primary flex-1">
              看进度
            </Link>
          </div>
        </div>
      </AppFrame>
    );
  }

  const total = queue.length;
  const title =
    mode === "low" ? "保底模式" : foundationFilter ? "地基训练" : "今天训练";

  return (
    <AppFrame title="训练" subtitle={`${title} · ${idx + 1}/${total}`} back={!!(focusId || foundationFilter)}>
      <div className="mb-3">
        <div className="h-2 rounded-full bg-line overflow-hidden">
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${((idx) / total) * 100}%` }}
          />
        </div>
      </div>
      <TrainingCard
        item={item}
        initialHintLevel={level}
        audioRate={store.settings.audioRate}
        onGrade={handleGrade}
        onSkip={handleSkip}
      />
      <p className="text-xs text-muted text-center mt-3">
        不会 → 今天再次出现 · 想了一会儿 → 短期复习 · 秒答 → 间隔拉长（1·3·7·14·30 天）
      </p>
    </AppFrame>
  );
}

export default function TrainPage() {
  return (
    <Suspense fallback={<AppFrame title="训练"><div className="text-muted">加载中…</div></AppFrame>}>
      <TrainInner />
    </Suspense>
  );
}
