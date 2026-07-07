"use client";

import { useCallback, useEffect, useRef } from "react";

import type { MorseSymbol } from "@/modules/morse";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AnyWindow = window as unknown as { webkitAudioContext?: typeof AudioContext };
  const Ctx = window.AudioContext ?? AnyWindow.webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}

export function useMorseAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const ensureContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;
    const ctx = getAudioContext();
    if (!ctx) return null;

    audioContextRef.current = ctx;
    const master = ctx.createGain();
    // Keep volume subtle so it doesn't blast speakers.
    master.gain.value = 0.06;
    master.connect(ctx.destination);
    masterGainRef.current = master;
    return ctx;
  }, []);

  const stopCurrentTone = useCallback(() => {
    const osc = oscillatorRef.current;
    if (!osc) return;
    try {
      osc.stop();
    } catch {
      // ignore
    } finally {
      oscillatorRef.current = null;
    }
  }, []);

  const playTone = useCallback(
    (frequencyHz: number, durationMs: number) => {
      const ctx = ensureContext();
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      stopCurrentTone();

      const now = ctx.currentTime;
      const durationSec = durationMs / 1000;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequencyHz, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      // Quick attack to feel snappy.
      gain.gain.exponentialRampToValueAtTime(0.26, now + 0.01);
      // Smooth exponential release to avoid clicks.
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(master);

      osc.start(now);
      osc.stop(now + durationSec + 0.03);
      oscillatorRef.current = osc;
    },
    [ensureContext, stopCurrentTone],
  );

  const unlock = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx) return;
    // Must be called from a user gesture to reliably resume.
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {
        // ignore
      });
    }
  }, [ensureContext]);

  const playDot = useCallback(() => {
    // Dot: 100ms beep
    playTone(880, 100);
  }, [playTone]);

  const playDash = useCallback(() => {
    // Dash: 300ms beep
    playTone(880, 300);
  }, [playTone]);

  const playSymbol = useCallback(
    (symbol: MorseSymbol) => {
      if (symbol === ".") playDot();
      else playDash();
    },
    [playDash, playDot],
  );

  useEffect(() => {
    return () => {
      stopCurrentTone();
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      masterGainRef.current = null;
      if (ctx) {
        ctx.close().catch(() => {
          // ignore
        });
      }
    };
  }, [stopCurrentTone]);

  return { unlock, playDot, playDash, playSymbol };
}

