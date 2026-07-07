"use client";

import type {
  HandSignDetectorPort,
  SignPracticeValidatorPort,
} from "@/modules/sign/sign-types";
import { SignLearningSystem } from "@/components/sign/SignLearningSystem";

export function SignModule({
  detectorPort,
  practiceValidatorPort,
}: {
  detectorPort?: HandSignDetectorPort;
  practiceValidatorPort?: SignPracticeValidatorPort;
}) {
  return (
    <SignLearningSystem
      detectorPort={detectorPort}
      practiceValidatorPort={practiceValidatorPort}
    />
  );
}

