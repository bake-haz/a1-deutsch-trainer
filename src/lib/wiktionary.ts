// ============================================================================
// Best-effort Wiktionary enrichment for words NOT in the local A1 lexicon.
// Mature, free, no API key. Runs client-side; CORS via origin=*. If anything
// fails (offline / blocked / parse error) we return null and the UI degrades
// gracefully (offers "加入复习" without extra data). This never blocks V1.
// ============================================================================

export interface WikiResult {
  ipa?: string;
  gloss?: string;
}

export async function wikiLookup(word: string, signal?: AbortSignal): Promise<WikiResult | null> {
  const w = word.trim();
  if (!w) return null;
  // Internal timeout so a hanging/unreachable network never blocks the UI.
  // Best-effort only: failure is expected and handled by the caller.
  const timeoutMs = 5000;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener("abort", () => ctrl.abort(), { once: true });
  }
  try {
    const url =
      "https://de.wiktionary.org/w/api.php" +
      "?action=query&titles=" +
      encodeURIComponent(w) +
      "&prop=revisions&rvprop=content&rvslots=main&format=json&origin=*";
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as
      | { missing?: boolean; revisions?: { slots?: { main?: { "*"?: string } } }[] }
      | undefined;
    if (!page || page.missing || !page.revisions?.length) return null;
    const wikitext = page.revisions[0].slots?.main?.["*"] ?? "";
    if (!wikitext) return null;

    // IPA often appears as {{Lautschrift|...}} or {{IPA|...}} in de.wiktionary
    const m =
      wikitext.match(/\{\{Lautschrift\|([^}]+)\}\}/) ||
      wikitext.match(/\{\{IPA\|([^}]+)\}\}/);
    const ipa = m ? m[1].trim() : undefined;

    // A short German gloss: look for the first === section then a # definition
    const glossMatch = wikitext.match(/#\s*([^[\n]{4,120})/);
    const gloss = glossMatch ? glossMatch[1].replace(/\[\[|\]\]/g, "").trim() : undefined;

    return { ipa, gloss };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
