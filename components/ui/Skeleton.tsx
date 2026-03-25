"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-container rounded-2xl ${className ?? ""}`} />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-container-high rounded-full h-4 ${className ?? ""}`} />
  );
}

export default Skeleton;
