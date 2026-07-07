"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HandDisplay } from "@/components/sign/HandDisplay";

export function SignLessonCard({
  letter,
  instruction,
  completed,
  onMarkComplete,
}: {
  letter: string;
  instruction: string;
  completed: boolean;
  onMarkComplete: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [checks, setChecks] = useState({ handshape: false, hold: false });

  const canComplete = useMemo(() => checks.handshape && checks.hold, [checks]);

  return (
    <motion.div
      key={letter}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="card-border bg-[var(--surface-2)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Letter lesson</p>
            <h2 className="mt-2 text-3xl font-semibold font-mono">{letter}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted">Progress</p>
            <p className="mt-2 text-sm">{completed ? "Completed" : "In progress"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr] md:items-start">
        <div className="space-y-3">
          <HandDisplay letter={letter} />
          <div className="card-border bg-[var(--surface-2)] p-4 text-sm text-muted">
            Practice mode is self-guided. Camera validation plugs in later.
          </div>
        </div>

        <div className="space-y-3">
          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Instruction</p>
            <p className="mt-2">{instruction}</p>
          </div>

          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Self-check</p>
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-muted">Clear handshape</span>
                <input
                  type="checkbox"
                  checked={checks.handshape}
                  onChange={(e) =>
                    setChecks((prev) => ({ ...prev, handshape: e.target.checked }))
                  }
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-muted">Steady hold</span>
                <input
                  type="checkbox"
                  checked={checks.hold}
                  onChange={(e) => setChecks((prev) => ({ ...prev, hold: e.target.checked }))}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setAttempts((n) => n + 1)}
                className="card-border px-3 py-2 text-sm text-muted transition-colors enabled:hover:text-foreground"
              >
                Log practice ({attempts})
              </button>
              <button
                type="button"
                onClick={onMarkComplete}
                disabled={completed || !canComplete}
                className={`silent-glow card-border bg-surface px-3 py-2 text-sm transition-opacity enabled:hover:opacity-90 disabled:opacity-40 ${
                  !canComplete && !completed ? "opacity-80" : ""
                }`}
                title={!canComplete && !completed ? "Complete the self-check boxes first." : ""}
              >
                {completed ? "Lesson completed" : "Mark lesson complete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

