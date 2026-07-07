"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { ModuleShell } from "@/components/modules/module-shell";
import { SignCameraValidationExtension } from "@/components/modules/sign/sign-camera-validation-extension";
import { SurfaceCard } from "@/components/ui/surface-card";

import { useLocalProgress } from "@/hooks/use-local-progress";
import type {
  HandSignDetectorPort,
  SignPracticeValidatorPort,
} from "@/modules/sign/sign-types";
import {
  getAlphabetChallengeId,
  getSentenceChallengeId,
  getWordChallengeId,
} from "@/modules/sign/sign-utils";

import { SIGN_LETTERS, SIGN_SENTENCES, SIGN_WORDS } from "@/lib/signs";

import { AlphabetGrid } from "@/components/sign/AlphabetGrid";
import { SignLessonCard } from "@/components/sign/SignLessonCard";
import { WordBuilder } from "@/components/sign/WordBuilder";
import { SentenceBuilder } from "@/components/sign/SentenceBuilder";

type Stage = "alphabet" | "words" | "sentences";

function prefixMatchExtractLetters(ids: string[], prefix: string) {
  return ids
    .filter((id) => id.startsWith(prefix))
    .map((id) => id.slice(prefix.length))
    .filter(Boolean);
}

export function SignLearningSystem({
  detectorPort,
  practiceValidatorPort,
}: {
  detectorPort?: HandSignDetectorPort;
  practiceValidatorPort?: SignPracticeValidatorPort;
}) {
  const reduceMotion = useReducedMotion();
  const { awardCorrectAnswer, isChallengeCompleted, completionByMode } =
    useLocalProgress();

  const [stage, setStage] = useState<Stage>("alphabet");
  const [selectedLetter, setSelectedLetter] = useState("A");

  const completedIds = completionByMode["sign-language"];

  const completedLetters = useMemo(
    () => prefixMatchExtractLetters(completedIds, "sign-alphabet-"),
    [completedIds],
  );
  const completedWordIds = useMemo(
    () => new Set(prefixMatchExtractLetters(completedIds, "sign-word-")),
    [completedIds],
  );
  const completedSentenceIds = useMemo(
    () => new Set(prefixMatchExtractLetters(completedIds, "sign-sentence-")),
    [completedIds],
  );

  const letterChallengeId = useMemo(
    () => getAlphabetChallengeId(selectedLetter),
    [selectedLetter],
  );

  const letterCompleted = isChallengeCompleted({
    mode: "sign-language",
    challengeId: letterChallengeId,
  });

  const validationSlot = (
    <SignCameraValidationExtension
      detectorPort={detectorPort}
      practiceValidatorPort={practiceValidatorPort}
    />
  );

  const onMarkLetterComplete = () => {
    if (letterCompleted) return;
    awardCorrectAnswer({
      mode: "sign-language",
      challengeId: letterChallengeId,
    });
  };

  return (
    <ModuleShell
      title="Sign Language"
      subtitle="Alphabet to words to sentences—premium, focused, and camera-ready for later."
      accent="teal"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "alphabet", label: "Alphabet" },
              { id: "words", label: "Word Builder" },
              { id: "sentences", label: "Sentences" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setStage(t.id)}
              className={`card-border px-3 py-2 text-xs transition-colors ${
                stage === t.id ? "text-foreground silent-glow" : "text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={stage + selectedLetter}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {stage === "alphabet" && (
            <div className="grid gap-4 md:grid-cols-[0.78fr_1.22fr] md:items-start">
              <AlphabetGrid
                selectedLetter={selectedLetter}
                onSelect={(l) => setSelectedLetter(l)}
                completedLetters={completedLetters}
              />

              <SurfaceCard accent="teal">
                <SignLessonCard
                  key={selectedLetter}
                  letter={selectedLetter}
                  instruction={SIGN_LETTERS[selectedLetter]?.instruction ?? ""}
                  completed={letterCompleted}
                  onMarkComplete={onMarkLetterComplete}
                />
              </SurfaceCard>
            </div>
          )}

          {stage === "words" && (
            <div className="space-y-4">
              <SurfaceCard accent="teal" className="p-0">
                <WordBuilder
                  words={SIGN_WORDS}
                  completedWordIds={completedWordIds}
                  onMarkWordComplete={(wordId) => {
                    const challengeId = getWordChallengeId(wordId);
                    if (completedWordIds.has(wordId)) return;
                    awardCorrectAnswer({
                      mode: "sign-language",
                      challengeId,
                    });
                  }}
                  practiceValidationSlot={validationSlot}
                />
              </SurfaceCard>
            </div>
          )}

          {stage === "sentences" && (
            <div className="space-y-4">
              <SurfaceCard accent="teal" className="p-0">
                <SentenceBuilder
                  sentences={SIGN_SENTENCES}
                  completedSentenceIds={completedSentenceIds}
                  onMarkSentenceComplete={(sentenceId) => {
                    const challengeId = getSentenceChallengeId(sentenceId);
                    if (completedSentenceIds.has(sentenceId)) return;
                    awardCorrectAnswer({
                      mode: "sign-language",
                      challengeId,
                    });
                  }}
                  practiceValidationSlot={validationSlot}
                />
              </SurfaceCard>
            </div>
          )}
        </motion.div>

        <div className="text-xs text-muted">
          Note: camera-based validation is structured for future integration but is not implemented yet.
        </div>
      </div>
    </ModuleShell>
  );
}

