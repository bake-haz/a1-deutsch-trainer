"use client";

import Link from "next/link";
import AppFrame from "@/components/AppFrame";

// Textbook feature is intentionally NOT developed in V1 (spec §1).
// The provided PDFs are scanned back-up material; we do not structure them,
// map pages, or guess units. This route stays as a simple, honest placeholder.
export default function TextbookPage() {
  return (
    <AppFrame title="教材" subtitle="暂未开放">
      <div className="card text-center py-10">
        <div className="text-4xl mb-3">📖</div>
        <div className="text-lg font-bold text-ink mb-2">教材功能暂未开放</div>
        <p className="text-sm text-muted mb-2">
          后续会根据真实课程进度，逐步加入教材相关内容。
        </p>
        <p className="text-xs text-muted mb-5">
          当前阶段请先用「今天 / 训练 / 地基 / 查词」把 A1 地基打牢。
        </p>
        <Link href="/" className="tap btn-primary">
          回到今天
        </Link>
      </div>
    </AppFrame>
  );
}
