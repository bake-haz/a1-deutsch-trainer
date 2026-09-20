"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Client-side PDF rendering via pdfjs-dist (mature, reused — not reinvented).
// The worker is served same-origin from /public (copied on postinstall); CDN is a
// fallback if the local copy is missing.
async function ensureWorker() {
  if (pdfjsLib.GlobalWorkerOptions.workerSrc) return;
  const local = "/pdf.worker.min.mjs";
  try {
    const res = await fetch(local, { method: "HEAD" });
    if (res.ok) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = local;
      return;
    }
  } catch {
    /* ignore */
  }
  const v = (pdfjsLib as unknown as { version?: string }).version ?? "4.7.76";
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${v}/pdf.worker.min.mjs`;
}

export default function PdfViewer({
  file,
  initialPage = 1,
}: {
  file: File;
  initialPage?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const docRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderRef = useRef<{ cancel: () => void } | null>(null);

  // Load document when file changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureWorker();
        setLoading(true);
        setError(null);
        const buf = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: buf }).promise;
        if (cancelled) return;
        docRef.current = doc;
        setNumPages(doc.numPages);
        setPage((p) => Math.min(Math.max(1, p), doc.numPages));
        setLoading(false);
      } catch (e) {
        setError("无法解析该 PDF（可能是损坏或不支持的格式）。");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      docRef.current?.destroy();
      docRef.current = null;
    };
  }, [file]);

  // Render current page
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const doc = docRef.current;
      if (!doc || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      try {
        const pg = await doc.getPage(page);
        if (cancelled) return;
        const viewport = pg.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        renderRef.current?.cancel();
        const task = pg.render({ canvasContext: ctx, viewport });
        renderRef.current = task as unknown as { cancel: () => void };
        await task.promise;
      } catch {
        /* page render interrupted; safe to ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, scale, loading, numPages]);

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="text-sm font-semibold text-ink truncate max-w-[55%]">{file.name}</div>
        <div className="text-xs text-muted">{numPages > 0 ? `共 ${numPages} 页` : ""}</div>
      </div>

      {error && <div className="text-danger text-sm mb-2">{error}</div>}

      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-1">
          <button className="tap btn-ghost !px-2 !min-h-[36px] !text-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
            ← 上一页
          </button>
          <span className="text-sm text-ink px-1">
            {page} / {numPages || "?"}
          </span>
          <button className="tap btn-ghost !px-2 !min-h-[36px] !text-sm" onClick={() => setPage((p) => Math.min(numPages || p, p + 1))} disabled={page >= numPages}>
            下一页 →
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="tap btn-ghost !px-2 !min-h-[36px] !text-sm" onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}>
            －
          </button>
          <span className="text-xs text-muted">{Math.round(scale * 100)}%</span>
          <button className="tap btn-ghost !px-2 !min-h-[36px] !text-sm" onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}>
            ＋
          </button>
        </div>
      </div>

      <div className="bg-black/5 rounded-lg p-2 overflow-auto max-h-[60vh] flex justify-center">
        {loading && <div className="text-muted text-sm py-10">正在加载 PDF…</div>}
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>
      <p className="text-xs text-muted mt-2">
        提示：这是教材原始页（原始材料层）。结构化知识点请见下方课程结构；两者通过「Unit / 页码」关联。
      </p>
    </div>
  );
}
