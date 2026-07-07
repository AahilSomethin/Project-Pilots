"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCallback, type PointerEvent } from "react";

import type { MorseSymbol } from "@/modules/morse";
import { useMorsePressInput } from "@/components/modules/morse/use-morse-press-input";
import { useMorseAudio } from "@/components/modules/morse/use-morse-audio";

export function MorseTapPad({
  onSymbol,
  disabled,
}: {
  onSymbol: (symbol: MorseSymbol) => void;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const { unlock, playDot, playDash } = useMorseAudio();

  const pulse = useCallback(() => {
    if (reduceMotion) return;
    controls.start({
      scale: [1, 0.97, 1],
      boxShadow: [
        "0 0 0px rgba(0,0,0,0)",
        "0 0 18px rgba(59,130,246,0.45)",
        "0 0 0px rgba(0,0,0,0)",
      ],
      transition: { duration: 0.18 },
    });
  }, [controls, reduceMotion]);

  const onSymbolWithFeedback = useCallback(
    (symbol: MorseSymbol) => {
      pulse();
      if (symbol === ".") playDot();
      else playDash();
      onSymbol(symbol);
    },
    [onSymbol, playDash, playDot, pulse],
  );

  const { isPressed, onPointerDown, onPointerUp, onPointerCancel, onPointerLeave } =
    useMorsePressInput({
      disabled,
      onSymbol: onSymbolWithFeedback,
    });

  const onPointerDownWithUnlock = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (!disabled) unlock();
      onPointerDown(e);
    },
    [disabled, onPointerDown, unlock],
  );

  return (
    <div className="card-border space-y-4 bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted">Tap / Press Pad</p>
      <motion.button
        type="button"
        aria-label="Tap short for dot and press long for dash"
        disabled={disabled}
        onPointerDown={onPointerDownWithUnlock}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        whileTap={reduceMotion ? {} : { scale: 0.98 }}
        className="card-border flex w-full items-center justify-center bg-(--surface-2) px-4 py-7 text-sm text-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span
          className={`font-mono tracking-[0.18em] transition-opacity ${
            isPressed ? "opacity-100" : "opacity-90"
          }`}
        >
          {isPressed ? "..." : "Hold to mark '-' / Tap to mark '.'"}
        </span>
      </motion.button>
    </div>
  );
}
