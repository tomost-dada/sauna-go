"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkIns, saunas, currentUser } from "@/lib/mock-data";
import { CheckIn } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Toast from "@/components/ui/Toast";

export default function CertificationCardPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [checkInData, setCheckInData] = useState<CheckIn | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("saunago_last_checkin") || "null");
    if (stored) {
      setCheckInData(stored as CheckIn);
    } else {
      setCheckInData(checkIns[0]);
    }
  }, []);

  if (!checkInData) return null;

  const sauna = saunas.find((s) => s.id === checkInData.saunaId);
  const saunaName = sauna?.name ?? "알 수 없는 사우나";
  const saunaImageUrl = sauna?.imageUrl ?? "https://picsum.photos/seed/default/400/400";

  const visitedDate = new Date(checkInData.visitedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ratings: { label: string; value: number }[] = [
    { label: "열탕", value: checkInData.ratingHotTub },
    { label: "냉탕", value: checkInData.ratingColdTub },
    { label: "사우나", value: checkInData.ratingSauna },
    { label: "청결도", value: checkInData.ratingCleanliness },
    { label: "시설", value: checkInData.ratingFacility },
    { label: "종합", value: checkInData.ratingOverall },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${saunaName} 인증 카드`,
          url: window.location.href,
        });
      } catch {
        // user cancelled or error — ignore
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="p-6 pb-24 flex flex-col items-center">
      {/* 1:1 Certification Card */}
      <div className="w-full max-w-[350px] aspect-square relative rounded-2xl overflow-hidden shadow-ambient-lg animate-fade-in-up">
        {/* Background image */}
        <img
          src={saunaImageUrl}
          alt={saunaName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          {/* Top: avatar + nickname + level badge */}
          <div className="flex flex-row items-center gap-2">
            <div className="gradient-primary flex items-center justify-center rounded-full text-white text-label-md font-semibold shrink-0 w-8 h-8 shadow-glow-primary">
              {currentUser.nickname.charAt(0)}
            </div>
            <span className="text-body-md text-white font-medium">{currentUser.nickname}</span>
            <Badge variant="level">Lv.{currentUser.level}</Badge>
          </div>

          {/* Center: one-line review with decorative quotation marks */}
          <div className="flex-1 flex flex-col items-center justify-center px-2">
            <span className="text-white/30 text-[40px] leading-none self-start mb-1">&ldquo;</span>
            <p className="text-display-md text-white text-center leading-tight">
              {checkInData.oneLineReview?.trim() || "멋진 사우나 경험!"}
            </p>
            <span className="text-white/30 text-[40px] leading-none self-end mt-1">&rdquo;</span>
          </div>

          {/* Bottom: sauna name, ratings grid, visited date */}
          <div>
            <p className="text-title-md text-white/90 mb-2">{saunaName}</p>
            {/* 3x2 ratings grid */}
            <div className="grid grid-cols-3 gap-x-3 gap-y-2">
              {ratings.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-label-sm text-white/70">{label}</span>
                  <div className="text-white [&_span]:text-white [&_svg]:text-white">
                    <StarRating value={value} readonly size="sm" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-label-sm text-white/50 mt-3">{visitedDate}</p>
          </div>
        </div>
      </div>

      {/* Action buttons below card */}
      <div className="mt-6 w-full max-w-[350px] flex flex-col gap-3 animate-fade-in-up delay-100">
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-3xl gradient-primary text-white text-title-md text-center shadow-glow-primary active:scale-[0.98] transition-all"
        >
          공유하기
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-3xl bg-surface-container-lowest text-on-surface text-title-md text-center shadow-ambient-sm active:scale-[0.98] transition-all"
        >
          홈으로
        </button>
      </div>

      {/* Toast for clipboard copy */}
      <Toast message="링크가 복사되었습니다" isVisible={showToast} />
    </div>
  );
}
