"use client";

interface MeetupStatusProps {
  status: "recruiting" | "confirmed" | "completed";
}

const statusConfig = {
  recruiting: {
    label: "모집중",
    className: "bg-primary-container/15 text-primary",
  },
  confirmed: {
    label: "확정",
    className: "bg-secondary/15 text-secondary",
  },
  completed: {
    label: "완료",
    className: "bg-surface-container-high text-on-surface-variant",
  },
};

export default function MeetupStatus({ status }: MeetupStatusProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-label-md inline-flex items-center gap-1 ${config.className}`}
    >
      <span>●</span>
      {config.label}
    </span>
  );
}
