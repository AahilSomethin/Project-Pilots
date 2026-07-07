"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { ModuleShell } from "@/components/modules/module-shell";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useLocalProgress } from "@/hooks/use-local-progress";

import type { BrailleMask } from "@/lib/braille";
import {
  BRAILLE_LETTER_DOT_PATTERNS,
  dotNumberToBit,
  getBrailleDotLabel,
} from "@/lib/braille";
import { getBrailleWordLetters, BRAILLE_WORD_TARGETS } from "@/modules/braille/braille-data";
import {
  getBrailleLetterChallengeId,
  getBrailleWordChallengeId,
} from "@/modules/braille/braille-utils";

import { BrailleBasics } from "@/components/braille/BrailleBasics";
import { BrailleAlphabetGrid } from "@/components/braille/BrailleAlphabetGrid";
import { BrailleCell } from "@/components/braille/BrailleCell";
import { BrailleInputGrid } from "@/components/braille/BrailleInputGrid";

type BrailleStage = "alphabet" | "words";
type ValidationStatus = "idle" | "correct" | "incorrect";

function buildExpectedByLetter(): Record<string, BrailleMask> {
  const out: Record<string, BrailleMask> = {};
  for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    const pattern = BRAILLE_LETTER_DOT_PATTERNS[letter];
    const mask = pattern.reduce<BrailleMask>(
      (m, dot) => m | dotNumberToBit(dot),
      0,
    );
    out[letter] = mask;
  }
  return out;
}

