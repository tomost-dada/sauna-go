"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { currentUser, checkIns, saunas, saunaReviews } from "@/lib/mock-data";
import { getXPProgress, getLevelFromXP } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

// Recent sauna logs (sorted by visitedAt desc, max 3)
const recentLogs = checkIns
  .filter((c) => c.userId === currentUser.id)
  .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
  .slice(0, 3)
  .map((c) => {
    const sauna = saunas.find((s) => s.id === c.saunaId);
    return { ...c, saunaName: sauna?.name ?? "알 수 없음" };
  });

export default function Home() {
  const router = useRouter();
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
        <div className="px-6 mt-4">
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <div className="px-6 mt-4 grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="px-6 mt-6 flex flex-col gap-3">
          <Skeleton className="h-20 delay-100" />
          <Skeleton className="h-20 delay-200" />
          <Skeleton className="h-20 delay-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Profile */}
      <div className="p-6 pb-4">
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
        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-body-md text-on-surface-variant">Lv.</span>
            <span className="text-display-sm text-primary">{levelInfo.level}</span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={xpProgress.percent} variant="primary" />
            <p className="text-label-sm text-on-surface-variant mt-1.5">
              {xpProgress.current} / {xpProgress.total} XP
            </p>
          </div>
        </div>
      </div>

      {/* Check-in Banner */}
      <div className="px-6 mt-2">
        <div
          className="gradient-primary rounded-2xl p-5 cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
          style={{ boxShadow: "0 12px 32px rgba(254, 125, 94, 0.35)" }}
          onClick={() => router.push("/check-in")}
        >
          <div className="relative z-10">
            <p className="text-label-md text-white/70 tracking-wider">TODAY</p>
            <p className="text-headline-md text-white mt-1">오늘의 체크인 하기</p>
            <p className="text-body-md text-white/70 mt-1">사우나 방문을 기록하고 XP를 받으세요!</p>
          </div>
          {/* Decorative circle */}
          <div
            className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10"
          />
          <div
            className="absolute right-8 bottom-3 text-4xl"
          >
            🔥
          </div>
        </div>
      </div>

      {/* Quick Nav Cards - 2 columns */}
      <div className="px-6 mt-5 grid grid-cols-2 gap-4">
        {/* 어디갈까? → Map */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient-sm cursor-pointer active:scale-[0.97] transition-all"
          onClick={() => router.push("/map")}
        >
          <span className="text-3xl">🗺️</span>
          <p className="text-headline-md text-on-surface mt-3">어디갈까?</p>
          <p className="text-body-md text-on-surface-variant mt-1">사우나 탐험하기</p>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-label-md text-primary">정복 맵 보기</span>
            <span className="text-primary">→</span>
          </div>
        </div>

        {/* 같이갈까? → Community */}
        <div
          className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient-sm cursor-pointer active:scale-[0.97] transition-all"
          onClick={() => router.push("/community")}
        >
          <span className="text-3xl">👋</span>
          <p className="text-headline-md text-on-surface mt-3">같이갈까?</p>
          <p className="text-body-md text-on-surface-variant mt-1">동료 찾기</p>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-label-md text-primary">모임 보기</span>
            <span className="text-primary">→</span>
          </div>
        </div>
      </div>

      {/* Sauna Log - Recent 3 */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-display-sm text-on-surface">사우나 로그</h2>
          <button
            onClick={() => router.push("/profile")}
            className="text-label-md text-primary"
          >
            전체 보기
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {recentLogs.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient-sm text-center">
              <span className="text-3xl">🧖</span>
              <p className="text-body-md text-on-surface-variant mt-2">아직 방문 기록이 없어요</p>
            </div>
          ) : (
            recentLogs.map((log, i) => (
              <div
                key={log.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-lg flex-shrink-0">
                    🧖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-title-md text-on-surface truncate">{log.saunaName}</p>
                      <StarRating value={log.ratingOverall} readonly size="sm" />
                    </div>
                    {log.oneLineReview && (
                      <p className="text-body-md text-on-surface-variant mt-1 truncate">
                        &ldquo;{log.oneLineReview}&rdquo;
                      </p>
                    )}
                    <p className="text-label-sm text-on-surface-variant mt-1.5">
                      {new Date(log.visitedAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
