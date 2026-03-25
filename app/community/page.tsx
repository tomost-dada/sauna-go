"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { communityPosts } from "@/lib/mock-data";
import Chip from "@/components/ui/Chip";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import PostCard from "@/components/community/PostCard";

const regions = [
  { key: null, label: "전체" },
  { key: "seoul", label: "서울" },
  { key: "gyeonggi", label: "경기" },
  { key: "jeju", label: "제주" },
] as const;

const categories = [
  { key: null, label: "전체" },
  { key: "finnish", label: "핀란드식" },
  { key: "bulgama", label: "불가마" },
  { key: "hotel", label: "호텔" },
  { key: "jjimjilbang", label: "찜질방" },
] as const;

const DELAY_CLASSES = ["", "delay-100", "delay-200", "delay-300", "delay-400"];

export default function CommunityPage() {
  const router = useRouter();
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = communityPosts.filter((post) => {
    if (regionFilter !== null && post.region !== regionFilter) return false;
    if (categoryFilter !== null && post.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="pb-24">
        {/* Title skeleton */}
        <div className="p-6 pb-2">
          <SkeletonText className="w-32 h-8" />
        </div>
        {/* Region filter skeleton */}
        <div className="px-6 flex gap-2 mb-3">
          <Skeleton className="w-12 h-9 rounded-full" />
          <Skeleton className="w-12 h-9 rounded-full" />
          <Skeleton className="w-14 h-9 rounded-full" />
          <Skeleton className="w-12 h-9 rounded-full" />
        </div>
        {/* Category filter skeleton */}
        <div className="px-6 flex gap-2 mb-4">
          <Skeleton className="w-12 h-9 rounded-full" />
          <Skeleton className="w-16 h-9 rounded-full" />
          <Skeleton className="w-14 h-9 rounded-full" />
          <Skeleton className="w-12 h-9 rounded-full" />
          <Skeleton className="w-16 h-9 rounded-full" />
        </div>
        {/* Card skeletons */}
        <div className="flex flex-col gap-4 px-6">
          <Skeleton className="h-44 rounded-2xl animate-shimmer" />
          <Skeleton className="h-44 rounded-2xl animate-shimmer" />
          <Skeleton className="h-44 rounded-2xl animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Title */}
      <h1 className="text-display-sm text-on-surface p-6 pb-2">같이 가요</h1>

      {/* Filters */}
      <div className="px-6">
        {/* Region filters */}
        <div className="overflow-x-auto flex gap-2 scrollbar-hide mb-3">
          {regions.map((r) => (
            <Chip
              key={r.label}
              active={regionFilter === r.key}
              onClick={() => setRegionFilter(r.key)}
            >
              {r.label}
            </Chip>
          ))}
        </div>
        {/* Category filters */}
        <div className="overflow-x-auto flex gap-2 scrollbar-hide mb-3">
          {categories.map((c) => (
            <Chip
              key={c.label}
              active={categoryFilter === c.key}
              onClick={() => setCategoryFilter(c.key)}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-4 px-6 mt-2">
        {filteredPosts.length === 0 ? (
          <EmptyState icon="📭" message="모집글이 없습니다" />
        ) : (
          filteredPosts.map((post, index) => {
            const delayClass = DELAY_CLASSES[Math.min(index, DELAY_CLASSES.length - 1)];
            return (
              <div key={post.id} className={`animate-fade-in-up ${delayClass}`}>
                <PostCard post={post} even={index % 2 === 0} onClick={() => router.push(`/community/${post.id}`)} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
