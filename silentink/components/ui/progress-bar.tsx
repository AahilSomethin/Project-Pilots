interface ProgressBarProps {
  value: number;
  accent?: "teal" | "blue" | "coral";
}

const barClasses = {
  teal: "bg-teal",
  blue: "bg-blue",
  coral: "bg-coral",
};

export function ProgressBar({ value, accent = "teal" }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full bg-[var(--surface-2)]">
      <div
        className={`h-full ${barClasses[accent]} transition-[width] duration-300`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
