import type { LearningMode } from "@/lib/types";
import {
  getBrailleChallengeTotal,
} from "@/modules/braille";
import { getMorseChallengeTotal } from "@/modules/morse";
import { getSignLearningChallengeTotal } from "@/modules/sign";

export const MODE_TOTAL_CHALLENGES: Record<LearningMode, number> = {
  "sign-language": getSignLearningChallengeTotal(),
  "morse-code": getMorseChallengeTotal(),
  braille: getBrailleChallengeTotal(),
};

export function getCompletionPercent(args: {
  mode: LearningMode;
  completedCount: number;
}): number {
  const total = MODE_TOTAL_CHALLENGES[args.mode] || 0;
  if (total <= 0) return 0;
  return (args.completedCount / total) * 100;
}

