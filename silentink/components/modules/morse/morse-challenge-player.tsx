"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { useLocalProgress } from "@/hooks/use-local-progress";
import { MorseTapPad } from "@/components/modules/morse-tap-pad";
import type { MorseChallenge } from "@/modules/morse";
import {
  getMatchState,
  decodeSequenceToCharacter,
  isExactMatch,
  normalizeSequence,
} from "@/modules/morse/morse-utils";
import { MORSE_CHALLENGES } from "@/modules/morse/morse-lessons";
import { ModuleShell } from "@/components/modules/module-shell";

function formatMorseEntry(entry: string) {
  if (!entry) return "—";
  return entry.split("").join(" ");
}

function getFirstUncompletedChallengeId({
  completed,
}: {
  completed: string[];
}): string | null {
  const completedSet = new Set(completed);
  const first = MORSE_CHALLENGES.find((c) => !completedSet.has(c.id));
  return first?.id ?? null;
}

function getNextChallengeId({
  currentId,
  completed,
}: {
  currentId: string;
  completed: string[];
}): string | null {
  const completedSet = new Set(completed);
  const currentIndex = MORSE_CHALLENGES.findIndex((c) => c.id === currentId);
  if (currentIndex < 0) return getFirstUncompletedChallengeId({ completed });

  const after = MORSE_CHALLENGES.slice(currentIndex + 1).find((c) => !completedSet.has(c.id));
  if (after) return after.id;

  const first = MORSE_CHALLENGES.find((c) => !completedSet.has(c.id));
  return first?.id ?? null;
}

type ValidationState = "idle" | "prefix" | "exact" | "mismatch" | "correct" | "incorrect";

