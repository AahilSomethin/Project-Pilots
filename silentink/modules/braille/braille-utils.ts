import type { BrailleMask } from "@/lib/braille";
import {
  getExpectedBrailleMask,
  normalizeLetterInput,
} from "@/lib/braille";
import { BRAILLE_WORD_TARGETS } from "./braille-data";

export const BRAILLE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function getBrailleLetterChallengeId(letter: string): string {
  return `braille-letter-${letter.trim().toUpperCase()}`;
}

export function getBrailleWordChallengeId(wordId: string): string {
  return `braille-word-${wordId}`;
}

export function getBrailleChallengeTotal(): number {
  // Alphabet letters + word targets.
  return BRAILLE_ALPHABET.length + BRAILLE_WORD_TARGETS.length;
}

export function getBrailleLetterExpectedMask(letter: string): BrailleMask | null {
  const normalized = normalizeLetterInput(letter);
  if (!normalized) return null;
  return getExpectedBrailleMask(normalized);
}

