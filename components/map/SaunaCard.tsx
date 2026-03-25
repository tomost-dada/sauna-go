"use client";

import { Sauna } from "@/lib/types";

interface SaunaCardProps {
  sauna: Sauna;
  isConquered: boolean;
  visitedAt?: string;
  onClick: () => void;
}

const CATEGORY_LABELS: Record<Sauna["category"], string> = {
  finnish: "핀란드 사우나",
  bulgama: "불가마",
  hotel: "호텔 스파",
  jjimjilbang: "찜질방",
};

export default function SaunaCard({ sauna, isConquered, onClick }: SaunaCardProps) {
  if (isConquered) {
    return (
      <div
        className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm cursor-pointer active:scale-[0.98] transition-all border-l-4 border-primary-container"
        onClick={onClick}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-sm">✅</span>
          <span className="text-label-sm text-primary font-semibold">정복 완료</span>
        </div>
        <p className="text-title-md text-on-surface truncate">{sauna.name}</p>
        <p className="text-label-sm text-on-surface-variant mt-1">
          {CATEGORY_LABELS[sauna.category]}
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-surface-container rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all opacity-50"
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm">🔒</span>
        <span className="text-label-sm text-on-surface-variant">미정복</span>
      </div>
      <p className="text-title-md text-on-surface-variant truncate">{sauna.name}</p>
      <p className="text-label-sm text-on-surface-variant mt-1">
        {CATEGORY_LABELS[sauna.category]}
      </p>
    </div>
  );
}
