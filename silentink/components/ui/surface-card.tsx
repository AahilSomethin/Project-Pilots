import { ReactNode } from "react";

interface SurfaceCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  accent?: "teal" | "blue" | "coral";
  className?: string;
}

const accentClasses = {
  teal: "border-teal/40",
  blue: "border-blue/40",
  coral: "border-coral/40",
};

export function SurfaceCard({
  title,
  subtitle,
  children,
  accent,
  className = "",
}: SurfaceCardProps) {
  return (
    <section
      className={`card-border bg-surface p-5 md:p-6 ${
        accent ? accentClasses[accent] : ""
      } ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-4 space-y-1">
          {title && <h3 className="text-sm font-semibold tracking-wide">{title}</h3>}
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
