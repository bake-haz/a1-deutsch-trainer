"use client";

import Link from "next/link";

// Renders German text where each German word is clickable -> opens its word card
// in the dictionary (查词) page. Non-German tokens are rendered plain.
export default function ClickableGerman({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const tokens = text.split(/(\s+)/);
  return (
    <span className={className}>
      {tokens.map((t, i) => {
        const isWord = /^[A-Za-zÄÖÜäöüß]+[A-Za-zÄÖÜäöüß.,!?;:]*$/.test(t) && t.length > 1;
        if (!isWord) return <span key={i}>{t}</span>;
        const clean = t.replace(/[.,!?;:]/g, "");
        return (
          <Link
            key={i}
            href={`/dict?q=${encodeURIComponent(clean)}`}
            className="text-accent underline decoration-dotted hover:bg-brandSoft rounded px-0.5"
            title="点击查词"
          >
            {t}
          </Link>
        );
      })}
    </span>
  );
}
