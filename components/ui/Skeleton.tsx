"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-shimmer rounded-2xl ${className ?? ""}`} />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div className={`animate-shimmer rounded-full h-4 ${className ?? ""}`} />
  );
}

export default Skeleton;
