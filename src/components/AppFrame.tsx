"use client";

import Link from "next/link";
import BottomNav from "./BottomNav";

export default function AppFrame({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-line px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[0.7rem] uppercase tracking-wider text-muted">A1 Deutsch</div>
            <h1 className="text-lg font-bold text-ink truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {right}
            <Link href="/settings" className="tap btn-ghost !px-3 !min-h-[40px] text-sm" aria-label="设置">
              设置
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-24">{children}</main>

      <div className="app-shell">
        <BottomNav />
      </div>
    </div>
  );
}
