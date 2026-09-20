"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AppFrame from "@/components/AppFrame";
import { useStore } from "@/components/StoreProvider";
import { LEARNING_ITEMS } from "@/data/content";
import { buildSessionQueue } from "@/lib/review-engine";

export default function HomePage() {
  const router = useRouter();
  const { store, allItems } = useStore();

  if (!store) {
    return (
      <AppFrame title="今天">
        <div className="text-muted">正在加载…</div>
      </AppFrame>
    );
  }

  const sel = buildSessionQueue(allItems, store.reviewStates, {
    newLimit: store.settings.dailyNewLimit,
    reviewLimit: 12,
    now: new Date().toISOString(),
  });

  const newCount = sel.newItems.length;
  const reviewCount = sel.reviewItems.length;
  const total = newCount + reviewCount;

  const plan = [
    { label: "旧知识复习", min: 5, icon: "🔁" },
    { label: "少量新内容", min: 8, icon: "💬" },
    { label: "听力反应", min: 6, icon: "🎧" },
    { label: "主动回忆", min: 6, icon: "🧠" },
    { label: "A1 基础训练", min: 5, icon: "🎯" },
  ];

  return (
    <AppFrame
      title="今天"
      subtitle="A1 地基训练 · 每天稳一点"
    >
      <section className="card mb-4">
        <div className="text-sm text-muted mb-1">今日建议学习时间</div>
        <div className="text-2xl font-bold text-ink mb-3">约 30 分钟</div>
        <ul className="space-y-2">
          {plan.map((p) => (
            <li key={p.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="text-ink">{p.label}</span>
              </span>
              <span className="text-muted">{p.min} 分钟</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mb-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-bold text-brand">{total}</div>
            <div className="text-xs text-muted">今日项目</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{newCount}</div>
            <div className="text-xs text-muted">新内容</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warn">{reviewCount}</div>
            <div className="text-xs text-muted">复习</div>
          </div>
        </div>
        <p className="text-xs text-muted mt-3">
          成人慢学习：每天新内容很少，先把旧的真正记住。如果最近失败变多，系统会自动减少新内容。
        </p>
      </section>

      <button
        className="tap btn-primary w-full !min-h-[56px] text-lg mb-3"
        onClick={() => router.push("/train?mode=today")}
      >
        开始今天训练 →
      </button>

      <button
        className="tap btn-ghost w-full !min-h-[52px]"
        onClick={() => router.push("/train?mode=low")}
      >
        我今天状态不好（15 分钟保底）
      </button>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link href="/foundation" className="card !p-3 text-center hover:border-brand">
          <div className="text-xl">🧱</div>
          <div className="text-sm font-semibold text-ink">地基地图</div>
          <div className="text-xs text-muted">看掌握情况</div>
        </Link>
        <Link href="/dict" className="card !p-3 text-center hover:border-brand">
          <div className="text-xl">🔍</div>
          <div className="text-sm font-semibold text-ink">查词</div>
          <div className="text-xs text-muted">发音 · 变位 · 加入复习</div>
        </Link>
      </div>
    </AppFrame>
  );
}
