"use client";

import { motion, useReducedMotion } from "framer-motion";

const frames = [
  "Open palm",
  "Wrist rotate",
  "Finger close",
  "Hold and reset",
];

export function SignPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="card-border bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted">Animated Preview</p>
      <div className="mt-4 grid gap-2">
        {frames.map((frame, index) => (
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
              delay: index * 0.2,
            }}
            className="card-border bg-[var(--surface-2)] px-3 py-2 text-sm"
          >
            {frame}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
