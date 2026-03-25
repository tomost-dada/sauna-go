"use client";

import { useState, useEffect } from "react";
import { currentUser, quests, communityPosts } from "@/lib/mock-data";
import { getXPProgress, getLevelFromXP } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import QuestCard from "@/components/home/QuestCard";
import HotspotPreview from "@/components/home/HotspotPreview";

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
        {/* Profile skeleton */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonText className="w-32" />
              <SkeletonText className="w-20" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        {/* Quest skeletons */}
        <div className="px-6 mt-2 flex flex-col gap-10">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Section 1: Profile */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-display font-bold">
            {currentUser.nickname.charAt(0)}
          </div>
          <div>
            <p className="text-headline-md text-on-surface">{currentUser.nickname}</p>
            <Badge variant="level">{currentUser.title}</Badge>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-display-lg text-primary">
            <span className="text-body-lg text-on-surface-variant">Lv.</span>
            {levelInfo.level}
          </p>
          <div className="mt-2">
            <ProgressBar percent={xpProgress.percent} variant="primary" />
            <p className="text-label-sm text-on-surface-variant mt-1">
              {xpProgress.current} / {xpProgress.total} XP
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Today's Quest */}
      <div className="px-6 mt-2">
        <h2 className="text-display-sm text-on-surface mb-8">오늘의 퀘스트</h2>
        <div className="flex flex-col gap-10">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      {/* Section 3: Hotspots */}
      <div className="mt-8 bg-surface-container-low py-8 px-6">
        <h2 className="text-headline-md text-on-surface mb-4">Hotspots 🔥</h2>
        <HotspotPreview posts={communityPosts} />
      </div>
    </div>
  );
}
