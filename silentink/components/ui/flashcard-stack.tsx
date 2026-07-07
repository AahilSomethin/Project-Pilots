"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Flashcard } from "@/lib/types";

export function FlashcardStack({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const reduceMotion = useReducedMotion();
  const card = cards[index];

  return (
    <div className="space-y-3">
      <motion.button
        type="button"
        onClick={() => setShowAnswer((value) => !value)}
        whileTap={reduceMotion ? {} : { scale: 0.99 }}
        className="card-border flex h-40 w-full flex-col justify-between bg-surface p-4 text-left"
      >
        <p className="text-xs uppercase tracking-wide text-muted">Flashcard</p>
        <p className="text-2xl font-semibold">{card.prompt}</p>
        <p className="text-sm text-muted">
          {showAnswer ? `Answer: ${card.answer}` : "Tap card to reveal answer"}
        </p>
      </motion.button>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setIndex((current) => Math.max(current - 1, 0));
            setShowAnswer(false);
          }}
          disabled={index === 0}
          className="card-border px-3 py-2 text-xs text-muted disabled:opacity-30"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => {
            setIndex((current) => Math.min(current + 1, cards.length - 1));
            setShowAnswer(false);
          }}
          disabled={index === cards.length - 1}
          className="card-border px-3 py-2 text-xs text-muted disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
