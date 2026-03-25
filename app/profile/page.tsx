"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { currentUser, checkIns, saunas, collections, COLLECTION_ITEMS_META } from "@/lib/mock-data";
import { getLevelFromXP, getXPProgress, LEVEL_THRESHOLDS } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import SaunaLog from "@/components/profile/SaunaLog";
import CollectionGrid from "@/components/profile/CollectionGrid";

const mockRanking = [
  { rank: 1, nickname: "사우나마스터", level: 10, xp: 3500, title: "Grand Sauna Elder" },
  { rank: 2, nickname: "핀란드매니아", level: 9, xp: 2800, title: "Legendary Bather" },
  { rank: 3, nickname: "열탕러버", level: 7, xp: 1720, title: "Hot Stone Master" },
  { rank: 4, nickname: "제주여행자", level: 5, xp: 950, title: "Sauna Regular" },
  { rank: 5, nickname: "초보사우너", level: 2, xp: 200, title: "Warm Beginner" },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
      <span className="text-label-md text-on-surface-variant font-bold">{rank}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const levelInfo = getLevelFromXP(currentUser.xp);
  const xpProgress = getXPProgress(currentUser.xp);

  // Next level info
  const nextLevelIdx = LEVEL_THRESHOLDS.findIndex((t) => t.level === levelInfo.level + 1);
  const nextLevel = nextLevelIdx !== -1 ? LEVEL_THRESHOLDS[nextLevelIdx] : null;
  const remainingXP = nextLevel ? nextLevel.xp - currentUser.xp : 0;

  const userCheckIns = checkIns
    .filter((c) => c.userId === currentUser.id)
    .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());

  const unlockedCount = collections.filter(
    (c) => c.userId === currentUser.id && c.unlockedAt !== null
  ).length;
  const totalCount = COLLECTION_ITEMS_META.length;
  const userCollections = collections.filter((c) => c.userId === currentUser.id);

  // Pick 2 random unvisited saunas
  const visitedSaunaIds = new Set(userCheckIns.map((c) => c.saunaId));
  const unvisitedSaunas = useMemo(() => {
    const unvisited = saunas.filter((s) => !visitedSaunaIds.has(s.id));
    // Deterministic shuffle using a simple seed
    const shuffled = [...unvisited].sort((a, b) => (a.id > b.id ? 1 : -1));
    return shuffled.slice(0, 2);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const REGION_LABEL: Record<string, string> = {
    seoul: "서울",
    gyeonggi: "경기",
    jeju: "제주",
  };
  const CATEGORY_LABEL: Record<string, string> = {
    finnish: "핀란드식",
    bulgama: "불가마",
    hotel: "호텔 스파",
    jjimjilbang: "찜질방",
  };

  if (loading) {
    return (
      <div className="pb-24">
        {/* Skeleton header */}
        <div className="gradient-hero rounded-b-3xl px-6 pt-6 pb-5 flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonText className="w-32" />
            <Skeleton className="h-2 w-full" />
            <SkeletonText className="w-24" />
          </div>
        </div>
        {/* Skeleton collection */}
        <div className="px-6 mt-6">
          <SkeletonText className="w-32 mb-4" />
          <div className="grid grid-cols-5 gap-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        </div>
        {/* Skeleton next conquest */}
        <div className="px-6 mt-8">
          <SkeletonText className="w-36 mb-4" />
          <Skeleton className="h-24 rounded-2xl mb-3" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        {/* Skeleton ranking */}
        <div className="px-6 mt-8">
          <SkeletonText className="w-20 mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <SkeletonText className="w-24" />
                <SkeletonText className="w-32 mt-1" />
              </div>
              <SkeletonText className="w-16" />
            </div>
          ))}
        </div>
        {/* Skeleton log */}
        <div className="px-6 mt-8">
          <SkeletonText className="w-24 mb-4" />
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
    );
  }

  return (
    <div className="pb-24 animate-fade-in">

      {/* ── 1. Profile Header (compact) ── */}
      <div className="gradient-hero rounded-b-3xl px-6 pt-6 pb-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full gradient-primary shadow-glow-primary flex items-center justify-center text-white text-headline-md font-display flex-shrink-0">
          {currentUser.nickname.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-headline-md text-on-surface truncate">{currentUser.nickname}</p>
            <Badge variant="level">Lv.{levelInfo.level}</Badge>
          </div>
          <div className="mt-2">
            <ProgressBar variant="primary" percent={xpProgress.percent} />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-title-md text-primary font-bold">{remainingXP > 0 ? `${remainingXP} XP 더 필요!` : "MAX LEVEL!"}</span>
            {nextLevel && <span className="text-label-sm text-on-surface-variant">→ {nextLevel.title}</span>}
          </div>
        </div>

      </div>

      {/* ── 2. Collection / Items Section ── */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-display-sm text-on-surface">🎒 컬렉션</p>
          <p className="text-title-md text-on-surface-variant">
            {unlockedCount}/{totalCount}
          </p>
        </div>
        <CollectionGrid collections={userCollections} meta={COLLECTION_ITEMS_META} />
        {unlockedCount < totalCount && (
          <p className="text-body-md text-on-surface-variant text-center mt-3">
            사우나를 더 정복하면 새로운 아이템을 획득할 수 있어요!
          </p>
        )}
      </div>

      {/* ── 3. Next Conquest Recommendation ── */}
      <div className="px-6 mt-8">
        <p className="text-display-sm text-on-surface mb-4">🎯 다음 정복지 추천</p>
        <div className="flex flex-col gap-3">
          {unvisitedSaunas.map((sauna) => (
            <div
              key={sauna.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm"
            >
              <p className="text-title-md text-on-surface">{sauna.name}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-label-sm text-on-surface-variant bg-surface-container rounded-full px-2 py-0.5">
                  {REGION_LABEL[sauna.region] ?? sauna.region}
                </span>
                <span className="text-label-sm text-on-surface-variant bg-surface-container rounded-full px-2 py-0.5">
                  {CATEGORY_LABEL[sauna.category] ?? sauna.category}
                </span>
              </div>
              <button
                onClick={() => router.push("/check-in")}
                className="mt-3 text-label-md text-primary font-semibold"
              >
                정복하러 가기 →
              </button>
            </div>
          ))}
          {unvisitedSaunas.length === 0 && (
            <p className="text-body-md text-on-surface-variant text-center py-4">
              🎉 모든 사우나를 정복했어요!
            </p>
          )}
        </div>
      </div>

      {/* ── 4. Ranking Section ── */}
      <div className="px-6 mt-8">
        <p className="text-display-sm text-on-surface mb-2">🏆 랭킹</p>
        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-sm overflow-hidden">
          {mockRanking.map((user, idx) => {
            const isCurrentUser = user.nickname === currentUser.nickname;
            return (
              <div
                key={user.rank}
                className={`flex items-center gap-3 py-3 px-4 ${
                  idx < mockRanking.length - 1 ? "border-b border-surface-container" : ""
                } ${isCurrentUser ? "bg-primary/5" : ""}`}
              >
                {isCurrentUser ? (
                  <div
                    className="flex items-center gap-3 flex-1 bg-primary-container/10 rounded-2xl px-3 py-1 -mx-3"
                  >
                    <RankBadge rank={user.rank} />
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-label-md font-bold flex-shrink-0">
                      {user.nickname.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-title-md text-primary font-bold truncate">{user.nickname} (나)</p>
                      <p className="text-label-sm text-on-surface-variant truncate">{user.title}</p>
                    </div>
                    <p className="text-label-md text-primary font-semibold flex-shrink-0">
                      {user.xp.toLocaleString()} XP
                    </p>
                  </div>
                ) : (
                  <>
                    <RankBadge rank={user.rank} />
                    <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-label-md font-bold flex-shrink-0">
                      {user.nickname.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-title-md text-on-surface truncate">{user.nickname}</p>
                      <p className="text-label-sm text-on-surface-variant truncate">{user.title}</p>
                    </div>
                    <p className="text-label-md text-on-surface-variant flex-shrink-0">
                      {user.xp.toLocaleString()} XP
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Sauna Log ── */}
      <div className="px-6 mt-8 pb-24">
        <div className="flex justify-between items-center mb-4">
          <p className="text-display-sm text-on-surface">📋 내 기록</p>
          <p className="text-title-md text-on-surface-variant">전체 {userCheckIns.length}개</p>
        </div>
        {userCheckIns.length === 0 ? (
          <EmptyState icon="🧖" message="아직 방문한 사우나가 없어요!" />
        ) : (
          <SaunaLog checkIns={userCheckIns} saunas={saunas} />
        )}
      </div>
    </div>
  );
}
