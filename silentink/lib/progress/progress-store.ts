import { LearningMode } from "@/lib/types";
import { diffInLocalDays, getLocalISODate } from "@/lib/progress/date";
import type {
  LocalProgressState,
  ModeProgress,
} from "@/lib/progress/progress-types";

export const PROGRESS_STORAGE_KEY = "silentink.localProgress.v1";

const XP_AWARD_PER_CORRECT = 10;
const ALL_MODES: LearningMode[] = [
  "sign-language",
  "morse-code",
  "braille",
];

function createDefaultModeProgress(): ModeProgress {
  return { completedChallengeIds: [] };
}

export function createDefaultProgressState(): LocalProgressState {
  return {
    version: 1,
    xp: 0,
    streakDays: 0,
    lastActiveISODate: null,
    todayISODate: null,
    todayFocusCount: 0,
    modeProgress: {
      "sign-language": createDefaultModeProgress(),
      "morse-code": createDefaultModeProgress(),
      braille: createDefaultModeProgress(),
    },
  };
}

function safeJSONParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeCompletedChallengeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const filtered = ids.filter((v): v is string => typeof v === "string");
  // De-dupe while preserving order
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of filtered) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function normalizeProgressState(input: LocalProgressState): LocalProgressState {
  const base = createDefaultProgressState();
  const versionOk = input.version === 1 ? 1 : 1;

  const xp = typeof input.xp === "number" && Number.isFinite(input.xp) ? input.xp : 0;
  const streakDays =
    typeof input.streakDays === "number" && Number.isFinite(input.streakDays)
      ? input.streakDays
      : 0;

  const todayISODate =
    typeof input.todayISODate === "string" ? input.todayISODate : null;
  const todayFocusCount =
    typeof input.todayFocusCount === "number" && Number.isFinite(input.todayFocusCount)
      ? input.todayFocusCount
      : 0;

  const lastActiveISODate =
    typeof input.lastActiveISODate === "string" ? input.lastActiveISODate : null;

  const modeProgress: LocalProgressState["modeProgress"] = { ...base.modeProgress };
  for (const mode of ALL_MODES) {
    const completedChallengeIds = normalizeCompletedChallengeIds(
      input.modeProgress?.[mode]?.completedChallengeIds,
    );
    modeProgress[mode] = { completedChallengeIds };
  }

  return {
    ...base,
    version: versionOk,
    xp,
    streakDays,
    lastActiveISODate,
    todayISODate,
    todayFocusCount,
    modeProgress,
  };
}

export function readProgressFromStorage(): LocalProgressState {
  if (typeof window === "undefined") return createDefaultProgressState();
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed = safeJSONParse<LocalProgressState>(raw);
    if (!parsed || parsed.version !== 1) return createDefaultProgressState();
    return normalizeProgressState(parsed);
  } catch {
    // localStorage may be blocked or unavailable; keep app functional.
    return createDefaultProgressState();
  }
}

export function writeProgressToStorage(state: LocalProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore write failures (e.g. storage quota, private mode).
  }
}

export function awardCorrectAnswer(args: {
  prev: LocalProgressState;
  mode: LearningMode;
  challengeId: string;
  now?: Date;
}): LocalProgressState {
  const { prev, mode, challengeId, now = new Date() } = args;
  const todayISODate = getLocalISODate(now);

  // XP + daily focus count are awarded per correct answer attempt.
  const nextXp = prev.xp + XP_AWARD_PER_CORRECT;

  const shouldResetToday = prev.todayISODate !== todayISODate;
  const nextTodayFocusCount = shouldResetToday
    ? 1
    : Math.max(0, prev.todayFocusCount + 1);

  const prevLastActive = prev.lastActiveISODate;
  const nextStreakDays = computeNextStreakDays({
    prevLastActiveISODate: prevLastActive,
    currentISODate: todayISODate,
    prevStreakDays: prev.streakDays,
  });

  const prevCompleted = prev.modeProgress[mode].completedChallengeIds;
  const alreadyCompleted = prevCompleted.includes(challengeId);
  const nextCompleted = alreadyCompleted
    ? prevCompleted
    : [...prevCompleted, challengeId];

  return {
    ...prev,
    xp: nextXp,
    streakDays: nextStreakDays,
    lastActiveISODate: todayISODate,
    todayISODate,
    todayFocusCount: nextTodayFocusCount,
    modeProgress: {
      ...prev.modeProgress,
      [mode]: {
        completedChallengeIds: nextCompleted,
      },
    },
  };
}

function computeNextStreakDays(args: {
  prevLastActiveISODate: string | null;
  currentISODate: string;
  prevStreakDays: number;
}): number {
  const { prevLastActiveISODate, currentISODate, prevStreakDays } = args;

  if (!prevLastActiveISODate) return 1;
  if (prevLastActiveISODate === currentISODate) return prevStreakDays;

  const daysDiff = diffInLocalDays(prevLastActiveISODate, currentISODate);
  if (daysDiff === 1) return prevStreakDays + 1;
  return 1; // missed a day (or more) -> reset to 1
}

export function getTodayMinutesProxy(state: LocalProgressState): number {
  // Lightweight proxy: 1 unit per correct answer today (persisted locally).
  return state.todayFocusCount;
}

