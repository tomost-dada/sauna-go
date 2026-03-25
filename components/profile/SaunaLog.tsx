"use client";

import { CheckIn, Sauna } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";

interface SaunaLogProps {
  checkIns: CheckIn[];
  saunas: Sauna[];
}

export default function SaunaLog({ checkIns, saunas }: SaunaLogProps) {
  return (
    <div className="flex flex-col gap-4">
      {checkIns.map((checkIn, index) => {
        const sauna = saunas.find((s) => s.id === checkIn.saunaId);
        const isLast = index === checkIns.length - 1;

        const date = new Date(checkIn.visitedAt);
        const formattedDate = date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <div key={checkIn.id} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary-container flex-shrink-0 mt-1.5" />
              {!isLast && <div className="w-0.5 flex-1 bg-surface-container-high" />}
            </div>

            {/* Card */}
            <div className="flex-1 bg-surface-container-lowest rounded-2xl p-4">
              <p className="text-label-sm text-on-surface-variant">{formattedDate}</p>
              <p className="text-title-md text-on-surface mt-1">
                {sauna?.name ?? "알 수 없는 사우나"}
              </p>
              <StarRating readonly size="sm" value={checkIn.ratingOverall} />
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
