import type { MorseChallenge } from "./morse-types";
import { encodeToMorseSequence } from "./morse-utils";

export const MORSE_CHALLENGES: MorseChallenge[] = [
  // Single-letter encode
  { id: "morse-e", kind: "encode", prompt: "E", expectedSequence: encodeToMorseSequence("E") },
  // Short word encode (validated as a continuous sequence; no letter-gap input yet)
  { id: "morse-hi", kind: "encode", prompt: "HI", expectedSequence: encodeToMorseSequence("HI") },
  // Decode-style challenge: we show Morse to decode, and reveal the decoded character on success.
  {
    id: "morse-decode-s",
    kind: "decode",
    prompt: "Decode this Morse",
    expectedSequence: encodeToMorseSequence("S"),
  },
  // Familiar multi-letter encode
  {
    id: "morse-sos",
    kind: "encode",
    prompt: "SOS",
    expectedSequence: encodeToMorseSequence("SOS"),
  },
];

export function getMorseChallengeTotal() {
  return MORSE_CHALLENGES.length;
}

