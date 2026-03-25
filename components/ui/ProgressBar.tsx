"use client";

interface ProgressBarProps {
  percent: number;
  variant?: "primary" | "secondary";
}

export default function ProgressBar({ percent, variant = "primary" }: ProgressBarProps) {
  const fillClass =
    variant === "secondary"
      ? "bg-gradient-to-r from-secondary to-secondary-container"
      : "gradient-primary";

  const glowColor =
    variant === "secondary"
      ? "rgba(0, 95, 155, 0.35)"
      : "rgba(254, 125, 94, 0.45)";

  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="h-2 rounded-full bg-surface-container w-full relative overflow-visible">
      <div
        className={`h-2 rounded-full transition-all duration-700 ease-out relative ${fillClass}`}
        style={{ width: `${clampedPercent}%` }}
      >
        {/* Shining dot at fill edge */}
        {clampedPercent > 0 && clampedPercent < 100 && (
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white"
            style={{ boxShadow: `0 0 8px 3px ${glowColor}` }}
          />
        )}
      </div>
    </div>
  );
}
