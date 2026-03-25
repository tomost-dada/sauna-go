"use client";

interface EmptyStateProps {
  icon: string;
  message: string;
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div
        className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center text-4xl mb-6 animate-float"
        style={{ boxShadow: "0 8px 24px rgba(44, 47, 48, 0.06)" }}
      >
        {icon}
      </div>
      <p className="text-headline-md text-on-surface-variant text-center px-8">{message}</p>
    </div>
  );
}
