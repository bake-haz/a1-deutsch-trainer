"use client";

import Link from "next/link";
import AppFrame from "@/components/AppFrame";
import { useStore } from "@/components/StoreProvider";
import type { FoundationCategory, Mastery } from "@/lib/types";
import { MASTERY_LABEL } from "@/lib/review-engine";

const ALL_CATEGORIES: FoundationCategory[] = [
  "发音基础",
  "字母",
  "人称代词",
  "sein",
  "haben",
  "规则动词",
  "核心不规则动词",
  "动词人称变化",
  "基本陈述句",
  "W-Fragen",
  "Ja/Nein-Fragen",
  "否定",
  "数字",
  "时间",
  "日期",
  "姓名",
  "国家",
  "语言",
  "住址",
  "职业",
  "家庭",
  "购物",
  "基础生活表达",
];

function catStatus(masteries: Mastery[]): Mastery {
  if (masteries.length === 0) return "NEW";
  if (masteries.includes("WEAK")) return "WEAK";
  if (masteries.includes("LEARNING") || masteries.includes("NEW")) return "LEARNING";
  if (masteries.includes("STABLE")) return "STABLE";
  return "MASTERED";
}

const CHIP: Record<Mastery, string> = {
  NEW: "chip-new",
  LEARNING: "chip-learning",
  WEAK: "chip-weak",
  STABLE: "chip-stable",
  MASTERED: "chip-mastered",
};

export default function FoundationPage() {
  const { store, allItems } = useStore();
  if (!store) return <AppFrame title="地基"><div className="text-muted">加载中…</div></AppFrame>;

  const byCat = new Map<FoundationCategory, typeof allItems>();
  for (const it of allItems) {
    if (!it.foundation) continue;
    if (!byCat.has(it.foundation)) byCat.set(it.foundation, []);
    byCat.get(it.foundation)!.push(it);
  }

  const rows = ALL_CATEGORIES.map((cat) => {
    const items = byCat.get(cat) ?? [];
    const ms = items.map((i) => store.reviewStates[i.id]?.mastery).filter(Boolean) as Mastery[];
    return { cat, items, status: catStatus(ms) };
  });

  const masteredCount = rows.filter((r) => r.status === "MASTERED").length;
  const total = rows.length;

  return (
    <AppFrame title="地基" subtitle={`A1 知识地图 · ${masteredCount}/${total} 类已掌握`}>
      <p className="text-xs text-muted mb-3">
        地基必须稳。状态来自你真实训练结果，不是“完成百分比”。薄弱项会进入每日复习。
      </p>

      <div className="space-y-2">
        {rows.map(({ cat, items, status }) => (
          <div key={cat} className="card !p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-ink">{cat}</div>
                <div className="text-xs text-muted">
                  {items.length > 0 ? `${items.length} 个知识点` : "暂无结构化内容（待补充）"}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`chip ${CHIP[status]}`}>{MASTERY_LABEL[status]}</span>
                {items.length > 0 && (
                  <Link href={`/train?foundation=${encodeURIComponent(cat)}`} className="tap btn-ghost !px-3 !min-h-[36px] !text-xs">
                    训练
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}
