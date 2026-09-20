// ============================================================================
// Simple, transparent spaced-repetition engine (lib/review-engine.ts)
//
// Design note (per product spec §12 / engineering principle "don't over-engineer"):
// V1 deliberately uses a SIMPLE, TRANSPARENT ladder instead of a heavy FSRS/SM-2
// implementation. The intervals and mastery transitions are explicit and easy to
// reason about. ts-fsrs was evaluated and rejected for V1 to avoid complexity.
//
// Mapping (spec §11 / §12):
//   不会 (AGAIN)  -> reappears the SAME DAY
//   想了一会儿 (HARD) -> short interval (next day)
//   秒答 (EASY)   -> progressive ladder 1 -> 3 -> 7 -> 14 -> 30 days
// ============================================================================

import type { LearningItem, ReviewState, ResponseQuality, Mastery } from "./types";
import { ALLOWED_PROVENANCE } from "./types";

export const REVIEW_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30]; // index 0 = same day

// Only the two allowed sources may enter the training queue. This is a defensive
// guard: if any content ever carries a different / unknown provenance it will be
// kept out of training rather than silently taught.
export function isTrainable(item: Pick<LearningItem, "sourceType">): boolean {
  return ALLOWED_PROVENANCE.includes(item.sourceType);
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function nowISO(): string {
  return new Date().toISOString();
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso).getTime() + days * DAY_MS;
  return new Date(d).toISOString();
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((new Date(toISO).getTime() - new Date(fromISO).getTime()) / DAY_MS);
}

// Initial review state for a brand-new item.
export function createReviewState(itemId: string, now = nowISO()): ReviewState {
  return {
    itemId,
    mastery: "NEW",
    lastReviewed: null,
    nextReview: now, // NEW items are due immediately
    reviewCount: 0,
    successCount: 0,
    failureCount: 0,
    responseQuality: null,
    intervalIndex: 0,
    stage: 1,
    createdAt: now,
  };
}

function masteryFromIndex(idx: number, hadFailure: boolean): Mastery {
  if (hadFailure) return "WEAK";
  if (idx >= 5) return "MASTERED";
  if (idx >= 3) return "STABLE";
  if (idx >= 1) return "LEARNING";
  return "WEAK";
}

// Core transition. Returns a NEW ReviewState (immutable update).
export function applyReview(
  state: ReviewState,
  quality: ResponseQuality,
  now = nowISO()
): ReviewState {
  const next: ReviewState = { ...state };
  next.reviewCount += 1;
  next.lastReviewed = now;

  if (quality === "AGAIN") {
    next.failureCount += 1;
    next.intervalIndex = 0; // reset to same-day
    next.nextReview = now; // reappears today
    next.mastery = "WEAK";
    next.stage = 1; // restart with full support
  } else if (quality === "HARD") {
    next.successCount += 1;
    // short interval: 1 day, but never longer than current if it was further
    next.intervalIndex = Math.max(1, Math.min(state.intervalIndex, 1));
    next.nextReview = addDaysISO(now, REVIEW_INTERVALS_DAYS[next.intervalIndex]);
    next.mastery = state.mastery === "MASTERED" || state.mastery === "STABLE" ? "STABLE" : "WEAK";
    next.stage = Math.max(1, state.stage - 1);
  } else {
    // EASY
    next.successCount += 1;
    next.intervalIndex = Math.min(state.intervalIndex + 1, REVIEW_INTERVALS_DAYS.length - 1);
    next.nextReview = addDaysISO(now, REVIEW_INTERVALS_DAYS[next.intervalIndex]);
    next.mastery = masteryFromIndex(next.intervalIndex, state.failureCount > 0 && state.intervalIndex < 3);
    // gradually remove hints as mastery grows
    next.stage = Math.min(5, 2 + next.intervalIndex);
  }

  next.responseQuality = quality;
  return next;
}

// Was this item answered correctly WITHOUT needing the full answer revealed?
// Used by progress reporting (spec §29). We approximate using last responseQuality.
export function reviewedWithoutHint(state: ReviewState): boolean {
  return state.responseQuality === "EASY" || state.responseQuality === "HARD";
}

export function isDue(state: ReviewState, now = nowISO()): boolean {
  if (state.mastery === "NEW") return true;
  return new Date(state.nextReview).getTime() <= new Date(now).getTime();
}

export interface DueSelection {
  newItems: LearningItem[];
  reviewItems: LearningItem[];
}

// Build a daily session queue: limited NEW items + due reviews.
// Adult slow-learning rule (spec §9): keep NEW items small; if recent failure
// rate is high, reduce new items further.
export function buildSessionQueue(
  items: LearningItem[],
  states: Record<string, ReviewState>,
  opts: {
    newLimit: number;
    reviewLimit: number;
    lowMode?: boolean;
    foundationFilter?: string;
    now?: string;
  }
): DueSelection {
  const now = opts.now ?? nowISO();
  // Drop items whose provenance is unknown — they must not be trained by default.
  let pool = items.filter((i) => isTrainable(i));
  if (opts.foundationFilter) pool = pool.filter((i) => i.foundation === opts.foundationFilter);

  const review: LearningItem[] = [];
  const fresh: LearningItem[] = [];

  for (const it of pool) {
    const st = states[it.id];
    if (!st) {
      fresh.push(it);
    } else if (isDue(st, now)) {
      review.push(it);
    }
  }

  // Sort reviews: weakest first (WEAK before STABLE), then by nextReview ascending
  const rank: Record<Mastery, number> = { NEW: 0, WEAK: 1, LEARNING: 2, STABLE: 3, MASTERED: 4 };
  review.sort((a, b) => {
    const sa = states[a.id], sb = states[b.id];
    if (rank[sa.mastery] !== rank[sb.mastery]) return rank[sa.mastery] - rank[sb.mastery];
    return new Date(sa.nextReview).getTime() - new Date(sb.nextReview).getTime();
  });

  // Suspend new items if there are many due reviews (adult slow rule)
  let newLimit = opts.newLimit;
  if (opts.lowMode) newLimit = Math.min(newLimit, 2);
  if (review.length >= opts.reviewLimit) newLimit = Math.min(newLimit, 1);

  // Prioritize FOUNDATION then PASS
  const prioRank: Record<string, number> = { FOUNDATION: 0, PASS: 1, OPTIONAL: 2 };
  fresh.sort((a, b) => prioRank[a.priority] - prioRank[b.priority] || a.difficulty - b.difficulty);

  return {
    newItems: fresh.slice(0, newLimit),
    reviewItems: review.slice(0, opts.reviewLimit),
  };
}

// Estimated next-review label for UI.
export function nextReviewLabel(state: ReviewState, now = nowISO()): string {
  if (state.mastery === "NEW") return "未学习";
  const d = daysBetween(now, state.nextReview);
  if (d <= 0) return "今天";
  if (d === 1) return "明天";
  if (d < 30) return `${d} 天后`;
  return new Date(state.nextReview).toLocaleDateString("zh-CN");
}

export const MASTERY_LABEL: Record<Mastery, string> = {
  NEW: "未学习",
  LEARNING: "学习中",
  WEAK: "薄弱",
  STABLE: "稳定",
  MASTERED: "已掌握",
};
