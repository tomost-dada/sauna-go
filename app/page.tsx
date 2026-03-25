"use client";

import { useState, useEffect } from "react";
import { currentUser, checkIns, saunas, communityPosts, saunaReviews } from "@/lib/mock-data";
import { getXPProgress, getLevelFromXP } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import HotspotPreview from "@/components/home/HotspotPreview";

// Collect all reviews from all saunas into a flat list with sauna info
const allReviews = Object.entries(saunaReviews).flatMap(([saunaId, reviews]) => {
  const sauna = saunas.find((s) => s.id === saunaId);
  return reviews.map((r) => ({
    ...r,
    saunaId,
    saunaName: sauna?.name ?? "알 수 없음",
  }));
}).sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const levelInfo = getLevelFromXP(currentUser.xp);
  const xpProgress = getXPProgress(currentUser.xp);

  if (loading) {
    return (
      <div className="pb-24">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonText className="w-32" />
              <SkeletonText className="w-20" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="px-6 mt-6 flex flex-col gap-4">
          <Skeleton className="h-24 delay-100" />
          <Skeleton className="h-24 delay-200" />
          <Skeleton className="h-24 delay-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Section 1: Profile */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0"
            style={{ boxShadow: "0 8px 32px rgba(254, 125, 94, 0.30)" }}
          >
            {currentUser.nickname.charAt(0)}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-headline-md text-on-surface">{currentUser.nickname}</p>
            <Badge variant="level">{currentUser.title}</Badge>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-display-lg text-primary">
            <span className="text-body-lg text-on-surface-variant">Lv.</span>
            {levelInfo.level}
          </p>
          <div className="mt-2">
            <ProgressBar percent={xpProgress.percent} variant="primary" />
            <p className="text-label-sm text-on-surface-variant mt-1.5">
              {xpProgress.current} / {xpProgress.total} XP
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Recent Reviews */}
      <div className="px-6 mt-2">
        <h2 className="text-display-sm text-on-surface mb-5">최근 한줄평 💬</h2>
        <div className="flex flex-col gap-3">
          {allReviews.slice(0, 8).map((review, i) => (
            <div
              key={`${review.saunaId}-${i}`}
              className={`bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm animate-fade-in-up`}
              style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-label-sm text-on-surface-variant font-semibold flex-shrink-0">
                      {review.nickname.charAt(0)}
                    </div>
                    <span className="text-title-md text-on-surface truncate">{review.nickname}</span>
                    <StarRating value={review.ratingOverall} readonly size="sm" />
                  </div>
                  <p className="text-body-lg text-on-surface mt-2 leading-relaxed">
                    &ldquo;{review.oneLineReview}&rdquo;
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-2">
                    📍 {review.saunaName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Hotspots */}
      <div className="mt-8 bg-surface-container-low rounded-t-3xl py-8 px-6">
        <h2 className="text-headline-md text-on-surface mb-4">Hotspots 🔥</h2>
        <HotspotPreview posts={communityPosts} />
      </div>
    </div>
  );
}
