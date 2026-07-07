export type MorseSymbol = "." | "-";

export interface MorseChallenge {
  id: string;
  /**
   * UX interpretation:
   * - "encode": prompt shows the letter/word to encode into Morse
   * - "decode": prompt shows Morse to decode (we still validate by matching the entered Morse)
   */
  kind?: "encode" | "decode";
  /**
   * Shown to the learner (letter or word).
   * Example: "A", "S", "SOS".
   */
  prompt: string;
  /**
   * Expected dot/dash sequence, represented as a single string of "." and "-".
   * Example: "A" -> ".-"
   */
  expectedSequence: string;
}

