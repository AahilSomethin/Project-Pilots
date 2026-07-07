"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { LearningMode } from "@/lib/types";
import {
  awardCorrectAnswer as awardCorrectAnswerToState,
  createDefaultProgressState,
  readProgressFromStorage,
  writeProgressToStorage,
} from "@/lib/progress/progress-store";
import type { LocalProgressState } from "@/lib/progress/progress-types";

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgressState>(
    createDefaultProgressState(),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setProgress(readProgressFromStorage());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const awardCorrectAnswer = useCallback(
    (args: { mode: LearningMode; challengeId: string }) => {
      setProgress((prev) => {
        const next = awardCorrectAnswerToState({
          prev,
          mode: args.mode,
          challengeId: args.challengeId,
        });
        writeProgressToStorage(next);
        return next;
      });
    },
    [],
  );

  const isChallengeCompleted = useCallback(
    (args: { mode: LearningMode; challengeId: string }) => {
      return progress.modeProgress[args.mode].completedChallengeIds.includes(
        args.challengeId,
      );
    },
    [progress.modeProgress],
  );

  const completionByMode = useMemo(() => {
    const completedByMode: Record<LearningMode, string[]> = {
      "sign-language": progress.modeProgress["sign-language"].completedChallengeIds,
      "morse-code": progress.modeProgress["morse-code"].completedChallengeIds,
      braille: progress.modeProgress.braille.completedChallengeIds,
    };
    return completedByMode;
  }, [progress.modeProgress]);

  const resetProgress = useCallback(() => {
    const next = createDefaultProgressState();
    setProgress(next);
    writeProgressToStorage(next);
  }, []);

  return {
    progress,
    hydrated,
    awardCorrectAnswer,
    isChallengeCompleted,
    completionByMode,
    resetProgress,
  };
}

