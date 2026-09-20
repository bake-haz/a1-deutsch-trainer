"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppFrame from "@/components/AppFrame";
import WordCard from "@/components/WordCard";

function DictInner() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  return (
    <AppFrame
      title="查词"
      subtitle="德语 → 中文 · 发音 · 词性 · 例句 · 加入复习"
      back={!!initial}
    >
      <div className="mb-3">
        <input
          className="field"
          placeholder="输入德语单词，例如 wohnst"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
        <p className="text-xs text-muted mt-2">
          支持变位查询：输入 <b>wohnst</b> 会识别为 <b>wohnen</b> 的变位。训练中的德语词也可直接点击跳转到此处。
        </p>
      </div>

      {q.trim() ? (
        <WordCard word={q.trim()} />
      ) : (
        <div className="card text-center text-muted py-10">
          <div className="text-3xl mb-2">🔍</div>
          输入一个德语单词开始查询。
        </div>
      )}

      <div className="mt-4 text-xs text-muted">
        本地 A1 词库离线可用；未收录的词会尝试 Wiktionary（免费、无需密钥）补充 IPA 与释义，失败也不影响「加入复习」。
      </div>
    </AppFrame>
  );
}

export default function DictPage() {
  return (
    <Suspense fallback={<AppFrame title="查词"><div className="text-muted">加载中…</div></AppFrame>}>
      <DictInner />
    </Suspense>
  );
}
