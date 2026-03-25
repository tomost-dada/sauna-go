"use client";

interface ProgressBarProps {
  percent: number;
  variant?: "primary" | "secondary";
}

export default function ProgressBar({ percent, variant = "primary" }: ProgressBarProps) {
  const fillClass =
    variant === "secondary"
      ? "bg-gradient-to-r from-secondary to-secondary-container"
      : "bg-gradient-to-r from-primary-container to-primary-fixed";

  return (
    <div className="h-2 rounded-full bg-surface-container w-full">
      <div
        className={`h-2 rounded-full transition-all duration-500 ease-out ${fillClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
