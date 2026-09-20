// ============================================================================
// Core data model for A1 Deutsch Trainer
// Training content (LearningItem) is kept strictly separate from UI and from
// runtime review state (ReviewState). See README §数据结构.
// ============================================================================

export type Priority = "FOUNDATION" | "PASS" | "OPTIONAL";
export type Skill = "Speaking" | "Listening" | "Reading" | "Writing" | "Vocab";
export type SourceType =
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

export type FoundationCategory =
  | "发音基础"
  | "字母"
  | "人称代词"
  | "sein"
  | "haben"
  | "规则动词"
  | "核心不规则动词"
  | "动词人称变化"
  | "基本陈述句"
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
  | "购物"
  | "基础生活表达";

export interface LearningItem {
  id: string;
  courseUnit: number; // 1..16, or 0 for cross-unit
  sourcePage: number; // page in the student book (approx if pageApprox)
  sourceType: SourceType;
  type: "word" | "sentence" | "dialogue" | "grammar" | "listening" | "reading" | "writing";
  priority: Priority;
  skill: Skill;
  german: string; // the German target (answer / sentence)
  chinese: string; // meaning / prompt in Chinese
  prompt?: string; // the question/context that triggers the answer
  answer?: string; // expected answer (often === german)
  hint?: string; // optional author hint (semantic)
  grammar?: string;
  pronunciation?: string; // pronunciationNote
  foundationValue: 1 | 2 | 3; // 3 = core foundation
  examValue: 1 | 2 | 3; // 3 = high exam value
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  foundation?: FoundationCategory; // links to Foundation knowledge map
  // provenance for traceability (PDF is scanned -> page numbers are best-effort)
  pageApprox?: boolean;
  verified?: boolean;
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

export interface CourseProgress {
  currentClassUnit: number; // where the live class is
  currentBookPage: number;
  lastStudyDate: string | null;
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
  mode: "today" | "low" | "unit" | "foundation" | "review";
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
  classUnit: number;
}

export interface Store {
  version: number;
  reviewStates: Record<string, ReviewState>;
  courseProgress: CourseProgress;
  examSkills: Partial<Record<Skill, ExamSkill>>;
  dailySessions: DailySession[];
  settings: Settings;
  // User-added words from the dictionary ("加入复习") — feed the same SRS engine.
  customItems: Record<string, LearningItem>;
}
