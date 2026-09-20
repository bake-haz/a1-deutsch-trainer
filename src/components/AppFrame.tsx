"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BottomNav, { isMainTab } from "./BottomNav";

// ---------------------------------------------------------------------------
// In-app navigation depth.
//
// Counts how many navigations happened *inside this document*. A page opened
// directly from a URL (cold load) has depth 0 — there is no in-app page to go
// back to, so 返回 must fall back to a safe page instead of doing nothing or
// leaving the app. Reset automatically on a full page load (module state).
// ---------------------------------------------------------------------------
let navDepth = 0;
let lastPath = "";

export default function AppFrame({
  title,
  subtitle,
  right,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  /** Force-show (true) or hide (false) the ← 返回 control. Default: auto. */
  back?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const fallbackDone = useRef(false);

  // Record in-app navigations so we know whether `back()` is meaningful.
  useEffect(() => {
    if (lastPath && lastPath !== pathname) navDepth += 1;
    lastPath = pathname;
  }, [pathname]);

  // Secondary pages (settings, detail views, sub-pages) get a back control.
  // The 5 main tabs are switched with the bottom nav instead.
  const showBack = back ?? !isMainTab(pathname);
  const isSettings = pathname === "/settings";

  const goBack = () => {
    if (busy) return;
    setBusy(true);
    fallbackDone.current = false;

    if (navDepth > 0) {
      const from = pathname;
      router.back();
      // Safety net: if history had nothing to pop, don't leave a dead click.
      window.setTimeout(() => {
        if (!fallbackDone.current && window.location.pathname === from) {
          fallbackDone.current = true;
          router.replace("/");
        }
        setBusy(false);
      }, 320);
    } else {
      // Direct URL open → go to a safe page rather than a blank / external one.
      fallbackDone.current = true;
      router.replace("/");
      setBusy(false);
    }
  };

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-line px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {showBack && (
              <button type="button" className="back-btn shrink-0" onClick={goBack} aria-label="返回">
                ← 返回
              </button>
            )}
            <div className="min-w-0">
              <div className="text-[0.7rem] uppercase tracking-wider text-muted">A1 Deutsch</div>
              <h1 className="text-lg font-bold text-ink truncate">{title}</h1>
              {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {right}
            {!isSettings && (
              <Link href="/settings" className="tap btn-ghost !px-3 !min-h-[40px] text-sm" aria-label="设置">
                设置
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 shell-main">{children}</main>

      <BottomNav />
    </div>
  );
}
