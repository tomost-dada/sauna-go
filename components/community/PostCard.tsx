"use client";

import Badge from "@/components/ui/Badge";
import { CommunityPost } from "@/lib/types";
import MeetupStatus from "./MeetupStatus";

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

const ctaLabelMap: Record<CommunityPost["status"], string> = {
  recruiting: "참여하기",
  confirmed: "채팅방 보기",
  completed: "후기 보기",
};

interface PostCardProps {
  post: CommunityPost;
  even: boolean;
  onClick?: () => void;
}

export default function PostCard({ post, even, onClick }: PostCardProps) {
  const bgClass = even ? "bg-surface-container-lowest" : "bg-surface-container-low";

  return (
    <div className={`${bgClass} rounded-2xl p-5 cursor-pointer active:scale-[0.98] transition-all`} onClick={onClick}>
      {/* Top row: host nickname + HOST badge + status */}
      <div className="flex items-center gap-2">
        <span className="text-title-md text-on-surface">{post.hostNickname}</span>
        <Badge variant="host">HOST</Badge>
        <MeetupStatus status={post.status} />
      </div>

      {/* Sauna name */}
      <div className="text-headline-md text-on-surface mt-2">{post.saunaName}</div>

      {/* Tags row: region + category */}
      <div className="flex gap-2 mt-2">
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
          {regionMap[post.region] ?? post.region}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
          {categoryMap[post.category] ?? post.category}
        </span>
      </div>

      {/* Meet date */}
      <div className="text-body-md text-on-surface-variant mt-3">
        📅 {formatMeetDate(post.meetDate)}
      </div>

      {/* Bottom row */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-body-md text-on-surface-variant">
          Host + {post.maxSpots - post.currentSpots} Spots
        </span>
        <button
          className="px-5 py-2.5 rounded-3xl gradient-primary text-white text-body-md font-semibold active:scale-[0.97] transition-all"
          style={{ boxShadow: "0 4px 16px rgba(254, 125, 94, 0.50)" }}
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          {ctaLabelMap[post.status]}
        </button>
      </div>
    </div>
  );
}
