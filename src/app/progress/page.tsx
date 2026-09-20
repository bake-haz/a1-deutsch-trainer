"use client";

import Link from "next/link";
import AppFrame from "@/components/AppFrame";
import { useStore } from "@/components/StoreProvider";
import { MASTERY_LABEL, daysBetween } from "@/lib/review-engine";
import type { Mastery, Provenance } from "@/lib/types";
import { PROVENANCE_LABEL } from "@/lib/labels";

export default function ProgressPage() {
  const { store, allItems } = useStore();
  if (!store) return <AppFrame title="进度"><div className="text-muted">加载中…</div></AppFrame>;

  const states = store.reviewStates;
  const now = new Date().toISOString();

  // Mastery distribution
  const dist: Record<Mastery, number> = { NEW: 0, LEARNING: 0, WEAK: 0, STABLE: 0, MASTERED: 0 };
  for (const it of allItems) {
    const m = states[it.id]?.mastery ?? "NEW";
    dist[m] += 1;
  }

  const weak = allItems.filter((i) => states[i.id]?.mastery === "WEAK");
  const dueSoon = allItems.filter((i) => {
    const s = states[i.id];
    if (!s || s.mastery === "NEW") return false;
    const d = daysBetween(now, s.nextReview);
    return d <= 1;
  });

  // Real mastery per source (two sources only).
  const bySource = (["USER_CONFIRMED", "GENERAL_A1"] as Provenance[]).map((s) => {
    const items = allItems.filter((i) => i.sourceType === s);
    const stable = items.filter((i) => {
      const m = states[i.id]?.mastery;
      return m === "STABLE" || m === "MASTERED";
    }).length;
    return { s, total: items.length, stable };
  });

  const last = store.dailySessions[store.dailySessions.length - 1];

  return (
    <AppFrame title="进度" subtitle="真实掌握情况，而非打卡数字">
      {/* Mastery distribution */}
      <section className="card mb-4">
        <h2 className="text-sm font-bold text-ink mb-2">掌握分布（共 {allItems.length} 个知识点）</h2>
        <div className="grid grid-cols-5 gap-2 text-center">
          {(["NEW", "LEARNING", "WEAK", "STABLE", "MASTERED"] as Mastery[]).map((m) => (
            <div key={m}>
              <div className="text-xl font-bold text-ink">{dist[m]}</div>
              <div className="text-[0.65rem] text-muted">{MASTERY_LABEL[m]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Last session */}
      {last && (
        <section className="card mb-4">
          <h2 className="text-sm font-bold text-ink mb-2">最近一次训练（{last.date}）</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-brand">{last.completedItems}</div>
              <div className="text-xs text-muted">完成</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">{last.newItems}</div>
              <div className="text-xs text-muted">新内容</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warn">{last.reviewItems}</div>
              <div className="text-xs text-muted">复习</div>
            </div>
          </div>
          <div className="text-xs text-muted mt-2">用时约 {Math.round(last.durationSec / 60)} 分钟</div>
        </section>
      )}

      {/* Real mastery by source */}
      <section className="card mb-4">
        <h2 className="text-sm font-bold text-ink mb-2">按来源看真实掌握</h2>
        <div className="text-xs text-muted mb-2">
          掌握进度由你真实训练决定。两种来源分开统计，互不冒充。
        </div>
        {bySource.map((x) => (
          <div key={x.s} className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-ink">{PROVENANCE_LABEL[x.s]}</span>
              <span className="text-muted">{x.stable}/{x.total} 稳定/掌握</span>
            </div>
            <div className="h-2 rounded-full bg-line overflow-hidden mt-1">
              <div className="h-full bg-brand" style={{ width: `${x.total ? (x.stable / x.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </section>

      {/* Weak items */}
      <section className="card mb-4">
        <h2 className="text-sm font-bold text-ink mb-2">薄弱知识点（优先复习）</h2>
        {weak.length === 0 ? (
          <p className="text-sm text-muted">暂无薄弱项，继续保持。</p>
        ) : (
          <div className="space-y-2">
            {weak.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-2 py-1 border-b border-line last:border-0">
                <div className="min-w-0">
                  <div className="de-text !text-[1.05rem]">{i.german}</div>
                  <div className="zh-text">{i.chinese}</div>
                </div>
                <Link href={`/train?focus=${i.id}`} className="tap btn-warn !px-3 !min-h-[36px] !text-xs shrink-0">
                  复习
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tomorrow priority */}
      <section className="card mb-4">
        <h2 className="text-sm font-bold text-ink mb-2">明天优先复习</h2>
        {dueSoon.length === 0 ? (
          <p className="text-sm text-muted">近两天没有到期复习项。</p>
        ) : (
          <ul className="text-sm text-ink space-y-1">
            {dueSoon.slice(0, 8).map((i) => (
              <li key={i.id} className="flex justify-between">
                <span className="de-text !text-[1rem]">{i.german}</span>
                <span className="text-muted">
                  {daysBetween(now, states[i.id].nextReview) <= 0 ? "今天" : "明天"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link href="/train?mode=today" className="tap btn-primary w-full !min-h-[52px]">
        开始今日训练
      </Link>
    </AppFrame>
  );
}
