import type {
  SignLetterMetadata,
  SignSentenceMetadata,
  SignWordMetadata,
  SignLetterAnimationKey,
  SignLetterPoseKey,
} from "@/lib/signs";

export type {
  SignLetterMetadata,
  SignSentenceMetadata,
  SignWordMetadata,
  SignLetterAnimationKey,
  SignLetterPoseKey,
};

/**
 * Backwards-compat placeholder types for the previous sign module.
 * The new learning system focuses on alphabet/word/sentence lessons.
 */
export interface SignDefinition {
  id: string;
  meaningLabel: string; // what the user should select/learn
  loopFrames: string[];
}

export interface SignDetectionCandidate {
  signId: string;
  confidence: number; // 0..1
}

/**
 * Future port: plug in a real hand-tracking layer (MediaPipe/TensorFlow.js)
 * to produce sign candidates.
 */
export interface HandSignDetectorPort {
  detectSign(input: unknown): Promise<SignDetectionCandidate[]>;
}

export interface SignValidationResult {
  isCorrect: boolean;
  confidence?: number;
}

/**
 * Future port: validate a practice attempt based on detector output.
 * Current UI uses "Practice mode" without automatic validation.
 */
export interface SignPracticeValidatorPort {
  validatePractice(args: {
    expectedSignId: string;
    attempt: unknown;
  }): Promise<SignValidationResult>;
}

export type SignLearningChallengeKind =
  | "alphabet-letter"
  | "word"
  | "sentence";

export interface SignLearningChallengeSpec {
  kind: SignLearningChallengeKind;
  id: string;
}


