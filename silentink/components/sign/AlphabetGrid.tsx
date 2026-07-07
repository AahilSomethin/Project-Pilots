"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function AlphabetGrid({
  selectedLetter,
  onSelect,
  completedLetters,
}: {
  selectedLetter: string;
  onSelect: (letter: string) => void;
  completedLetters?: string[];
}) {
  const reduceMotion = useReducedMotion();
  const completed = useMemo(
    () => new Set(completedLetters ?? []),
    [completedLetters],
  );

  return (
    <div className="card-border bg-[var(--surface-2)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">Alphabet</p>
        <p className="text-xs text-muted">{completed.size} completed</p>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {ALPHABET.map((letter, idx) => {
          const isActive = letter === selectedLetter;
          const isDone = completed.has(letter);
          return (
            <motion.button
              key={letter}
              type="button"
              onClick={() => onSelect(letter)}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: reduceMotion ? 0 : idx * 0.01 }}
              className={`card-border bg-surface px-3 py-2 text-center text-sm font-semibold transition-colors ${
                isActive
                  ? "silent-glow"
                  : isDone
                    ? "border-teal/30 text-teal"
                    : "border-border/60 text-foreground/90 hover:border-border/90"
              }`}
              aria-pressed={isActive}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