export function MorseChallengePlayer() {
  const reduceMotion = useReducedMotion();
  const { progress, hydrated, awardCorrectAnswer } = useLocalProgress();

  const completedIds = progress.modeProgress["morse-code"].completedChallengeIds;

  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState<ValidationState>("idle");
  const [message, setMessage] = useState<string>("");
  const [shakeKey, setShakeKey] = useState(0);

  const activeChallenge: MorseChallenge | null = useMemo(() => {
    if (!activeChallengeId) return null;
    return MORSE_CHALLENGES.find((c) => c.id === activeChallengeId) ?? null;
  }, [activeChallengeId]);

  useEffect(() => {
    if (!hydrated) return;
    if (activeChallengeId) return;
    const t = window.setTimeout(() => {
      setActiveChallengeId(
        getFirstUncompletedChallengeId({ completed: completedIds }) ??
          MORSE_CHALLENGES[0]?.id ??
          null,
      );
    }, 0);
    return () => window.clearTimeout(t);
  }, [activeChallengeId, completedIds, hydrated]);

  useEffect(() => {
    // Keep input scoped to the current challenge.
    const t = window.setTimeout(() => {
      setEntry("");
      setStatus("idle");
      setMessage("");
    }, 0);
    return () => window.clearTimeout(t);
  }, [activeChallengeId]);

  const matchState = useMemo(() => {
    if (!activeChallenge) return "empty" as const;
    return getMatchState(entry, activeChallenge.expectedSequence);
  }, [activeChallenge, entry]);

  const decodedEntry = useMemo(() => {
    if (!activeChallenge) return null;
    if (activeChallenge.kind !== "decode") return null;
    return decodeSequenceToCharacter(entry);
  }, [activeChallenge, entry]);

  useEffect(() => {
    if (!activeChallenge) return;
    if (status === "correct") return;

    const t = window.setTimeout(() => {
      if (matchState === "empty") {
        setStatus("idle");
        setMessage(
          `Press on the pad to enter Morse for "${activeChallenge.prompt}".`,
        );
        return;
      }
      if (matchState === "prefix") {
        setStatus("prefix");
        setMessage("Nice timing. Keep going.");
        return;
      }
      if (matchState === "exact") {
        setStatus("exact");
        setMessage("Exact match so far. Submit when ready.");
        return;
      }
      setStatus("mismatch");
      setMessage("Not quite. Try the same timing again.");
    }, 0);

    return () => window.clearTimeout(t);
  }, [activeChallenge, matchState, status]);

  const addSymbol = useCallback(
    (symbol: "." | "-") => {
      if (!activeChallenge) return;
      if (status === "correct") return;
      setEntry((current) => normalizeSequence(current + symbol));
    },
    [activeChallenge, status],
  );

  const onReset = useCallback(() => {
    setEntry("");
    setStatus("idle");
    setMessage("");
    setShakeKey(0);
  }, []);

  const onSubmit = useCallback(() => {
    if (!activeChallenge) return;
    if (status === "correct") return;

    const correct = isExactMatch(entry, activeChallenge.expectedSequence);

    if (correct) {
      setStatus("correct");
      const decoded =
        activeChallenge.kind === "decode"
          ? decodeSequenceToCharacter(activeChallenge.expectedSequence)
          : null;
      setMessage(decoded ? `Correct. Decoded: ${decoded}. +10 XP` : "Correct. +10 XP");
      awardCorrectAnswer({
        mode: "morse-code",
        challengeId: activeChallenge.id,
      });
      return;
    }

    setStatus("incorrect");
    setMessage("Close - retry with the short/long rhythm.");
    if (!reduceMotion) setShakeKey((k) => k + 1);
  }, [activeChallenge, awardCorrectAnswer, entry, reduceMotion, status]);

  const showAllComplete = hydrated && completedIds.length === MORSE_CHALLENGES.length;

  const onContinue = useCallback(() => {
    if (!activeChallenge) return;
    const next = getNextChallengeId({
      currentId: activeChallenge.id,
      completed: [...completedIds],
    });
    setActiveChallengeId(next);
    setEntry("");
    setStatus("idle");
    setMessage("");
  }, [activeChallenge, completedIds]);

  const content = (() => {
    if (showAllComplete) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted">You completed all Morse challenges.</p>
          <p className="text-sm text-muted">
            Reset your progress from the dashboard to start again.
          </p>
          <div className="pt-1">
            <Link
              href="/dashboard"
              className="silent-glow card-border bg-surface px-4 py-2 text-xs transition-opacity enabled:hover:opacity-90"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      );
    }

    if (!hydrated || !activeChallenge) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted">Loading Morse lesson...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Target</p>
          {activeChallenge.kind === "decode" ? (
            <div className="mt-1 space-y-1">
              <p className="text-lg font-semibold">{activeChallenge.prompt}</p>
              <p className="font-mono text-sm text-muted">
                Expected: {activeChallenge.expectedSequence.split("").join(" ")}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-2xl font-semibold font-mono">
              {activeChallenge.prompt}
            </p>
          )}
        </div>

        <div className="card-border bg-(--surface-2) p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Live Morse</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <motion.p
              key={entry}
              className="font-mono text-lg tracking-[0.18em]"
              initial={reduceMotion ? undefined : { opacity: 0.6, scale: 0.98 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.14 }}
            >
              {formatMorseEntry(entry)}
            </motion.p>
            <p className="text-sm text-muted">
              {status === "correct" && "Correct"}
              {status === "incorrect" && "Try again"}
              {status === "prefix" && "Matching"}
              {status === "exact" && "Ready"}
              {status === "mismatch" && "Timing off"}
              {status === "idle" && "Enter the code"}
            </p>
          </div>

          {activeChallenge.kind === "decode" && (
            <div className="mt-2">
              <p className="text-xs uppercase tracking-wide text-muted">Decoded</p>
              <p className="mt-1 font-mono text-lg">
                {decodedEntry ?? "—"}
              </p>
              {status === "incorrect" && (
                <p className="mt-1 text-sm text-muted">No worries. Try the same rhythm.</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <MorseTapPad onSymbol={addSymbol} disabled={status === "correct"} />

          <motion.div
            key={shakeKey}
            className={`transition-[box-shadow,border-color] ${
              status === "correct"
                ? "success-glow card-border"
                : status === "incorrect"
                  ? "error-border card-border"
                  : "card-border"
            }`}
            animate={
              status === "incorrect" && !reduceMotion
                ? { x: [0, -6, 6, -3, 3, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-surface px-4 py-3">
              <p className="text-sm text-muted">{message}</p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onReset}
                  className="card-border px-3 py-2 text-xs text-muted transition-colors hover:text-foreground"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={entry.length === 0 || status === "correct"}
                  className="silent-glow card-border bg-surface px-3 py-2 text-xs transition-opacity disabled:opacity-40"
                >
                  Submit
                </button>
              </div>
            </div>
          </motion.div>

          {status === "correct" && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onContinue}
                  className="silent-glow card-border bg-surface px-4 py-2 text-sm transition-opacity enabled:hover:opacity-90"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Shake is handled by the motion container above. */}
      </div>
    );
  })();

  return (
    <ModuleShell
      title="Morse Code"
      subtitle="Practice rhythm and precision with tap-driven Morse input."
      accent="blue"
    >
      {content}
    </ModuleShell>
  );
}

