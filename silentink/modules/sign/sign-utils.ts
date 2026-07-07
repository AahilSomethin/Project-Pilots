import { SIGN_LETTERS } from "@/lib/signs";

export function normalizeLetter(input: string): string | null {
  const letter = input.trim().toUpperCase();
  if (letter.length !== 1) return null;
  if (!Object.prototype.hasOwnProperty.call(SIGN_LETTERS, letter)) return null;
  return letter;
}

export function splitWordLetters(word: string): string[] {
  const normalized = word.toUpperCase();
  const letters: string[] = [];

  for (const ch of normalized) {
    if (normalizeLetter(ch)) letters.push(ch);
  }

  return letters;
}

export function splitSentenceWords(sentence: string): string[] {
  return sentence
    .trim()
    .toUpperCase()
    .split(/\s+/g)
    .filter(Boolean);
}

export function getAlphabetChallengeId(letter: string): string {
  return `sign-alphabet-${letter}`;
}

export function getWordChallengeId(wordId: string): string {
  return `sign-word-${wordId}`;
}

export function getSentenceChallengeId(sentenceId: string): string {
  return `sign-sentence-${sentenceId}`;
}

