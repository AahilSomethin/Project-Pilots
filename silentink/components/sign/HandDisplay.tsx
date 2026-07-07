"use client";

import { memo, useMemo } from "react";

import { SignLetterMetadata, SIGN_LETTERS } from "@/lib/signs";
import { HandScene } from "@/components/sign/HandScene";

type HandDisplayProps =
  | {
      type: "letter";
      value: string;
      sizeClassName?: string;
    }
  | {
      letter: string;
      sizeClassName?: string;
    };

function resolveLetter(props: HandDisplayProps): string {
  if ("type" in props) return props.value;
  return props.letter;
}

function getLetterMetadata(letter: string): SignLetterMetadata {
  const normalized = letter.trim().toUpperCase();
  return SIGN_LETTERS[normalized] ?? SIGN_LETTERS["A"];
}

function makeShortDescription(instruction: string) {
  // Keep it compact: first sentence or a truncated fallback.
  const trimmed = instruction.trim();
  const first = trimmed.split(".")[0]?.trim();
  const base = first ? `${first}.` : trimmed;
  const maxLen = 95;
  if (base.length <= maxLen) return base;
  return `${base.slice(0, maxLen - 3)}...`;
}

function HandDisplayComponent(props: HandDisplayProps) {
  const letter = resolveLetter(props);
  const meta = useMemo(() => getLetterMetadata(letter), [letter]);

  // Future-ready rendering abstraction:
  // - placeholder image
  // - Lottie animation
  // - 3D GLB pose/animation
  // For now we use the 3D renderer in a lightweight Canvas.
  const renderer = "three" as const;

  const sizeClassName = props.sizeClassName ?? "h-[240px] md:h-[280px]";
  const description = useMemo(
    () => makeShortDescription(meta.instruction),
    [meta.instruction],
  );

  const fallback = useMemo(
    () => <div className="text-5xl font-semibold">{meta.label}</div>,
    [meta.label],
  );

  return (
    <div
      className={`card-border bg-(--surface-2) p-3 ${sizeClassName} flex flex-col`}
    >
      <div className="min-h-0 flex-1">
        {renderer === "three" ? (
          <HandScene className="h-full w-full" poseKey={meta.poseKey} fallback={fallback} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-4xl font-semibold">{meta.label}</div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs uppercase tracking-wide text-muted">
          Hand shape for {meta.letter}
        </p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}

export const HandDisplay = memo(HandDisplayComponent);

