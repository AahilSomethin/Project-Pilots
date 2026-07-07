"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { ProgressBar } from "@/components/ui/progress-bar";
import { ModeSummary } from "@/lib/types";

interface ModeSelectorGridProps {
  modes: ModeSummary[];
}

const accentClass = {
  teal: "text-teal",
  blue: "text-blue",
  coral: "text-coral",
};

export function ModeSelectorGrid({ modes }: ModeSelectorGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {modes.map((mode, index) => (
        <motion.div
          key={mode.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: reduceMotion ? 0 : index * 0.05 }}
          whileHover={reduceMotion ? {} : { y: -2, scale: 1.01 }}
        >
          <Link
            href={`/${mode.slug}`}
            className="card-border block bg-surface p-5 transition-colors hover:border-border/60"
          >
            <p className={`text-xs font-semibold uppercase ${accentClass[mode.accent]}`}>
              {mode.title}
            </p>
            <p className="mt-2 text-sm text-muted">{mode.subtitle}</p>
            <div className="mt-4 space-y-2">
              <ProgressBar value={mode.completion} accent={mode.accent} />
              <div className="flex justify-between text-xs text-muted">
                <span>{mode.lessonsCompleted} lessons</span>
                <span>{mode.completion}% complete</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
