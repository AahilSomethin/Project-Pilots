import { normalizeLetterInput } from "@/lib/braille";

export const BRAILLE_WORD_TARGETS: { id: string; word: string }[] = [
  { id: "word-cat", word: "CAT" },
  { id: "word-dog", word: "DOG" },
  { id: "word-hello", word: "HELLO" },
  { id: "word-you", word: "YOU" },
];

export function getBrailleWordLetters(word: string): string[] {
  const normalized = word.trim().toUpperCase();
  const letters: string[] = [];
  for (const ch of normalized) {
    const letter = normalizeLetterInput(ch);
    if (letter) letters.push(letter);
  }
  return letters;
}

export function getBrailleWordChallengeTotal(): number {
  return BRAILLE_WORD_TARGETS.length;
}

