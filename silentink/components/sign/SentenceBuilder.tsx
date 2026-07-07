"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HandDisplay } from "@/components/sign/HandDisplay";
import { SIGN_LETTERS } from "@/lib/signs";
import { type SignSentenceMetadata } from "@/lib/signs";
import { splitWordLetters } from "@/modules/sign/sign-utils";

type SentenceUnit = {
  wordIndex: number;
  word: string;
  letterIndex: number;
  letter: string;
};

function buildSentenceUnits(sentence: SignSentenceMetadata): SentenceUnit[] {
  const units: SentenceUnit[] = [];
  sentence.words.forEach((word, wordIndex) => {
    const letters = splitWordLetters(word);
    letters.forEach((letter, letterIndex) => {
      units.push({ wordIndex, word, letterIndex, letter });
    });
  });
  return units;
}

export function SentenceBuilder({
  sentences,
  completedSentenceIds,
  onMarkSentenceComplete,
  practiceValidationSlot,
}: {
  sentences: SignSentenceMetadata[];
  completedSentenceIds: Set<string>;
  onMarkSentenceComplete: (sentenceId: string) => void;
  practiceValidationSlot?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"learn" | "practice">("learn");
  const [sentenceId, setSentenceId] = useState(sentences[0]?.id ?? "");
  const sentence = useMemo(
    () => sentences.find((s) => s.id === sentenceId) ?? sentences[0],
    [sentenceId, sentences],
  );

  const units = useMemo(() => (sentence ? buildSentenceUnits(sentence) : []), [sentence]);

  const [stepIndex, setStepIndex] = useState(0);

  const currentUnit = units[stepIndex] ?? units[0] ?? null;
  const activeWordIndex = currentUnit?.wordIndex ?? 0;

  const activeWordLetters = useMemo(() => {
    const word = currentUnit?.word ?? sentence?.words[0] ?? "";
    return splitWordLetters(word);
  }, [currentUnit, sentence]);

  const completed = sentence ? completedSentenceIds.has(sentence.id) : false;

  const [practiceChecks, setPracticeChecks] = useState({
    reviewedAll: false,
    confident: false,
  });

  const canMark =
    practiceChecks.reviewedAll && practiceChecks.confident && !completed && stepIndex === units.length - 1;

  const currentLetter = currentUnit?.letter ?? "A";
  const letterMeta = SIGN_LETTERS[currentLetter] ?? SIGN_LETTERS["A"];

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
              setPracticeChecks({ reviewedAll: false, confident: false });
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted">Target sentence</p>
            <p className="text-2xl font-semibold font-mono">{sentence?.sentence ?? ""}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Sequence</p>
            <p className="mt-2 text-sm text-muted">
              {units.length ? `${stepIndex + 1}/${units.length}` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {sentences.map((s) => {
            const isActive = s.id === sentenceId;
            const isDone = completedSentenceIds.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSentenceId(s.id);
                  setMode("learn");
                  setStepIndex(0);
                  setPracticeChecks({ reviewedAll: false, confident: false });
                }}
                className={`card-border px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "silent-glow text-foreground"
                    : isDone
                      ? "border-teal/30 text-teal"
                      : "text-muted hover:text-foreground"
                }`}
              >
                {s.sentence}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-start">
        <div className="space-y-3">
          <HandDisplay letter={currentLetter} />
          <div className="card-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Words</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(sentence?.words ?? []).map((word, wordIndex) => {
                const isActive = wordIndex === activeWordIndex;
                return (
                  <div
                    key={`${word}-${wordIndex}`}
                    className={`px-3 py-2 text-sm font-semibold card-border ${
                      isActive ? "silent-glow" : "bg-[var(--surface-2)] opacity-80"
                    }`}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Letters (active word)</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeWordLetters.map((l, idx) => {
                const isActive = currentUnit
                  ? currentUnit.letterIndex === idx
                  : idx === 0;
                const isPast = idx < (currentUnit?.letterIndex ?? 0);
                return (
                  <div
                    key={`${l}-${idx}`}
                    className={`px-3 py-2 text-sm font-semibold card-border ${
                      isActive
                        ? "silent-glow"
                        : isPast
                          ? "opacity-70"
                          : "bg-[var(--surface-2)]"
                    }`}
                  >
                    {l}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Instruction</p>
            <p className="mt-2 text-sm text-muted">
              {mode === "learn"
                ? `Letter: ${currentLetter}. ${letterMeta.instruction}`
                : "Review the full spelling flow. Self-check below."}
            </p>
          </div>

          {mode === "practice" && (
            <div className="card-border bg-[var(--surface-2)] p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Self-check</p>
                <div className="mt-3 space-y-2 text-sm">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="text-muted">Reviewed all letters</span>
                    <input
                      type="checkbox"
                      checked={practiceChecks.reviewedAll}
                      onChange={(e) =>
                        setPracticeChecks((prev) => ({
                          ...prev,
                          reviewedAll: e.target.checked,
                        }))
                      }
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="text-muted">Felt confident in the flow</span>
                    <input
                      type="checkbox"
                      checked={practiceChecks.confident}
                      onChange={(e) =>
                        setPracticeChecks((prev) => ({
                          ...prev,
                          confident: e.target.checked,
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPracticeChecks({ reviewedAll: false, confident: false });
                    setStepIndex(0);
                  }}
                  className="card-border px-3 py-2 text-sm text-muted transition-colors enabled:hover:text-foreground"
                >
                  Restart
                </button>
                <button
                  type="button"
                  disabled={!canMark}
                  onClick={() => onMarkSentenceComplete(sentence?.id ?? "")}
                  className="silent-glow card-border bg-surface px-3 py-2 text-sm transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
                  title={
                    canMark ? "Mark sentence as complete" : "Go through the full sequence and finish the self-check."
                  }
                >
                  {completed ? "Sentence completed" : "Mark sentence complete"}
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
              onClick={() => setStepIndex((i) => Math.min(units.length - 1, i + 1))}
              disabled={stepIndex >= units.length - 1}
              className="silent-glow card-border bg-surface px-3 py-2 text-sm transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

