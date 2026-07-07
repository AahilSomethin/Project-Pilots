"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HandDisplay } from "@/components/sign/HandDisplay";
import { SIGN_LETTERS } from "@/lib/signs";
import { type SignWordMetadata } from "@/lib/signs";
import { splitWordLetters } from "@/modules/sign/sign-utils";

export function WordBuilder({
  words,
  completedWordIds,
  onMarkWordComplete,
  practiceValidationSlot,
}: {
  words: SignWordMetadata[];
  completedWordIds: Set<string>;
  onMarkWordComplete: (wordId: string) => void;
  practiceValidationSlot?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"learn" | "practice">("learn");
  const [wordId, setWordId] = useState(words[0]?.id ?? "");
  const word = useMemo(() => words.find((w) => w.id === wordId) ?? words[0], [wordId, words]);

  const letters = useMemo(() => {
    if (!word) return [];
    return splitWordLetters(word.word);
  }, [word]);

  const [stepIndex, setStepIndex] = useState(0);

  const completed = word ? completedWordIds.has(word.id) : false;

  const currentLetter = letters[stepIndex] ?? letters[0] ?? "A";
  const letterMeta = SIGN_LETTERS[currentLetter] ?? SIGN_LETTERS["A"];

  const [practiceChecks, setPracticeChecks] = useState({
    reviewed: false,
    smooth: false,
  });

  const canMark = practiceChecks.reviewed && practiceChecks.smooth && !completed;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: "learn", label: "Learn" },
            { id: "practice", label: "Practice" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
                onClick={() => {
                  setMode(t.id);
                  setStepIndex(0);
                  setPracticeChecks({ reviewed: false, smooth: false });
                }}
            className={`card-border px-3 py-2 text-xs transition-colors ${
              mode === t.id ? "text-foreground silent-glow" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card-border bg-[var(--surface-2)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted">Target word</p>
            <p className="text-2xl font-semibold font-mono">{word?.word ?? ""}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Letters</p>
            <p className="mt-2 text-sm text-muted">
              {letters.length ? `${stepIndex + 1}/${letters.length}` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {words.map((w) => {
            const isActive = w.id === wordId;
            const isDone = completedWordIds.has(w.id);
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setWordId(w.id);
                  setMode("learn");
                  setStepIndex(0);
                  setPracticeChecks({ reviewed: false, smooth: false });
                }}
                className={`card-border px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "silent-glow text-foreground"
                    : isDone
                      ? "border-teal/30 text-teal"
                      : "text-muted hover:text-foreground"
                }`}
              >
                {w.word}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-start">
          <div className="space-y-3">
            <HandDisplay letter={currentLetter} />

            <div className="card-border bg-surface p-4">
              <p className="text-xs uppercase tracking-wide text-muted">
                Letters preview
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {letters.map((l, idx) => {
                  const isActive = idx === stepIndex;
                  const isPast = idx < stepIndex;
                  return (
                    <div
                      key={`${l}-${idx}`}
                      className={`px-3 py-2 text-sm font-semibold card-border ${
                        isActive ? "silent-glow" : isPast ? "opacity-70" : "bg-[var(--surface-2)]"
                      }`}
                    >
                      {l}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="card-border bg-[var(--surface-2)] p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Instruction</p>
              <p className="mt-2 text-sm text-muted">
                {mode === "learn"
                  ? `Letter ${stepIndex + 1}: ${letterMeta.instruction}`
                  : "Review the full spelling sequence, then self-check below."}
              </p>
            </div>

            {mode === "practice" && (
              <div className="card-border bg-[var(--surface-2)] p-4">
                <p className="text-xs uppercase tracking-wide text-muted">Self-check</p>
                <div className="mt-3 space-y-2 text-sm">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="text-muted">Reviewed the full sequence</span>
                    <input
                      type="checkbox"
                      checked={practiceChecks.reviewed}
                      onChange={(e) =>
                        setPracticeChecks((prev) => ({ ...prev, reviewed: e.target.checked }))
                      }
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="text-muted">Transitions feel smooth</span>
                    <input
                      type="checkbox"
                      checked={practiceChecks.smooth}
                      onChange={(e) =>
                        setPracticeChecks((prev) => ({ ...prev, smooth: e.target.checked }))
                      }
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPracticeChecks({ reviewed: false, smooth: false });
                      setStepIndex(0);
                    }}
                    className="card-border px-3 py-2 text-sm text-muted transition-colors enabled:hover:text-foreground"
                  >
                    Restart
                  </button>
                  <button
                    type="button"
                    disabled={!canMark}
                    onClick={() => onMarkWordComplete(word?.id ?? "")}
                    className="silent-glow card-border bg-surface px-3 py-2 text-sm transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
                    title={canMark ? "Mark self-check complete" : "Complete the self-check boxes first"}
                  >
                    {completed ? "Word completed" : "Mark word complete"}
                  </button>
                </div>

                {practiceValidationSlot}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
                className="card-border px-3 py-2 text-sm text-muted transition-colors enabled:hover:text-foreground disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.min(letters.length - 1, i + 1))}
                disabled={stepIndex >= letters.length - 1}
                className="silent-glow card-border bg-surface px-3 py-2 text-sm transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

