"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SignGesturePlaceholder({ frames }: { frames: string[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-1">
      <div className="card-border bg-[var(--surface-2)] px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-muted">Loop</p>
        <div className="mt-2 grid gap-1">
          {frames.map((frame, idx) => (
            <motion.div
              key={frame}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.45, 1, 0.45],
                      scale: [1, 1.01, 1],
                    }
              }
              transition={{
                duration: 2.4,
                repeat: Number.POSITIVE_INFINITY,
                delay: idx * 0.15,
              }}
              className="text-sm text-muted"
            >
              {frame}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

