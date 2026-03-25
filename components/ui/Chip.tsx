"use client";

import React from "react";

interface ChipProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Chip({ active = false, children, onClick }: ChipProps) {
  const colorClass = active
    ? "bg-primary-container text-white"
    : "bg-surface-container-low text-on-surface-variant";

  return (
    <div
      className={`px-4 py-2 rounded-full text-body-md transition-all duration-200 cursor-pointer active:scale-[0.98] transition-transform ${colorClass}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
