export type SignLetterPoseKey = string;
export type SignLetterAnimationKey = string;

export interface SignLetterMetadata {
  /**
   * The letter rendered/learned (A-Z).
   */
  letter: string;
  /**
   * A short, user-facing label for the lesson.
   * (For now this matches `letter` but keeps the data flexible.)
   */
  label: string;
  /**
   * A short instruction to guide the learner.
   */
  instruction: string;
  /**
   * Future: switch to a dedicated pose per letter.
   */
  poseKey?: SignLetterPoseKey;
  /**
   * Future: switch to a dedicated animation per letter.
   */
  animationKey?: SignLetterAnimationKey;
  /**
   * Future: fallback image/asset path if 3D is unavailable.
   */
  fallbackAsset?: string;
}

export interface SignWordMetadata {
  id: string;
  /**
   * Uppercase word (A-Z plus optional spaces if you extend later).
   */
  word: string;
  instruction: string;
}

export interface SignSentenceMetadata {
  id: string;
  /**
   * Uppercase sentence text (words separated by spaces).
   */
  sentence: string;
  /**
   * Sentence broken into uppercase words.
   */
  words: string[];
  instruction: string;
}

function makeLetterMetadata(letter: string): SignLetterMetadata {
  // Placeholder instruction keeps the system lightweight.
  // Later you can map each letter to a real pose and a richer per-letter tutorial.
  return {
    letter,
    label: letter,
    instruction: `Practice the handshape for “${letter}”. Keep your wrist steady and hold the pose briefly.`,
    // Placeholder pose mapping; we will keep rendering lightweight by using a single base GLB for now.
    poseKey: `pose-${letter}`,
    animationKey: `anim-${letter}-idle`,
  };
}

export const SIGN_LETTERS: Record<string, SignLetterMetadata> = (() => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return alphabet.reduce<Record<string, SignLetterMetadata>>((acc, letter) => {
    acc[letter] = makeLetterMetadata(letter);
    return acc;
  }, {});
})();

export const SIGN_WORDS: SignWordMetadata[] = [
  {
    id: "word-cat",
    word: "CAT",
    instruction: "Spell “CAT” letter-by-letter. Focus on clean, steady handshapes.",
  },
  {
    id: "word-dog",
    word: "DOG",
    instruction: "Spell “DOG” with deliberate pacing: one handshape per letter.",
  },
  {
    id: "word-hello",
    word: "HELLO",
    instruction: "Spell “HELLO”. Keep your transitions smooth between letters.",
  },
  {
    id: "word-you",
    word: "YOU",
    instruction: "Spell “YOU”. Aim for consistent finger positions on each letter.",
  },
  {
    id: "word-thank",
    word: "THANK",
    instruction: "Spell “THANK” with clean transitions and steady handshapes.",
  },
  {
    id: "word-yes",
    word: "YES",
    instruction: "Spell “YES” with a clear steady hold for each letter.",
  },
  {
    id: "word-no",
    word: "NO",
    instruction: "Spell “NO” using two distinct letters.",
  },
];

export const SIGN_SENTENCES: SignSentenceMetadata[] = [
  {
    id: "sentence-hello-you",
    sentence: "HELLO YOU",
    words: ["HELLO", "YOU"],
    instruction: "Learn “HELLO YOU” as a word flow, then spell each word’s letters.",
  },
  {
    id: "sentence-thank-you",
    sentence: "THANK YOU",
    words: ["THANK", "YOU"],
    instruction: "Learn “THANK YOU” one word at a time, then spell the letters in sequence.",
  },
  {
    id: "sentence-yes-no",
    sentence: "YES NO",
    words: ["YES", "NO"],
    instruction: "Learn “YES NO” with short, confident handshapes for each letter.",
  },
];

