import { MORSE_BY_LETTER, isMorseSymbol } from "./morse-constants";
import type { MorseChallenge, MorseSymbol } from "./morse-types";

export const SHORT_TAP_MAX_MS = 200;
export const LONG_PRESS_MIN_MS = 201;

export function pressDurationToSymbol(durationMs: number): MorseSymbol {
  // Spec: short tap (<200ms) => ".", long press (>=200ms) => "-"
  return durationMs >= SHORT_TAP_MAX_MS ? "-" : ".";
}

export function encodeToMorseSequence(input: string): string {
  const cleaned = input.trim().toUpperCase();
  let result = "";

  for (const ch of cleaned) {
    if (ch === " " || ch === "/") continue;
    const morse = MORSE_BY_LETTER[ch];
    if (!morse) continue;
    result += morse;
  }

  return result;
}

export function getExpectedForChallenge(challenge: MorseChallenge): string {
  return challenge.expectedSequence;
}

export function normalizeSequence(seq: string): string {
  return (seq || "")
    .split("")
    .filter((c) => isMorseSymbol(c))
    .join("");
}

export function isExactMatch(current: string, expected: string): boolean {
  return normalizeSequence(current) === normalizeSequence(expected);
}

export function getMatchState(current: string, expected: string) {
  const c = normalizeSequence(current);
  const e = normalizeSequence(expected);

  if (c.length === 0) return "empty" as const;
  if (c === e) return "exact" as const;
  if (e.startsWith(c)) return "prefix" as const;
  return "mismatch" as const;
}

export function decodeSequenceToCharacter(seq: string): string | null {
  const normalized = normalizeSequence(seq);
  for (const [ch, morse] of Object.entries(MORSE_BY_LETTER)) {
    if (morse === normalized) return ch;
  }
  return null;
}

