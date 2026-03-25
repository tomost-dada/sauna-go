"use client";

import React from "react";

interface BadgeProps {
  variant: "conquered" | "locked" | "host" | "level";
  children: React.ReactNode;
}

const variantClasses: Record<BadgeProps["variant"], string> = {
  conquered:
    "gradient-primary text-white",
  locked:
    "bg-surface-container-high text-on-surface-variant",
  host:
    "gradient-primary-bold text-white",
  level:
    "bg-secondary-container text-on-secondary-fixed",
};

const variantShadows: Record<BadgeProps["variant"], string> = {
  conquered: "0 4px 16px rgba(254, 125, 94, 0.30)",
  locked: "none",
  host: "0 4px 16px rgba(161, 57, 32, 0.30)",
  level: "0 2px 8px rgba(0, 95, 155, 0.15)",
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm ${variantClasses[variant]}`}
      style={{ boxShadow: variantShadows[variant] }}
    >
      {children}
    </span>
  );
}
