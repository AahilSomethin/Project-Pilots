"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { ProgressBar } from "@/components/ui/progress-bar";
import { Lesson } from "@/lib/types";

interface LessonPlayerProps {
  lesson: Lesson;
  accent?: "teal" | "blue" | "coral";
}

export function LessonPlayer({ lesson, accent = "teal" }: LessonPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = lesson.steps[stepIndex];
  const completion = useMemo(
    () => ((stepIndex + 1) / lesson.steps.length) * 100,
    [lesson.steps.length, stepIndex],
  );

  return (
    <div className="card-border space-y-4 bg-surface p-5">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Lesson level {lesson.level}</span>
        <span>{lesson.xpReward} XP</span>
      </div>
      <ProgressBar value={completion} accent={accent} />
      <motion.div
        key={step.id}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-1"
      >
        <p className="text-sm uppercase tracking-wide text-muted">Step {stepIndex + 1}</p>
        <h4 className="text-xl font-semibold">{step.title}</h4>
        <p className="text-sm text-muted">{step.detail}</p>
      </motion.div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
          disabled={stepIndex === 0}
          className="card-border px-3 py-2 text-sm text-muted transition-colors enabled:hover:text-foreground disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() =>
            setStepIndex((current) => Math.min(lesson.steps.length - 1, current + 1))
          }
          disabled={stepIndex === lesson.steps.length - 1}
          className="silent-glow card-border bg-surface px-3 py-2 text-sm transition-opacity enabled:hover:opacity-90 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
