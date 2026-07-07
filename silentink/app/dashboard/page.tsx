"use client";

import { XpStreakPanel } from "@/components/dashboard/xp-streak-panel";
import { ModeSelectorGrid } from "@/components/ui/mode-selector-grid";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useLocalDashboard } from "@/hooks/use-local-dashboard";
import { useLocalProgress } from "@/hooks/use-local-progress";

export default function DashboardPage() {
  const { dashboardStats: stats, modeSummaries: modes, hydrated } =
    useLocalDashboard();
  const { resetProgress } = useLocalProgress();

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Dashboard</p>
        <h1 className="text-3xl font-semibold md:text-4xl">Your Silent Learning Hub</h1>
      </header>

      <SurfaceCard
        title="XP and Streak Tracking"
        subtitle="Momentum without distractions or sound cues"
      >
        {!hydrated ? (
          <p className="text-sm text-muted">Loading progress...</p>
        ) : (
          <>
            <XpStreakPanel stats={stats} />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const ok = window.confirm(
                    "Reset local progress for all modes?",
                  );
                  if (ok) resetProgress();
                }}
                className="card-border px-3 py-2 text-xs text-muted transition-colors hover:text-foreground"
              >
                Reset local progress
              </button>
            </div>
          </>
        )}
      </SurfaceCard>

      <SurfaceCard title="Modes" subtitle="Continue where you left off">
        {!hydrated ? (
          <p className="text-sm text-muted">Loading modules...</p>
        ) : (
          <ModeSelectorGrid modes={modes} />
        )}
      </SurfaceCard>
    </section>
  );
}
