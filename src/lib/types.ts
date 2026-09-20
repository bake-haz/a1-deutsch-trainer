// ============================================================================
// Core data model for A1 Deutsch Trainer
// Training content (LearningItem) is kept strictly separate from UI and from
// runtime review state (ReviewState).
// ============================================================================

export type Priority = "FOUNDATION" | "PASS" | "OPTIONAL";
export type Skill = "Speaking" | "Listening" | "Reading" | "Writing" | "Vocab";

// What KIND of content this is (a word, a sentence, grammar note, ...).
export type ContentKind =
  | "Vocabulary"
  | "Sentence"
  | "Dialogue"
  | "Grammar"
  | "Pronunciation"
  | "Listening"
  | "Reading"
  | "Writing"
  | "Speaking"
  | "Exercise"
  | "ExamSkill";

// ---------------------------------------------------------------------------
// PROVENANCE — exactly TWO sources are allowed (V1 rectification §2):
//   USER_CONFIRMED : the learner explicitly provided / practised this content.
//   GENERAL_A1     : correct, well-known general A1 German knowledge.
//
// There is intentionally NO "PDF_VERIFIED" / "UNVERIFIED" and NO textbook
// page/unit field: the provided PDFs are scanned and cannot be mapped reliably,
// so the app must not claim any textbook position.
// ---------------------------------------------------------------------------
export type Provenance = "USER_CONFIRMED" | "GENERAL_A1";

export const ALLOWED_PROVENANCE: Provenance[] = ["USER_CONFIRMED", "GENERAL_A1"];

// A1 foundation categories (spec §8). Keep this list in sync with the 地基 page.
export type FoundationCategory =
  | "字母"
  | "发音规则"
  | "人称代词"
  | "sein"
  | "haben"
  | "heißen"
  | "kommen"
  | "wohnen"
  | "sprechen"
  | "lernen"
  | "machen"
  | "动词变位"
  | "陈述句语序"
  | "W-Fragen"
  | "Ja/Nein-Fragen"
  | "否定"
  | "数字"
  | "时间"
  | "日期"
  | "姓名"
  | "国家"
  | "语言"
  | "住址"
  | "职业"
  | "家庭"
  | "基础生活表达";

export interface LearningItem {
  id: string;
  contentKind: ContentKind; // what kind of content this is
  type: "word" | "sentence" | "dialogue" | "grammar" | "listening" | "reading" | "writing";
  priority: Priority;
  skill: Skill;
  german: string; // the German target (answer / sentence)
  chinese: string; // meaning / prompt in Chinese
  prompt?: string; // the question/context that triggers the answer
  answer?: string; // expected answer (often === german)
  hint?: string; // optional author hint (semantic)
  grammar?: string;
  pronunciation?: string;
  foundationValue: 1 | 2 | 3; // 3 = core foundation
  examValue: 1 | 2 | 3; // 3 = high exam value
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  foundation?: FoundationCategory; // links to the 地基 knowledge map
  // ---- provenance (exactly two sources; no page/unit claims) ----
  sourceType: Provenance;
  sourceNote?: string;
}

// ---- Runtime review state (persisted, separate from content) ----

export type Mastery = "NEW" | "LEARNING" | "WEAK" | "STABLE" | "MASTERED";
export type ResponseQuality = "AGAIN" | "HARD" | "EASY"; // 不会 / 想了一会儿 / 秒答

export interface ReviewState {
  itemId: string;
  mastery: Mastery;
  lastReviewed: string | null; // ISO
  nextReview: string; // ISO; for NEW items = createdAt (due immediately)
  reviewCount: number;
  successCount: number; // HARD or EASY
  failureCount: number; // AGAIN
  responseQuality: ResponseQuality | null;
  intervalIndex: number; // index into REVIEW_INTERVALS_DAYS
  stage: number; // 1..5 progressive hint-removal stage
  createdAt: string;
}

export interface ExamSkill {
  skill: Skill;
  attempts: number;
  recentPerformance: number; // 0..1
  stability: "low" | "mid" | "high";
  weaknesses: string[];
}

export interface DailySession {
  date: string; // YYYY-MM-DD
  mode: "today" | "low" | "foundation" | "review" | "dict";
  items: string[]; // item ids touched
  completedItems: number;
  newItems: number;
  reviewItems: number;
  durationSec: number;
}

export interface Settings {
  audioEnabled: boolean;
  audioRate: number; // 0.7..1.0 for slow learners
  dailyNewLimit: number;
  lowModeLimit: number;
}

export interface Store {
  version: number;
  reviewStates: Record<string, ReviewState>;
  examSkills: Partial<Record<Skill, ExamSkill>>;
  dailySessions: DailySession[];
  settings: Settings;
  // User-added words from the dictionary ("加入复习") — feed the same SRS engine.
  customItems: Record<string, LearningItem>;
}
