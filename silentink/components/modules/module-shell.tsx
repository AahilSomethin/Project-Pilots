"use client";

import { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";

export function ModuleShell({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: "teal" | "blue" | "coral";
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Module</p>
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        <p className="max-w-xl text-sm text-muted">{subtitle}</p>
      </header>

      <SurfaceCard accent={accent}>{children}</SurfaceCard>
    </section>
  );
}

