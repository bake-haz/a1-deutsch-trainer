// Copies the pdf.js worker into /public so the app can load it same-origin
// (no external CDN dependency at runtime). Runs on postinstall.
import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const candidates = [
  "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  "node_modules/pdfjs-dist/build/pdf.worker.mjs",
];
const dest = join(root, "public", "pdf.worker.min.mjs");

const src = candidates.find((c) => existsSync(join(root, c)));
if (!src) {
  console.warn("[copy-pdf-worker] pdfjs worker not found; PDF viewer will use CDN fallback.");
  process.exit(0);
}
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(join(root, src), dest);
console.log(`[copy-pdf-worker] copied ${src} -> public/pdf.worker.min.mjs`);
