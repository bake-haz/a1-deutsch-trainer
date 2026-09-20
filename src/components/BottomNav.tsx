"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const TABS = [
  { href: "/", label: "今天", ico: "🏠" },
  { href: "/train", label: "训练", ico: "🎯" },
  { href: "/foundation", label: "地基", ico: "🧱" },
  { href: "/dict", label: "查词", ico: "🔍" },
  { href: "/progress", label: "进度", ico: "📈" },
];

// Is this pathname one of the 5 main navigation tabs?
export function isMainTab(pathname: string): boolean {
  return TABS.some((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href)));
}

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined}>
            <span className="ico">{t.ico}</span>
            <span className="lbl">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
