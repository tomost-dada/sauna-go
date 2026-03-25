"use client";

interface EmptyStateProps {
  icon: string;
  message: string;
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-body-lg text-on-surface-variant text-center">{message}</p>
    </div>
  );
}
