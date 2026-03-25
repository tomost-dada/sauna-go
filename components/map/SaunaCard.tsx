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
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
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
      className="rounded-2xl overflow-hidden bg-surface-container-lowest cursor-pointer transition-all duration-200 active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={sauna.imageUrl}
          alt={sauna.name}
          className={`w-full h-full object-cover${!isConquered ? " grayscale" : ""}`}
        />
        {!isConquered && (
          <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center">
            <LockIcon />
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-3">
        <p className="text-title-md text-on-surface truncate">{sauna.name}</p>
        {isConquered ? (
          <Badge variant="conquered">{visitedAt ?? ""}</Badge>
        ) : (
          <Badge variant="locked">Locked</Badge>
        )}
        <p className="text-label-sm text-on-surface-variant mt-1">
          {CATEGORY_LABELS[sauna.category]}
        </p>
      </div>
    </div>
  );
}
