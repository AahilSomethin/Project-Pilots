"use client";

import type { BrailleMask } from "@/lib/braille";
import { BrailleDotGrid } from "@/components/braille/BrailleDotGrid";

export function BrailleBasics() {
  const dummyMask = 0 as BrailleMask;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-muted">6-dot system</p>
        <p className="text-xs text-muted">Dots: 1 2 3 (left) / 4 5 6 (right)</p>
      </div>

      <div className="card-border bg-[var(--surface-2)] p-4">
        <p className="text-sm text-muted">Dot positions</p>
        <div className="mt-3">
          <BrailleDotGrid
            value={dummyMask}
            interactive={false}
            showNumbers
            ariaLabel="Braille dot numbering"
          />
        </div>
      </div>
    </div>
  );
}

