"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { saunas, checkIns, saunaReviews, currentUser } from "@/lib/mock-data";
import RegionTabs from "@/components/map/RegionTabs";
import SaunaCard from "@/components/map/SaunaCard";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import StarRating from "@/components/ui/StarRating";

const REGIONS = [
  { key: "all", label: "전체" },
  { key: "seoul", label: "서울" },
  { key: "gyeonggi", label: "경기" },
  { key: "jeju", label: "제주" },
];

const DELAY_CLASSES = ["", "delay-100", "delay-200", "delay-300", "delay-400"];

export default function MapPage() {
  const router = useRouter();
  const [activeRegion, setActiveRegion] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedSaunaId, setSelectedSaunaId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Determine conquered saunas for currentUser
  const conqueredIds = new Set(
    checkIns
      .filter((c) => c.userId === currentUser.id)
      .map((c) => c.saunaId)
  );

  // Get the most recent visitedAt for each saunaId
  const visitedAtMap: Record<string, string> = {};
  checkIns
    .filter((c) => c.userId === currentUser.id)
    .forEach((c) => {
      if (!visitedAtMap[c.saunaId] || c.visitedAt > visitedAtMap[c.saunaId]) {
        visitedAtMap[c.saunaId] = c.visitedAt;
      }
    });

  // Filter saunas by region
  const filteredSaunas =
    activeRegion === "all"
      ? saunas
      : saunas.filter((s) => s.region === activeRegion);

  // Selected sauna for bottom sheet
  const selectedSauna = selectedSaunaId
    ? saunas.find((s) => s.id === selectedSaunaId)
    : null;
  const selectedReviews = selectedSaunaId ? (saunaReviews[selectedSaunaId] ?? []) : [];

  if (loading) {
    return (
      <div className="pb-24">
        {/* Title skeleton */}
        <div className="p-6 pb-2">
          <SkeletonText className="w-36 h-8" />
        </div>
        {/* Skeleton: tab pills row */}
        <div className="flex gap-3 px-6 py-1 mb-4">
          <Skeleton className="h-9 rounded-full w-16" />
          <Skeleton className="h-9 rounded-full w-14" />
          <Skeleton className="h-9 rounded-full w-14" />
          <Skeleton className="h-9 rounded-full w-14" />
        </div>
        {/* Skeleton: 2-col grid of 4 cards */}
        <div className="grid grid-cols-2 gap-4 px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <h1 className="text-display-sm text-on-surface">🗺️ 퀘스트 맵</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-full bg-surface-container-lowest shadow-ambient-sm text-label-md text-on-surface-variant active:scale-[0.97] transition-all"
        >
          ← 홈
        </button>
      </div>

      {/* Region tabs */}
      <div className="px-6">
        <RegionTabs
          regions={REGIONS}
          activeRegion={activeRegion}
          onChange={setActiveRegion}
        />
      </div>

      {/* Sauna grid or empty state */}
      <div className="mt-4">
        {filteredSaunas.length === 0 ? (
          <EmptyState icon="🧖" message="이 지역에 등록된 사우나가 없어요!" />
        ) : (
          <div className="grid grid-cols-2 gap-4 px-6">
            {filteredSaunas.map((sauna, index) => {
              const conquered = conqueredIds.has(sauna.id);
              const delayClass = DELAY_CLASSES[Math.min(index, DELAY_CLASSES.length - 1)];
              return (
                <div
                  key={sauna.id}
                  className={`animate-fade-in-up ${delayClass}`}
                >
                  <SaunaCard
                    sauna={sauna}
                    isConquered={conquered}
                    visitedAt={visitedAtMap[sauna.id]}
                    onClick={() => setSelectedSaunaId(sauna.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Popup (portal to escape 390px body) */}
      {selectedSaunaId !== null && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-on-surface/40 animate-fade-in"
            onClick={() => setSelectedSaunaId(null)}
          />
          {/* Popup */}
          <div className="relative bg-surface-container-lowest rounded-3xl w-full max-w-[340px] shadow-ambient-lg animate-fade-in-up max-h-[70vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-3 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-headline-md text-on-surface truncate">{selectedSauna?.name}</p>
                <p className="text-label-sm text-on-surface-variant mt-1">
                  🏔️ {selectedSauna?.totalConqueredCount}명 정복
                </p>
              </div>
              <button
                onClick={() => setSelectedSaunaId(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-lg shrink-0 ml-3"
              >
                ✕
              </button>
            </div>
            {/* Reviews */}
            <div className="px-5 pb-5 overflow-y-auto flex-1">
              {selectedReviews.length === 0 ? (
                <div className="py-8 text-center">
                  <span className="text-3xl">🧖</span>
                  <p className="text-body-md text-on-surface-variant mt-2">아직 리뷰가 없어요</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {selectedReviews.map((review, i) => (
                    <div key={i} className="bg-surface-container-low rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-label-sm text-on-surface-variant font-semibold flex-shrink-0">
                          {review.nickname.charAt(0)}
                        </div>
                        <span className="text-title-md text-on-surface">{review.nickname}</span>
                        <StarRating value={review.ratingOverall} readonly size="sm" />
                      </div>
                      <p className="text-body-md text-on-surface mt-2">&ldquo;{review.oneLineReview}&rdquo;</p>
                      <p className="text-label-sm text-on-surface-variant mt-2">{review.visitedAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
