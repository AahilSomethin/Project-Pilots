"use client";

import Link from "next/link";

import { LandingModes } from "@/components/landing/landing-modes";

export default function LandingPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-10 px-4 py-10 md:px-6 md:py-14">
      <header className="grid gap-8 border border-border bg-surface p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Silent-first Learning</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Communicate Without Sound
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
            Silentink helps learners master non-verbal communication with focused
            lessons in sign language, Morse code tapping, and Braille text fluency.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="silent-glow card-border bg-surface px-4 py-2 text-sm"
            >
              Open Dashboard
            </Link>
            <Link
              href="/sign-language"
              className="card-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              Start Sign Module
            </Link>
          </div>
        </div>

        <div className="grid gap-3 self-end">
          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">XP system</p>
            <p className="mt-2 text-xl font-semibold text-teal">Progressive levels</p>
          </div>
          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Streaks</p>
            <p className="mt-2 text-xl font-semibold text-blue">Daily consistency</p>
          </div>
          <div className="card-border bg-[var(--surface-2)] p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Feedback</p>
            <p className="mt-2 text-xl font-semibold text-coral">Visual only, no sound</p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Choose Your Mode</h2>
        <LandingModes />
      </section>
    </section>
  );
}
