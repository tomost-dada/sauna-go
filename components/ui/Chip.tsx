"use client";

import React from "react";

interface ChipProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Chip({ active = false, children, onClick }: ChipProps) {
  return (
    <div
      className={`px-4 py-2 rounded-full text-body-md cursor-pointer select-none transition-all duration-300 active:scale-[0.96] ${
        active
          ? "gradient-primary text-white"
          : "bg-surface-container-low text-on-surface-variant"
      }`}
      style={
        active
          ? { boxShadow: "0 4px 16px rgba(254, 125, 94, 0.30)" }
          : undefined
      }
      onClick={onClick}
    >
      {children}
    </div>
  );
}
