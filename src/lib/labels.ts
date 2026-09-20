// ============================================================================
// Human-readable labels for provenance (spec §16). The UI never shows raw
// technical fields — only adult-readable language. Exactly two sources exist:
//   你的课程内容 / 通用 A1 地基
// ============================================================================

import type { Provenance } from "./types";

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  USER_CONFIRMED: "你的课程内容",
  GENERAL_A1: "通用 A1 地基",
};

export const PROVENANCE_HINT: Record<Provenance, string> = {
  USER_CONFIRMED: "你之前明确提供或练过的内容，来源可靠。",
  GENERAL_A1: "标准 A1 通用知识，用来打地基。",
};

// CSS chip class per provenance (uses the app's existing chip palette).
export const PROVENANCE_CHIP: Record<Provenance, string> = {
  USER_CONFIRMED: "chip-mastered",
  GENERAL_A1: "chip-learning",
};

export function provenanceLabel(p: Provenance): string {
  return PROVENANCE_LABEL[p] ?? PROVENANCE_LABEL.GENERAL_A1;
}
