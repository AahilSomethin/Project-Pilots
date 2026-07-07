"use client";

import type { BrailleMask } from "@/lib/braille";
import { BrailleDotGrid } from "@/components/braille/BrailleDotGrid";

export function BrailleCell({
  mask,
  showNumbers = false,
  ariaLabel,
}: {
  mask: BrailleMask;
  showNumbers?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div className="card-border bg-[var(--surface-2)] p-3">
      <BrailleDotGrid
        value={mask}
        showNumbers={showNumbers}
        interactive={false}
        ariaLabel={ariaLabel}
        dotSize="sm"
      />
    </div>
  );
}

