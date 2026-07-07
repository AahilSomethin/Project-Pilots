import { ProgressBar } from "@/components/ui/progress-bar";
import { DashboardStats } from "@/lib/types";

export function XpStreakPanel({ stats }: { stats: DashboardStats }) {
  const weeklyProgress = (stats.currentXp / stats.weeklyXpTarget) * 100;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <article className="card-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">Total XP</p>
        <p className="mt-2 text-3xl font-semibold">{stats.currentXp}</p>
        <div className="mt-3">
          <ProgressBar value={weeklyProgress} accent="teal" />
        </div>
      </article>

      <article className="card-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">Current streak</p>
        <p className="mt-2 text-3xl font-semibold text-blue">{stats.streakDays} days</p>
      </article>

      <article className="card-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">Today focus</p>
        <p className="mt-2 text-3xl font-semibold text-coral">{stats.todayMinutes} min</p>
      </article>
    </div>
  );
}
