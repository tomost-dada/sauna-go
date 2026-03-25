"use client";

import { useEffect, useState } from "react";
import { saunas, checkIns, saunaReviews, currentUser } from "@/lib/mock-data";
import { calculateConquestRate } from "@/lib/utils";
import RegionTabs from "@/components/map/RegionTabs";
import ConquestBar from "@/components/map/ConquestBar";
import SaunaCard from "@/components/map/SaunaCard";
import BottomSheet from "@/components/ui/BottomSheet";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import StarRating from "@/components/ui/StarRating";

const REGIONS = [
  { key: "all", label: "전체" },
  { key: "seoul", label: "서울" },
  { key: "gyeonggi", label: "경기" },
  { key: "jeju", label: "제주" },
];

export default function MapPage() {
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

  // Conquest stats
  const conquestStats = (() => {
    if (activeRegion === "all") {
      const visited = saunas.filter((s) => conqueredIds.has(s.id)).length;
      const total = saunas.length;
      const percent = total === 0 ? 0 : Math.round((visited / total) * 100);
      return { visited, total, percent };
    }
    return calculateConquestRate(
      activeRegion as "seoul" | "gyeonggi" | "jeju",
      saunas,
      Array.from(conqueredIds)
    );
  })();

  // Selected sauna for bottom sheet
  const selectedSauna = selectedSaunaId
    ? saunas.find((s) => s.id === selectedSaunaId)
    : null;
  const selectedReviews = selectedSaunaId ? (saunaReviews[selectedSaunaId] ?? []) : [];

  if (loading) {
    return (
      <div className="pb-24">
        {/* Skeleton: tab pills row */}
        <div className="flex gap-3 px-6 py-4">
          <Skeleton className="h-9 rounded-full w-16" />
          <Skeleton className="h-9 rounded-full w-14" />
          <Skeleton className="h-9 rounded-full w-14" />
          <Skeleton className="h-9 rounded-full w-14" />
        </div>
        {/* Skeleton: conquest bar */}
        <div className="px-6 mb-4">
          <SkeletonText className="w-40 mb-3" />
          <Skeleton className="h-2 rounded-full w-full" />
        </div>
        {/* Skeleton: 2-col grid of 4 cards */}
        <div className="grid grid-cols-2 gap-4 px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Page title */}
      <h1 className="text-display-sm text-on-surface p-6 pb-0">정복 맵</h1>

      {/* Region tabs */}
      <div className="px-6 py-4">
        <RegionTabs
          regions={REGIONS}
          activeRegion={activeRegion}
          onChange={setActiveRegion}
        />
      </div>

      {/* Conquest bar */}
      <div className="px-6 mb-4">
        <ConquestBar
          visited={conquestStats.visited}
          total={conquestStats.total}
          percent={conquestStats.percent}
        />
      </div>

      {/* Sauna grid or empty state */}
      {filteredSaunas.length === 0 ? (
        <EmptyState icon="🧖" message="이 지역에 등록된 사우나가 없어요!" />
      ) : (
        <div className="grid grid-cols-2 gap-4 px-6">
          {filteredSaunas.map((sauna) => {
            const conquered = conqueredIds.has(sauna.id);
            return (
              <SaunaCard
                key={sauna.id}
                sauna={sauna}
                isConquered={conquered}
                visitedAt={visitedAtMap[sauna.id]}
                onClick={() => {
                  if (!conquered) {
                    setSelectedSaunaId(sauna.id);
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {/* Bottom sheet for locked sauna reviews */}
      <BottomSheet
        isOpen={selectedSaunaId !== null}
        onClose={() => setSelectedSaunaId(null)}
        title={selectedSauna?.name ?? ""}
      >
        {selectedReviews.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">아직 리뷰가 없어요.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {selectedReviews.map((review, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-title-sm text-on-surface">{review.nickname}</span>
                  <StarRating value={review.ratingOverall} readonly size="sm" />
                </div>
                <p className="text-body-sm text-on-surface-variant">{review.oneLineReview}</p>
              </div>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
