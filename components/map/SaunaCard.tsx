"use client";

import Badge from "@/components/ui/Badge";
import { Sauna } from "@/lib/types";

interface SaunaCardProps {
  sauna: Sauna;
  isConquered: boolean;
  visitedAt?: string;
  onClick: () => void;
}

function LockIcon() {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
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
      className="rounded-2xl overflow-hidden bg-surface-container-lowest shadow-ambient-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
      onClick={onClick}
    >
      {/* Image area — 4:3 ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={sauna.imageUrl}
          alt={sauna.name}
          className={`w-full h-full object-cover transition-all duration-300${!isConquered ? " grayscale" : ""}`}
        />
        {isConquered ? (
          /* Conquered: badge overlaid at bottom-right of image */
          <div className="absolute bottom-2 right-2">
            <Badge variant="conquered">{visitedAt ? formatDate(visitedAt) : ""}</Badge>
          </div>
        ) : (
          /* Locked: dark overlay + centered lock icon */
          <div className="absolute inset-0 bg-on-surface/50 flex items-center justify-center">
            <LockIcon />
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-4">
        <p className="text-title-md text-on-surface truncate">{sauna.name}</p>
        <p className="text-label-sm text-on-surface-variant mt-0.5">
          {CATEGORY_LABELS[sauna.category]}
        </p>
        <p className="text-label-sm text-on-surface-variant mt-2">
          🏔️ {sauna.totalConqueredCount}명 정복
        </p>
      </div>
    </div>
  );
}
