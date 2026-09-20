"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { Store, ReviewState, ResponseQuality, Settings, DailySession, CourseProgress, LearningItem } from "../lib/types";
import { loadStore, saveStore, clearStore } from "../lib/storage";
import { applyReview, createReviewState, nowISO } from "../lib/review-engine";
import { LEARNING_ITEMS } from "../data/content";

interface StoreContextValue {
  store: Store | null;
  ready: boolean;
  ensureState: (itemId: string) => ReviewState;
  recordReview: (itemId: string, quality: ResponseQuality) => ReviewState;
  updateSettings: (patch: Partial<Settings>) => void;
  updateCourseProgress: (patch: Partial<CourseProgress>) => void;
  addDailySession: (s: DailySession) => void;
  addCustomItem: (item: LearningItem) => void;
  allItems: LearningItem[];
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);

  // hydrate on mount (client only)
  useEffect(() => {
    setStore(loadStore());
  }, []);

  // persist on change
  useEffect(() => {
    if (store) saveStore(store);
  }, [store]);

  const ensureState = useCallback((itemId: string): ReviewState => {
    if (store?.reviewStates[itemId]) return store.reviewStates[itemId];
    const fresh = createReviewState(itemId);
    setStore((s) => (s ? { ...s, reviewStates: { ...s.reviewStates, [itemId]: fresh } } : s));
    return fresh;
  }, [store]);

  const recordReview = useCallback((itemId: string, quality: ResponseQuality): ReviewState => {
    let result!: ReviewState;
    setStore((s) => {
      if (!s) return s;
      const prev = s.reviewStates[itemId] ?? createReviewState(itemId);
      result = applyReview(prev, quality);
      return { ...s, reviewStates: { ...s.reviewStates, [itemId]: result } };
    });
    return result;
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setStore((s) => (s ? { ...s, settings: { ...s.settings, ...patch } } : s));
  }, []);

  const updateCourseProgress = useCallback((patch: Partial<CourseProgress>) => {
    setStore((s) => (s ? { ...s, courseProgress: { ...s.courseProgress, ...patch } } : s));
  }, []);

  const addDailySession = useCallback((sess: DailySession) => {
    setStore((s) => {
      if (!s) return s;
      const others = s.dailySessions.filter((d) => d.date !== sess.date);
      return { ...s, dailySessions: [...others, sess].slice(-60) };
    });
  }, []);

  const addCustomItem = useCallback((item: LearningItem) => {
    setStore((s) => {
      if (!s) return s;
      return { ...s, customItems: { ...s.customItems, [item.id]: item } };
    });
  }, []);

  const allItems = useMemo<LearningItem[]>(() => {
    if (!store) return [];
    return [...LEARNING_ITEMS, ...Object.values(store.customItems)];
  }, [store]);

  const resetAll = useCallback(() => {
    clearStore();
    setStore(loadStore());
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      store,
      ready: !!store,
      ensureState,
      recordReview,
      updateSettings,
      updateCourseProgress,
      addDailySession,
      addCustomItem,
      allItems,
      resetAll,
    }),
    [store, ensureState, recordReview, updateSettings, updateCourseProgress, addDailySession, addCustomItem, allItems, resetAll]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
