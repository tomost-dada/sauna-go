"use client";

import React from "react";

interface BadgeProps {
  variant: "conquered" | "locked" | "host" | "level";
  children: React.ReactNode;
}

const variantClasses: Record<BadgeProps["variant"], string> = {
  conquered: "bg-primary-container text-white",
  locked: "bg-surface-container-high text-on-surface-variant",
  host: "bg-primary text-white",
  level: "bg-secondary-container text-secondary",
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-label-md ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
