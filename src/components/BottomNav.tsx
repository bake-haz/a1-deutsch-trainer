"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "今天", ico: "🏠" },
  { href: "/train", label: "训练", ico: "🎯" },
  { href: "/textbook", label: "教材", ico: "📖" },
  { href: "/foundation", label: "地基", ico: "🧱" },
  { href: "/progress", label: "进度", ico: "📈" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined}>
            <span className="ico">{t.ico}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
