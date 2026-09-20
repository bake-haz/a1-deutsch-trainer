// ============================================================================
// Persistence layer (localStorage). V1 has no backend (spec §28).
// Data is stored as a single versioned JSON blob so it can later be migrated to
// Postgres / Supabase / Neon without changing the app's read/write calls.
// ============================================================================

import type { Store, Settings } from "./types";

const STORAGE_KEY = "a1dt:store:v1";
export const STORE_VERSION = 1;

const DEFAULT_SETTINGS: Settings = {
  audioEnabled: true,
  audioRate: 0.85, // slower for adult learners
  dailyNewLimit: 4, // adult slow-learning: very few new items/day
  lowModeLimit: 6,
};

function defaultStore(): Store {
  return {
    version: STORE_VERSION,
    reviewStates: {},
    examSkills: {},
    dailySessions: [],
    settings: { ...DEFAULT_SETTINGS },
    customItems: {},
  };
}

export function loadStore(): Store {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || parsed.version !== STORE_VERSION) {
      // Future migrations would go here. For V1 we just reset if incompatible.
      return defaultStore();
    }
    // merge defaults for forward-safety
    return {
      ...defaultStore(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return defaultStore();
  }
}

export function saveStore(store: Store): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    // Quota or privacy mode — fail silently but keep app usable in-memory
    console.warn("[storage] save failed", e);
  }
}

export function clearStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY, DEFAULT_SETTINGS };
