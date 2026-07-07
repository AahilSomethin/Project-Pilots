"use client";

import type {
  HandSignDetectorPort,
  SignPracticeValidatorPort,
} from "@/modules/sign/sign-types";

export function SignCameraValidationExtension({
  detectorPort: _detectorPort,
  practiceValidatorPort: _practiceValidatorPort,
}: {
  detectorPort?: HandSignDetectorPort;
  practiceValidatorPort?: SignPracticeValidatorPort;
}) {
  // Future extension point:
  // - Render a camera view locally
  // - Run detectorPort.detectSign on frames
  // - Feed detector output into a practice validatorPort.validatePractice()
  // - Keep this UI layer separate from business logic for clean upgrades.
  void _detectorPort;
  void _practiceValidatorPort;

  return (
    <div className="card-border bg-[var(--surface-2)] p-4">
      <p className="text-xs uppercase tracking-wide text-muted">Validation</p>
      <p className="mt-2 text-sm text-muted">
        Camera-based sign validation will plug in here later.
      </p>
    </div>
  );
}

