// ============================================================================
// clean-stale.mjs — build hygiene guard
//
// Some build environments are incremental / reused and only ADD files when the
// source is synced (e.g. a reused deploy sandbox). Files that were deleted
// during the V1 rectification would then linger and break `next build`
// (a stale component importing a removed dependency fails type-checking).
//
// This script removes exactly those known-obsolete paths so the build is
// reproducible everywhere. It is a safe no-op in a clean checkout.
// ============================================================================

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Paths removed by the V1 rectification (§2: pause textbook, drop fake data).
const STALE_PATHS = [
  "src/components/PdfViewer.tsx",
  "src/data/units.ts",
  "public/pdf.worker.min.mjs",
  "scripts/copy-pdf-worker.mjs",
  "src/lib/legacy",
];

let removed = 0;
for (const rel of STALE_PATHS) {
  const p = path.join(ROOT, rel);
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`[clean-stale] removed ${rel}`);
      removed++;
    }
  } catch (e) {
    console.log(`[clean-stale] skipped ${rel}: ${String(e)}`);
  }
}
console.log(`[clean-stale] done (${removed} removed)`);
