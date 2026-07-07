"use client";

import type { PointerEvent } from "react";
import { useCallback, useRef, useState } from "react";

import type { MorseSymbol } from "@/modules/morse";
import { pressDurationToSymbol } from "@/modules/morse/morse-utils";

export function useMorsePressInput({
  disabled,
  onSymbol,
  cooldownMs = 60,
}: {
  disabled?: boolean;
  onSymbol: (symbol: MorseSymbol) => void;
  cooldownMs?: number;
}) {
  const isDisabled = !!disabled;
  const [isPressed, setIsPressed] = useState(false);

  const pressStartMsRef = useRef<number | null>(null);
  const lastEmitAtMsRef = useRef<number>(0);

  // If the browser emits multiple pointer events for a single gesture,
  // we only emit once per press lifecycle.
  const didEmitForPressRef = useRef<boolean>(false);

  const clearPressState = useCallback(() => {
    pressStartMsRef.current = null;
    setIsPressed(false);
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      pressStartMsRef.current = performance.now();
      didEmitForPressRef.current = false;
      setIsPressed(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [isDisabled],
  );

  const onPointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      const start = pressStartMsRef.current;
      if (start == null) return;

      const now = performance.now();
      const durationMs = now - start;

      // End this press immediately so duplicate pointerup events for the same
      // gesture cannot re-emit.
      clearPressState();

      try {
        const withinCooldown = now - lastEmitAtMsRef.current < cooldownMs;
        if (!withinCooldown && !didEmitForPressRef.current) {
          const symbol = pressDurationToSymbol(durationMs);
          onSymbol(symbol);
          didEmitForPressRef.current = true;
          lastEmitAtMsRef.current = now;
        }
      } catch {
        // Should never throw, but ignore to keep input reliable.
      } finally {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Pointer capture may already be gone; ignore.
        }
      }
    },
    [clearPressState, cooldownMs, isDisabled, onSymbol],
  );

  const onPointerCancel = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    didEmitForPressRef.current = true;
    clearPressState();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  },
    [clearPressState, isDisabled],
  );

  const onPointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
    // If the pointer leaves the pad while pressed, cancel to avoid ghost inputs.
      onPointerCancel(e);
    },
    [onPointerCancel],
  );

  return {
    isPressed,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
  };
}

