"use client";

import Badge from "@/components/ui/Badge";
import { Sauna } from "@/lib/types";

interface SaunaCardProps {
  sauna: Sauna;
  isConquered: boolean;
  visitedAt?: string;
  onClick: () => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
  } catch {
    return dateStr;
  }
}

const CATEGORY_LABELS: Record<Sauna["category"], string> = {
  finnish: "핀란드 사우나",
  bulgama: "불가마",
  hotel: "호텔 스파",
  jjimjilbang: "찜질방",
};

export default function SaunaCard({ sauna, isConquered, visitedAt, onClick }: SaunaCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm cursor-pointer active:scale-[0.98] transition-all${isConquered ? " border-l-4 border-primary-container" : ""}`}
      onClick={onClick}
    >
      <p className="text-title-md text-on-surface truncate">{sauna.name}</p>
      <p className="text-label-sm text-on-surface-variant mt-1">
        {CATEGORY_LABELS[sauna.category]}
      </p>
      <div className="mt-3">
        {isConquered ? (
          <Badge variant="conquered">{visitedAt ? formatDate(visitedAt) : ""}</Badge>
        ) : (
          <span className="text-label-sm text-on-surface-variant">🔒 미정복</span>
        )}
      </div>
    </div>
  );
}
