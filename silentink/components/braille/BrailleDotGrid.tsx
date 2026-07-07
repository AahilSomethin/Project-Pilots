"use client";

import type { DotNumber, BrailleMask } from "@/lib/braille";
import { dotNumberToBit } from "@/lib/braille";

const DOT_LAYOUT: DotNumber[][] = [
  [1, 4],
  [2, 5],
  [3, 6],
];

export function BrailleDotGrid({
  value,
  interactive = false,
  onToggle,
  showNumbers = false,
  disabled = false,
  dotSize = "md",
  ariaLabel,
}: {
  value: BrailleMask;
  interactive?: boolean;
  onToggle?: (dot: DotNumber) => void;
  showNumbers?: boolean;
  disabled?: boolean;
  dotSize?: "sm" | "md" | "lg";
  ariaLabel?: string;
}) {
  const dotSizeClass =
    dotSize === "sm"
      ? "h-7 w-7"
      : dotSize === "lg"
        ? "h-12 w-12"
        : "h-10 w-10";

  return (
    <div className="grid grid-cols-2 gap-3">
      {DOT_LAYOUT.flat().map((dot) => {
        const active = (value & dotNumberToBit(dot)) !== 0;
        const key = `dot-${dot}`;
        const content = (
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-full border transition-colors ${dotSizeClass} ${
                active
                  ? "border-teal/50 bg-teal/50 shadow-[0_0_26px_rgba(46,196,182,0.18)]"
                  : "border-border bg-[var(--surface)]"
              }`}
            />
          </div>
        );

        if (!interactive) {
          return (
            <div
              key={key}
              className="relative flex items-center justify-center"
              aria-hidden="true"
            >
              {content}
              {showNumbers && (
                <span className="pointer-events-none absolute -top-3 text-[10px] font-semibold text-muted">
                  {dot}
                </span>
              )}
            </div>
          );
        }

        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (disabled) return;
              onToggle?.(dot);
            }}
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel} dot ${dot}` : `Toggle dot ${dot}`}
            className={`relative flex items-center justify-center ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            {content}
            {showNumbers && (
              <span className="pointer-events-none absolute -top-3 text-[10px] font-semibold text-muted">
                {dot}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