export function BrailleModule() {
  const reduceMotion = useReducedMotion();
  const { awardCorrectAnswer, progress, hydrated } = useLocalProgress();

  const expectedByLetter = useMemo(() => buildExpectedByLetter(), []);

  const completedIds = progress.modeProgress["braille"].completedChallengeIds;
  const completedLetters = useMemo(() => {
    const s = new Set<string>();
    for (const id of completedIds) {
      const m = id.match(/^braille-letter-([A-Z])$/);
      if (m?.[1]) s.add(m[1]);
    }
    return s;
  }, [completedIds]);
  const completedWords = useMemo(() => {
    const s = new Set<string>();
    for (const id of completedIds) {
      const m = id.match(/^braille-word-(.+)$/);
      if (m?.[1]) s.add(m[1]);
    }
    return s;
  }, [completedIds]);

  const [stage, setStage] = useState<BrailleStage>("alphabet");
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [inputMask, setInputMask] = useState<BrailleMask>(0);

  const [status, setStatus] = useState<ValidationStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [shakeKey, setShakeKey] = useState(0);

  const selectedExpected = expectedByLetter[selectedLetter] ?? 0;
  const letterCompleted = completedLetters.has(selectedLetter);

  const [wordId, setWordId] = useState(BRAILLE_WORD_TARGETS[0]?.id ?? "word-cat");
  const wordTarget = useMemo(
    () => BRAILLE_WORD_TARGETS.find((w) => w.id === wordId) ?? BRAILLE_WORD_TARGETS[0],
    [wordId],
  );
  const wordLetters = useMemo(() => getBrailleWordLetters(wordTarget.word), [wordTarget.word]);
  const [letterStepIndex, setLetterStepIndex] = useState(0);

  const currentWordLetter = wordLetters[letterStepIndex] ?? wordLetters[0] ?? "A";
  const currentWordExpectedMask = expectedByLetter[currentWordLetter] ?? 0;
  const wordCompleted = completedWords.has(wordTarget.id);

  const resetInput = () => {
    setInputMask(0);
    setStatus("idle");
    setMessage("");
  };

  const onCheckLetter = () => {
    if (letterCompleted) return;
    const correct = inputMask === selectedExpected;
    if (correct) {
      setStatus("correct");
      setMessage("Correct. +10 XP");
      awardCorrectAnswer({
        mode: "braille",
        challengeId: getBrailleLetterChallengeId(selectedLetter),
      });
      return;
    }

    setStatus("incorrect");
    setMessage("Not quite. Retry the same dot pattern.");
    if (!reduceMotion) setShakeKey((k) => k + 1);
  };

  const onNextLetter = () => {
    const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const firstUncompleted = all.find((l) => !completedLetters.has(l)) ?? null;
    const idx = all.indexOf(selectedLetter);
    const after = all.slice(idx + 1).find((l) => !completedLetters.has(l)) ?? firstUncompleted;
    if (!after) {
      setMessage("You completed the alphabet. Reset from the dashboard to restart.");
      return;
    }
    setSelectedLetter(after);
    resetInput();
  };

  const onCheckWordLetter = () => {
    if (wordCompleted) return;
    const correct = inputMask === currentWordExpectedMask;
    if (correct) {
      if (letterStepIndex >= wordLetters.length - 1) {
        setStatus("correct");
        setMessage("Word completed. +10 XP");
        awardCorrectAnswer({
          mode: "braille",
          challengeId: getBrailleWordChallengeId(wordTarget.id),
        });
        return;
      }
      setStatus("correct");
      setMessage("Letter correct. Continue.");
      return;
    }

    setStatus("incorrect");
    setMessage("Not quite. Retry this letter.");
    if (!reduceMotion) setShakeKey((k) => k + 1);
  };

  const onNextWordLetter = () => {
    if (wordCompleted) return;
    if (status !== "correct") return;
    const nextIdx = Math.min(wordLetters.length - 1, letterStepIndex + 1);
    setLetterStepIndex(nextIdx);
    resetInput();
  };

  const onRestartWord = () => {
    setLetterStepIndex(0);
    resetInput();
  };

  const onChangeWord = (nextId: string) => {
    setWordId(nextId);
    setLetterStepIndex(0);
    resetInput();
  };

  const onStageChange = (next: BrailleStage) => {
    setStage(next);
    resetInput();
    setStatus("idle");
    setMessage("");
    if (next === "alphabet") setSelectedLetter("A");
    if (next === "words") {
      setWordId(BRAILLE_WORD_TARGETS[0]?.id ?? "word-cat");
      setLetterStepIndex(0);
    }
  };

  return (
    <ModuleShell
      title="Braille Learning"
      subtitle="Learn dots, build patterns, and spell words using 6-dot Braille."
      accent="coral"
    >
      <div className="space-y-4">
        <BrailleBasics />

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "alphabet", label: "Alphabet" },
              { id: "words", label: "Word Mode" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onStageChange(t.id)}
              className={`card-border px-3 py-2 text-xs transition-colors ${
                stage === t.id ? "text-foreground silent-glow" : "text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {stage === "alphabet" && (
          <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:items-start">
            <SurfaceCard accent="coral" className="p-0">
              <div className="p-5">
                <BrailleAlphabetGrid
                  selectedLetter={selectedLetter}
                  onSelect={(l) => {
                    setSelectedLetter(l);
                    resetInput();
                  }}
                  expectedByLetter={expectedByLetter}
                  completedLetters={completedLetters}
                />
              </div>
            </SurfaceCard>

            <div className="space-y-3">
              <SurfaceCard accent="coral" className="p-0">
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted">Selected letter</p>
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-3xl font-semibold font-mono">{selectedLetter}</h2>
                      <p className="text-xs text-muted">
                        Pattern:{" "}
                        <span className="font-mono text-foreground/90">
                          {getBrailleDotLabel(selectedExpected)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="card-border bg-[var(--surface-2)] p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Your input</p>
                    <motion.div
                      key={shakeKey}
                      className="mt-3 rounded-lg"
                      animate={
                        status === "incorrect" && !reduceMotion
                          ? { x: [0, -6, 6, -3, 3, 0] }
                          : { x: 0 }
                      }
                      transition={{ duration: 0.25 }}
                    >
                      <div
                        className={`transition-[box-shadow,border-color] ${
                          status === "correct"
                            ? "success-glow card-border bg-surface p-4"
                            : status === "incorrect"
                              ? "error-border card-border bg-surface p-4"
                              : "card-border bg-surface p-4"
                        }`}
                      >
                        <BrailleInputGrid value={inputMask} onChange={setInputMask} />
                      </div>
                    </motion.div>

                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={resetInput}
                        className="card-border px-3 py-2 text-xs text-muted transition-colors enabled:hover:text-foreground"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={onCheckLetter}
                        disabled={letterCompleted}
                        className="silent-glow card-border bg-surface px-3 py-2 text-xs transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
                      >
                        {letterCompleted ? "Completed" : "Check"}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`card-border bg-[var(--surface-2)] p-4 text-sm ${
                      status === "correct" ? "success-glow" : status === "incorrect" ? "error-border" : ""
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wide text-muted">Feedback</p>
                    <p className="mt-2">{message || "Toggle dots to match the letter’s braille cell."}</p>
                  </div>

                  {status === "correct" && !letterCompleted && (
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={onNextLetter}
                        className="silent-glow card-border bg-surface px-4 py-2 text-xs transition-opacity enabled:hover:opacity-90"
                      >
                        Next letter
                      </button>
                    </div>
                  )}

                  {letterCompleted && (
                    <div className="text-xs text-muted">
                      This letter is completed. Pick another letter to keep learning.
                    </div>
                  )}
                </div>
              </SurfaceCard>

              {!hydrated && <p className="text-sm text-muted">Loading progress...</p>}
            </div>
          </div>
        )}

        {stage === "words" && (
          <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-start">
            <SurfaceCard accent="coral" className="p-0">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted">Target word</p>
                    <p className="text-2xl font-semibold font-mono">{wordTarget.word}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted">Progress</p>
                    <p className="mt-2 text-sm text-muted">
                      {Math.min(letterStepIndex + 1, wordLetters.length)}/{wordLetters.length}
                    </p>
                  </div>
                </div>

                <div className="card-border bg-[var(--surface-2)] p-4">
                  <p className="text-xs uppercase tracking-wide text-muted">Spelling flow</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wordLetters.map((l, idx) => {
                      const isActive = idx === letterStepIndex;
                      const isPast = idx < letterStepIndex || wordCompleted;
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

                <div className="card-border bg-[var(--surface-2)] p-4">
                  <p className="text-xs uppercase tracking-wide text-muted">Choose a word</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BRAILLE_WORD_TARGETS.map((w) => {
                      const isActive = w.id === wordId;
                      const done = completedWords.has(w.id);
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => onChangeWord(w.id)}
                          className={`card-border px-3 py-2 text-xs transition-colors ${
                            isActive ? "silent-glow text-foreground" : done ? "border-teal/30 text-teal" : "text-muted hover:text-foreground"
                          }`}
                        >
                          {w.word}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {wordCompleted && (
                  <div className="text-xs text-muted">
                    Word completed. Select another word to continue.
                  </div>
                )}
              </div>
            </SurfaceCard>

            <div className="space-y-3">
              <SurfaceCard accent="coral" className="p-0">
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-muted">Current letter</p>
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-3xl font-semibold font-mono">{currentWordLetter}</h2>
                      <p className="text-xs text-muted">
                        Expected:{" "}
                        <span className="font-mono text-foreground/90">
                          {getBrailleDotLabel(currentWordExpectedMask)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="card-border bg-[var(--surface-2)] p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Your input</p>
                    <motion.div
                      key={shakeKey + wordId + letterStepIndex}
                      className="mt-3 rounded-lg"
                      animate={
                        status === "incorrect" && !reduceMotion
                          ? { x: [0, -6, 6, -3, 3, 0] }
                          : { x: 0 }
                      }
                      transition={{ duration: 0.25 }}
                    >
                      <div
                        className={`transition-[box-shadow,border-color] ${
                          status === "correct"
                            ? "success-glow card-border bg-surface p-4"
                            : status === "incorrect"
                              ? "error-border card-border bg-surface p-4"
                              : "card-border bg-surface p-4"
                        }`}
                      >
                        <BrailleInputGrid
                          value={inputMask}
                          onChange={setInputMask}
                          disabled={wordCompleted}
                        />
                      </div>
                    </motion.div>

                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={resetInput}
                        className="card-border px-3 py-2 text-xs text-muted transition-colors enabled:hover:text-foreground"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={onCheckWordLetter}
                        disabled={wordCompleted}
                        className="silent-glow card-border bg-surface px-3 py-2 text-xs transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
                      >
                        {wordCompleted ? "Completed" : "Check letter"}
                      </button>
                      <button
                        type="button"
                        onClick={onRestartWord}
                        disabled={wordCompleted}
                        className="card-border px-3 py-2 text-xs text-muted transition-colors enabled:hover:text-foreground disabled:opacity-40"
                      >
                        Restart
                      </button>
                    </div>
                  </div>

                  <div
                    className={`card-border bg-[var(--surface-2)] p-4 text-sm ${
                      status === "correct" ? "success-glow" : status === "incorrect" ? "error-border" : ""
                    }`}
                  >
                    <p className="text-xs uppercase tracking-wide text-muted">Feedback</p>
                    <p className="mt-2">{message || "Build the dot pattern for the current letter."}</p>
                  </div>

                  {status === "correct" && !wordCompleted && (
                    <div className="flex gap-2 pt-1">
                      {letterStepIndex >= wordLetters.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => onChangeWord(wordId)}
                          className="silent-glow card-border bg-surface px-4 py-2 text-xs transition-opacity enabled:hover:opacity-90"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onNextWordLetter}
                          className="silent-glow card-border bg-surface px-4 py-2 text-xs transition-opacity enabled:hover:opacity-90"
                        >
                          Next letter
                        </button>
                      )}
                    </div>
                  )}

                  <div className="card-border bg-[var(--surface-2)] p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Reference cell</p>
                    <div className="mt-3">
                      <BrailleCell mask={currentWordExpectedMask} />
                    </div>
                    <p className="mt-3 text-xs text-muted">
                      Match the dots exactly. Camera validation is planned later.
                    </p>
                  </div>
                </div>
              </SurfaceCard>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}

