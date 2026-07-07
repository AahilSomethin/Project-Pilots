"use client";

import type { BrailleMask, DotNumber } from "@/lib/braille";
import { dotNumberToBit } from "@/lib/braille";
import { BrailleDotGrid } from "@/components/braille/BrailleDotGrid";

export function BrailleInputGrid({
  value,
  onChange,
  showNumbers = false,
  disabled = false,
}: {
  value: BrailleMask;
  onChange: (next: BrailleMask) => void;
  showNumbers?: boolean;
  disabled?: boolean;
}) {
  return (
    <BrailleDotGrid
      value={value}
      interactive
      showNumbers={showNumbers}
      disabled={disabled}
      ariaLabel="Braille input"
      onToggle={(dot: DotNumber) => {
        const bit = dotNumberToBit(dot);
        onChange(value ^ bit);
      }}
      dotSize="lg"
    />
  );
}

