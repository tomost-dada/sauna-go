"use client";

import { CommunityPost } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface HotspotPreviewProps {
  posts: CommunityPost[];
}

const staggerDelays = ["", "delay-100", "delay-200", "delay-300", "delay-400"];

export default function HotspotPreview({ posts }: HotspotPreviewProps) {
  return (
    <div className="overflow-x-auto flex gap-4 pb-2 scrollbar-hide">
      {posts.map((post, i) => {
        const spotsLeft = post.maxSpots - post.currentSpots;
        const delayClass = staggerDelays[Math.min(i, staggerDelays.length - 1)];
        return (
          <div
            key={post.id}
            className={`min-w-[260px] bg-surface-container-lowest rounded-2xl p-5 flex-shrink-0 animate-fade-in-up ${delayClass}`}
            style={{ boxShadow: "0 8px 24px rgba(44, 47, 48, 0.04)" }}
          >
            <p className="text-label-sm text-on-surface-variant">{post.hostNickname}</p>
            <p className="text-title-md text-on-surface mt-2">{post.saunaName}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="host">{post.hostTitle}</Badge>
              <span className="text-body-md text-on-surface-variant">{spotsLeft} spots left</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
