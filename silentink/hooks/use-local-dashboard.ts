"use client";

import { useMemo } from "react";

import { useLocalProgress } from "@/hooks/use-local-progress";
import { getTodayMinutesProxy } from "@/lib/progress/progress-store";
import type { DashboardStats, LearningMode, ModeSummary } from "@/lib/types";
import { MODE_META } from "@/lib/mode-metadata";
import { getCompletionPercent } from "@/lib/progress/mode-totals";

const WEEKLY_XP_TARGET = 2000;

export function useLocalDashboard() {
  const { progress, hydrated } = useLocalProgress();

  const dashboardStats: DashboardStats = useMemo(() => {
    return {
      currentXp: progress.xp,
      weeklyXpTarget: WEEKLY_XP_TARGET,
      streakDays: progress.streakDays,
      todayMinutes: getTodayMinutesProxy(progress),
    };
  }, [progress]);

  const modeSummaries: ModeSummary[] = useMemo(() => {
    const modes: LearningMode[] = ["sign-language", "morse-code", "braille"];
    return modes.map((mode) => {
      const completedCount = progress.modeProgress[mode].completedChallengeIds.length;
      const completion = getCompletionPercent({ mode, completedCount });
      // Keep "lessonsCompleted" as a friendly proxy for completed challenges.
      const lessonsCompleted = completedCount;
      return {
        ...MODE_META[mode],
        completion,
        lessonsCompleted,
      };
    });
  }, [progress.modeProgress]);

  return { dashboardStats, modeSummaries, hydrated };
}

