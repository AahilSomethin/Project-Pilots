import { SIGN_LETTERS, SIGN_SENTENCES, SIGN_WORDS } from "@/lib/signs";

export function getSignLearningChallengeTotal(): number {
  // Alphabet letters (A-Z) + word targets + sentence targets.
  // We treat "marked complete" as a learning challenge completion.
  return (
    Object.keys(SIGN_LETTERS).length + SIGN_WORDS.length + SIGN_SENTENCES.length
  );
}

