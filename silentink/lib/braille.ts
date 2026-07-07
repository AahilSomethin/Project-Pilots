export type DotNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type BrailleDotPattern = DotNumber[];

// Standard English Braille (uncontracted) dot patterns for A-Z.
// Representation uses dot numbers in ascending order.
export const BRAILLE_LETTER_DOT_PATTERNS: Record<string, BrailleDotPattern> = {
  A: [1],
  B: [1, 2],
  C: [1, 4],
  D: [1, 4, 5],
  E: [1, 5],
  F: [1, 2, 4],
  G: [1, 2, 4, 5],
  H: [1, 2, 5],
  I: [2, 4],
  J: [2, 4, 5],
  K: [1, 3],
  L: [1, 2, 3],
  M: [1, 3, 4],
  N: [1, 3, 4, 5],
  O: [1, 3, 5],
  P: [1, 2, 3, 4],
  Q: [1, 2, 3, 4, 5],
  R: [1, 2, 3, 5],
  S: [2, 3, 4],
  T: [2, 3, 4, 5],
  U: [1, 3, 6],
  V: [1, 2, 3, 6],
  W: [2, 4, 5, 6],
  X: [1, 3, 4, 6],
  Y: [1, 3, 4, 5, 6],
  Z: [1, 3, 5, 6],
};

export type BrailleMask = number; // 6-bit mask, bit0 => dot1 ... bit5 => dot6

export function dotNumberToBit(dot: DotNumber): BrailleMask {
  // dot=1 -> bit0, ... dot=6 -> bit5
  return 1 << (dot - 1);
}

export function patternToMask(pattern: BrailleDotPattern): BrailleMask {
  return pattern.reduce<BrailleMask>((mask, dot) => mask | dotNumberToBit(dot), 0);
}

export function maskToPattern(mask: BrailleMask): BrailleDotPattern {
  const out: DotNumber[] = [];
  for (let dot = 1 as DotNumber; dot <= 6; dot = (dot + 1) as DotNumber) {
    if ((mask & dotNumberToBit(dot)) !== 0) out.push(dot);
  }
  return out;
}

export function getExpectedBrailleMask(letter: string): BrailleMask | null {
  const normalized = letter.trim().toUpperCase();
  if (normalized.length !== 1) return null;
  const pattern = BRAILLE_LETTER_DOT_PATTERNS[normalized];
  return pattern ? patternToMask(pattern) : null;
}

export function getBrailleDotLabel(mask: BrailleMask): string {
  const dots = maskToPattern(mask);
  if (dots.length === 0) return "—";
  return dots.join("-");
}

export function normalizeLetterInput(input: string): string | null {
  const letter = input.trim().toUpperCase();
  if (letter.length !== 1) return null;
  if (!BRAILLE_LETTER_DOT_PATTERNS[letter]) return null;
  return letter;
}

