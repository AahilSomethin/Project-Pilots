"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchDashboardStats,
  fetchFlashcards,
  fetchLessons,
  fetchModeSummaries,
} from "@/lib/data";
import { queryKeys } from "@/lib/query-keys";
import { LearningMode } from "@/lib/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboardStats,
  });
}

export function useModeSummaries() {
  return useQuery({
    queryKey: queryKeys.modes,
    queryFn: fetchModeSummaries,
  });
}

export function useLessons(mode: LearningMode) {
  return useQuery({
    queryKey: queryKeys.lessons(mode),
    queryFn: () => fetchLessons(mode),
  });
}

export function useFlashcards(mode: LearningMode) {
  return useQuery({
    queryKey: queryKeys.flashcards(mode),
    queryFn: () => fetchFlashcards(mode),
  });
}
