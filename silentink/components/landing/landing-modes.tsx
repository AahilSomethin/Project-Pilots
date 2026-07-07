"use client";

import { ModeSelectorGrid } from "@/components/ui/mode-selector-grid";
import { useModeSummaries } from "@/hooks/use-learning-data";

export function LandingModes() {
  const { data, isLoading } = useModeSummaries();

  if (isLoading || !data) {
    return <p className="text-sm text-muted">Loading learning modes...</p>;
  }

  return <ModeSelectorGrid modes={data} />;
}
