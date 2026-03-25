"use client";

import { CheckIn, Sauna } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";

interface SaunaLogProps {
  checkIns: CheckIn[];
  saunas: Sauna[];
}

const DELAYS = ["delay-100", "delay-200", "delay-300", "delay-400"];

export default function SaunaLog({ checkIns, saunas }: SaunaLogProps) {
  return (
    <div className="flex flex-col gap-0">
      {checkIns.map((checkIn, index) => {
        const sauna = saunas.find((s) => s.id === checkIn.saunaId);
        const isLast = index === checkIns.length - 1;

        const date = new Date(checkIn.visitedAt);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const delayClass = DELAYS[index % DELAYS.length];

        return (
          <div key={checkIn.id} className={`flex gap-4 animate-fade-in-up ${delayClass}`}>
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary-container shadow-glow-primary flex-shrink-0 mt-1.5" />
              {!isLast && <div className="w-0.5 flex-1 bg-surface-container" />}
            </div>

            {/* Card */}
            <div className="flex-1 bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm mb-4">
              <p className="text-label-sm text-on-surface-variant">{formattedDate}</p>
              <p className="text-title-md text-on-surface mt-1">
                {sauna?.name ?? "알 수 없는 사우나"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating readonly size="sm" value={checkIn.ratingOverall} />
                <span className="text-label-sm text-on-surface-variant">{checkIn.ratingOverall}</span>
              </div>
              {checkIn.oneLineReview && (
                <p className="text-body-md text-on-surface-variant mt-1 truncate">
                  {checkIn.oneLineReview}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
