import type { SignDefinition } from "./sign-types";

const defaultLoop = ["Open palm", "Wrist rotate", "Finger close", "Hold steady"];

export const SIGN_DEFINITIONS: SignDefinition[] = [
  { id: "sign-hello", meaningLabel: "Hello", loopFrames: defaultLoop },
  {
    id: "sign-thank-you",
    meaningLabel: "Thank you",
    loopFrames: defaultLoop,
  },
  { id: "sign-yes", meaningLabel: "Yes", loopFrames: defaultLoop },
  { id: "sign-no", meaningLabel: "No", loopFrames: defaultLoop },
  {
    id: "sign-i-understand",
    meaningLabel: "I understand",
    loopFrames: defaultLoop,
  },
];

export function getSignQuizChallengeTotal() {
  // One quiz question per sign definition.
  return SIGN_DEFINITIONS.length;
}

export function getSignQuizChallengeId(signId: string) {
  return `quiz-${signId}`;
}

