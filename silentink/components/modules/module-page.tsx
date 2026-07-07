"use client";

import { ReactNode } from "react";

import { FlashcardStack } from "@/components/ui/flashcard-stack";
import { LessonPlayer } from "@/components/ui/lesson-player";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useFlashcards, useLessons } from "@/hooks/use-learning-data";
import { LearningMode } from "@/lib/types";

interface ModulePageProps {
  mode: LearningMode;
  title: string;
  subtitle: string;
  accent: "teal" | "blue" | "coral";
  interactivePanel?: ReactNode;
}

export function ModulePage({
  mode,
  title,
  subtitle,
  accent,
  interactivePanel,
}: ModulePageProps) {
  const { data: lessons, isLoading: loadingLessons } = useLessons(mode);
  const { data: cards, isLoading: loadingCards } = useFlashcards(mode);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Module</p>
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        <p className="max-w-xl text-sm text-muted">{subtitle}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <SurfaceCard title="Lesson Player" subtitle="Level-by-level micro progression">
          {loadingLessons || !lessons ? (
            <p className="text-sm text-muted">Loading lessons...</p>
          ) : (
            <LessonPlayer lesson={lessons[0]} accent={accent} />
          )}
        </SurfaceCard>

        <SurfaceCard title="Flashcards + Quiz" subtitle="Tap to reveal and self-check">
          {loadingCards || !cards ? (
            <p className="text-sm text-muted">Loading flashcards...</p>
          ) : (
            <FlashcardStack cards={cards} />
          )}
        </SurfaceCard>
      </div>

      {interactivePanel}
    </section>
  );
}
