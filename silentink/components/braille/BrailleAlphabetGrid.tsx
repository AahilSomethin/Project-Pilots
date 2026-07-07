"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { BrailleMask } from "@/lib/braille";
import { BrailleDotGrid } from "@/components/braille/BrailleDotGrid";
import { getBrailleDotLabel } from "@/lib/braille";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function BrailleAlphabetGrid({
  selectedLetter,
  onSelect,
  expectedByLetter,
  completedLetters,
}: {
  selectedLetter: string;
  onSelect: (letter: string) => void;
  expectedByLetter: Record<string, BrailleMask>;
  completedLetters: Set<string>;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-muted">Alphabet (A–Z)</p>
        <p className="text-xs text-muted">
          {completedLetters.size} completed
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {ALPHABET.split("").map((letter, idx) => {
          const isActive = letter === selectedLetter;
          const isDone = completedLetters.has(letter);
          const mask = expectedByLetter[letter] ?? 0;
          return (
            <motion.button
              key={letter}
              type="button"
              onClick={() => onSelect(letter)}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: reduceMotion ? 0 : idx * 0.01 }}
              className={`card-border bg-surface p-3 text-left transition-colors ${
                isActive
                  ? "silent-glow"
                  : isDone
                    ? "border-teal/30"
                    : "border-border/60 hover:border-border/90"
              }`}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold font-mono">{letter}</span>
                <span className="text-[10px] text-muted">{getBrailleDotLabel(mask)}</span>
              </div>
              <div className="mt-2">
                <BrailleDotGrid value={mask} interactive={false} showNumbers={false} ariaLabel={`Braille ${letter}`} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

