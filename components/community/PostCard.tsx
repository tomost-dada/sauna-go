"use client";

import Badge from "@/components/ui/Badge";
import { CommunityPost } from "@/lib/types";

const regionMap: Record<string, string> = {
  seoul: "서울",
  gyeonggi: "경기",
  jeju: "제주",
};

const categoryMap: Record<string, string> = {
  finnish: "핀란드식",
  bulgama: "불가마",
  hotel: "호텔 스파",
  jjimjilbang: "찜질방",
};

function formatMeetDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

interface PostCardProps {
  post: CommunityPost;
  even: boolean;
}

export default function PostCard({ post, even }: PostCardProps) {
  const bgClass = even
    ? "bg-surface-container-lowest"
    : "bg-surface-container-low";

  return (
    <div className={`p-5 rounded-2xl ${bgClass}`}>
      {/* Top row: host nickname + HOST badge */}
      <div className="flex items-center gap-2">
        <span className="text-title-md text-on-surface">{post.hostNickname}</span>
        <Badge variant="host">HOST</Badge>
      </div>

      {/* Sauna info */}
      <div className="mt-2">
        <div className="text-headline-md text-on-surface">{post.saunaName}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
            {regionMap[post.region] ?? post.region}
          </span>
          <span className="text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
            {categoryMap[post.category] ?? post.category}
          </span>
        </div>
      </div>

      {/* Meet date */}
      <div className="mt-3 text-body-md text-on-surface-variant">
        {formatMeetDate(post.meetDate)}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-body-md text-on-surface-variant">
          Host + {post.maxSpots - post.currentSpots} Spots
        </span>
        <div className="flex items-center gap-3">
          {/* Chat icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-on-surface-variant"
          >
            <path
              d="M2 3.5C2 2.672 2.672 2 3.5 2h13C17.328 2 18 2.672 18 3.5v9c0 .828-.672 1.5-1.5 1.5H6l-4 4V3.5z"
              fill="currentColor"
            />
          </svg>
          {/* 참여하기 button */}
          <button className="px-5 py-2 rounded-3xl bg-secondary-container text-secondary text-body-md font-semibold">
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
