import { LearningMode } from "@/lib/types";

export type ProgressVersion = 1;

export interface ModeProgress {
  /**
   * Completed challenge identifiers for a mode.
   * Used to compute completion % without double-counting repeats.
   */
  completedChallengeIds: string[];
}

export interface LocalProgressState {
  version: ProgressVersion;
  xp: number;
  streakDays: number;
  lastActiveISODate: string | null; // yyyy-mm-dd (local time)

  todayISODate: string | null; // yyyy-mm-dd (local time)
  todayFocusCount: number; // proxy for "today minutes" shown on dashboard

  modeProgress: Record<LearningMode, ModeProgress>;
}

