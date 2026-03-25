"use client";

import { useEffect, useState } from "react";
import { currentUser, checkIns, saunas, collections, COLLECTION_ITEMS_META } from "@/lib/mock-data";
import { getLevelFromXP, getXPProgress } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import SaunaLog from "@/components/profile/SaunaLog";
import CollectionGrid from "@/components/profile/CollectionGrid";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const levelInfo = getLevelFromXP(currentUser.xp);
  const xpProgress = getXPProgress(currentUser.xp);

  const userCheckIns = checkIns
    .filter((c) => c.userId === currentUser.id)
    .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());

  const unlockedCount = collections.filter(
    (c) => c.userId === currentUser.id && c.unlockedAt !== null
  ).length;
  const totalCount = COLLECTION_ITEMS_META.length;

  const userCollections = collections.filter((c) => c.userId === currentUser.id);

  if (loading) {
    return (
      <div className="pb-24">
        {/* Skeleton gradient header */}
        <div className="gradient-hero rounded-b-3xl p-6 pt-8 pb-8 flex flex-col items-center animate-shimmer">
          <Skeleton className="w-20 h-20 rounded-full" />
          <SkeletonText className="w-32 mt-4" />
          <SkeletonText className="w-24 mt-2" />
          <SkeletonText className="w-full mt-3" />
          <SkeletonText className="w-20 mt-1" />
        </div>

        {/* Skeleton stats row */}
        <div className="px-6 mt-6 flex gap-4">
          <Skeleton className="flex-1 h-20 rounded-2xl" />
          <Skeleton className="flex-1 h-20 rounded-2xl" />
        </div>

        {/* Skeleton timeline rows */}
        <div className="px-6 mt-8">
          <SkeletonText className="w-24 mb-4" />
          <div className="flex flex-col gap-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5" />
                  {i < 3 && <div className="w-0.5 flex-1 bg-surface-container min-h-[60px]" />}
                </div>
                <Skeleton className="flex-1 h-24 mb-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Profile Header */}
      <div className="gradient-hero rounded-b-3xl p-6 pt-8 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full gradient-primary shadow-glow-primary flex items-center justify-center text-white text-display-sm font-display">
          {currentUser.nickname.charAt(0)}
        </div>
        <p className="text-headline-md text-on-surface mt-4">{currentUser.nickname}</p>
        <div className="mt-2">
          <Badge variant="level">{currentUser.title}</Badge>
        </div>
        <p className="text-display-lg text-primary mt-3">Lv. {levelInfo.level}</p>
        <div className="w-full mt-3">
          <ProgressBar variant="primary" percent={xpProgress.percent} />
        </div>
        <p className="text-label-sm text-on-surface-variant mt-1 text-center">
          {xpProgress.current} / {xpProgress.total} XP
        </p>
      </div>

      {/* Stats Row */}
      <div className="px-6 mt-6 flex gap-4">
        <div className="flex-1 bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm">
          <p className="text-label-md text-on-surface-variant">🏔️ 정복</p>
          <p className="text-display-sm text-primary mt-1">{userCheckIns.length}</p>
        </div>
        <div className="flex-1 bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm">
          <p className="text-label-md text-on-surface-variant">🎒 컬렉션</p>
          <p className="text-display-sm text-tertiary mt-1">{unlockedCount}</p>
        </div>
      </div>

      {/* Recent Sauna Log */}
      <div className="px-6 mt-8">
        <p className="text-display-sm text-on-surface mb-4">최근 방문</p>
        {userCheckIns.length === 0 ? (
          <EmptyState icon="🧖" message="아직 방문한 사우나가 없어요!" />
        ) : (
          <SaunaLog checkIns={userCheckIns} saunas={saunas} />
        )}
      </div>

      {/* Collection */}
      <div className="px-6 mt-8 pb-24">
        <div className="flex justify-between items-center mb-4">
          <p className="text-display-sm text-on-surface">컬렉션</p>
          <p className="text-title-md text-on-surface-variant">
            {unlockedCount}/{totalCount}
          </p>
        </div>
        <CollectionGrid collections={userCollections} meta={COLLECTION_ITEMS_META} />
      </div>
    </div>
  );
}
