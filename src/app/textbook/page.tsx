"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AppFrame from "@/components/AppFrame";
import PdfViewer from "@/components/PdfViewer";
import { UNITS, SOURCE_PDFS } from "@/data/units";
import { LEARNING_ITEMS } from "@/data/content";
import type { LearningItem } from "@/lib/types";

function ItemRow({ item }: { item: LearningItem }) {
  return (
    <div className="flex items-start justify-between gap-2 py-2 border-b border-line last:border-0">
      <div className="min-w-0">
        <div className="de-text !text-[1.1rem]">{item.german}</div>
        <div className="zh-text">{item.chinese}</div>
        <div className="text-[0.7rem] text-muted mt-1">
          {item.priority === "FOUNDATION" ? "地基" : item.priority === "PASS" ? "拿分" : "扩展"} · {item.skill}
          {item.foundation ? ` · ${item.foundation}` : ""} · 原书约 S.{item.sourcePage}
          {item.verified ? " · 规格已确认" : " · 页码待核对"}
        </div>
      </div>
      <Link href={`/train?unit=${item.courseUnit}&focus=${item.id}`} className="tap btn-ghost !px-3 !min-h-[40px] !text-sm shrink-0">
        训练
      </Link>
    </div>
  );
}

export default function TextbookPage() {
  const [file, setFile] = useState<File | null>(null);
  const [viewerPage, setViewerPage] = useState(1);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const openUnit = (page: number) => {
    setViewerPage(page);
    if (!file) {
      fileRef.current?.click();
    } else {
      viewerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setViewerPage((p) => p); // keep requested page
      setTimeout(() => viewerRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  const structuredUnits = UNITS.filter((u) => u.structured);

  return (
    <AppFrame title="教材" subtitle="原始材料层 + 结构化层">
      {/* Source PDF registry */}
      <section className="mb-4">
        <h2 className="text-sm font-bold text-ink mb-2">你的教材 PDF（原始材料层）</h2>
        <div className="space-y-2">
          {SOURCE_PDFS.map((p) => (
            <div key={p.id} className="card !p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">{p.title}</div>
                  <div className="text-xs text-muted">{p.role} · {p.pages} 页</div>
                </div>
                <button className="tap btn-primary !px-3 !min-h-[40px] !text-sm" onClick={() => fileRef.current?.click()}>
                  打开
                </button>
              </div>
              <p className="text-[0.7rem] text-muted mt-1">{p.note}</p>
            </div>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onPick}
        />
        <p className="text-[0.7rem] text-muted mt-2">
          说明：PDF 为扫描版、体积较大（学生用书 312 页），不随源码提交；在「教材」页选择本地文件即可在应用内查看原书（客户端渲染，不上传）。结构化知识点见下方。
        </p>
      </section>

      {/* Viewer */}
      {file && (
        <div ref={viewerRef} className="mb-4 scroll-mt-4">
          <PdfViewer file={file} initialPage={viewerPage} />
        </div>
      )}

      {/* Course structure */}
      <section>
        <h2 className="text-sm font-bold text-ink mb-2">课程结构（Unit / Page → 知识点）</h2>

        {structuredUnits.map((u) => {
          const items = LEARNING_ITEMS.filter((i) => i.courseUnit === u.number);
          return (
            <div key={u.number} className="card mb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="font-bold text-ink">
                    Unit {u.number} · {u.titleZh}
                  </div>
                  <div className="text-xs text-muted">
                    {u.titleDe} · 原书约 S.{u.pageStart}–{u.pageEnd}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="tap btn-ghost !px-2 !min-h-[36px] !text-xs" onClick={() => openUnit(u.pageStart)}>
                    看原书
                  </button>
                  <Link href={`/train?unit=${u.number}`} className="tap btn-primary !px-2 !min-h-[36px] !text-xs">
                    强化训练
                  </Link>
                </div>
              </div>
              <div className="text-[0.7rem] text-good mb-1">✓ 已结构化 {items.length} 个训练项</div>
              <div>
                {items.map((it) => (
                  <ItemRow key={it.id} item={it} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Units not yet structured */}
        <details className="card">
          <summary className="cursor-pointer font-semibold text-ink text-sm">
            其余单元（待结构化，可打开原书对照）
          </summary>
          <div className="mt-2 space-y-2">
            {UNITS.filter((u) => !u.structured && u.number !== 99).map((u) => (
              <div key={u.number} className="flex items-center justify-between gap-2 py-1 border-b border-line last:border-0">
                <div className="min-w-0">
                  <div className="text-sm text-ink truncate">
                    Unit {u.number} · {u.titleZh}
                  </div>
                  <div className="text-[0.7rem] text-warn">待结构化 · 原书约 S.{u.pageStart}</div>
                </div>
                <button className="tap btn-ghost !px-2 !min-h-[36px] !text-xs shrink-0" onClick={() => openUnit(u.pageStart)}>
                  看原书
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between gap-2 py-1">
              <div className="text-sm text-ink">Plateau / 阶段复习</div>
              <button className="tap btn-ghost !px-2 !min-h-[36px] !text-xs" onClick={() => openUnit(1)}>
                看原书
              </button>
            </div>
          </div>
        </details>

        {/* Exam skill entry */}
        <div className="card mt-3">
          <div className="font-semibold text-ink text-sm mb-1">考试能力入口（测试手册）</div>
          <p className="text-[0.7rem] text-muted mb-2">
            测试手册（72 页）提供各单元测试与模拟题。V1 仅建立「Hören / Lesen / Schreiben / Sprechen」能力入口与题型映射，不逐题导入；具体考试标准（Goethe / telc / ÖSD）以后按官方规则配置。
          </p>
          <button className="tap btn-ghost !px-3 !min-h-[40px] !text-sm" onClick={() => openUnit(1)}>
            打开测试手册
          </button>
        </div>
      </section>
    </AppFrame>
  );
}
