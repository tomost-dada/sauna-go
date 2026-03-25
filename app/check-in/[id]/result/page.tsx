"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkIns, saunas, currentUser } from "@/lib/mock-data";
import { CheckIn } from "@/lib/types";
import StarRating from "@/components/ui/StarRating";
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
  const saunaImageUrl = sauna?.imageUrl ?? "https://picsum.photos/seed/default/400/600";

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
  ];

  const avgRating = checkInData.ratingOverall > 0
    ? checkInData.ratingOverall.toFixed(1)
    : (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1);

  const hasReview = !!checkInData.oneLineReview?.trim();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${saunaName} 인증 카드`, url: window.location.href });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const Stamp = () => (
    <div
      className="flex flex-col items-center justify-center rounded-full"
      style={{
        width: 90,
        height: 90,
        border: "3px solid rgba(254, 125, 94, 0.85)",
        boxShadow: "0 0 20px rgba(254, 125, 94, 0.25)",
        transform: "rotate(15deg)",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <span
        className="text-primary-fixed font-bold tracking-[0.12em]"
        style={{ fontSize: 10, transform: "rotate(0deg)" }}
      >
        CLEAR!
      </span>
      <span
        className="text-white font-bold"
        style={{ fontSize: 20, lineHeight: 1.1 }}
      >
        {avgRating}
      </span>
    </div>
  );

  return (
    <div className="p-4 pb-24 flex flex-col items-center animate-fade-in">
      {/* Instagram Story Card (9:16) */}
      <div
        className="w-full max-w-[340px] relative rounded-3xl overflow-hidden shadow-ambient-lg animate-fade-in-up"
        style={{ aspectRatio: "9 / 16" }}
      >
        {/* Background image */}
        <img
          src={saunaImageUrl}
          alt={saunaName}
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/80" />

        {/* Content — use absolute positioning to prevent overflow */}
        <div className="absolute inset-0 z-10 flex flex-col p-5">

          {/* Top row: branding + avatar (no overall score) */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-label-md text-white/60 tracking-widest text-[10px]">SAUNA GO</p>
              <p className="text-label-sm text-white/40 mt-0.5" style={{ fontSize: 10 }}>{visitedDate}</p>
            </div>
            <div
              className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white font-bold"
              style={{ fontSize: 11, boxShadow: "0 4px 12px rgba(254,125,94,0.4)" }}
            >
              {currentUser.nickname.charAt(0)}
            </div>
          </div>

          {/* Middle spacer — fallback stamp if no review */}
          {!hasReview && (
            <div className="flex-1 flex items-center justify-center">
              <Stamp />
            </div>
          )}

          {/* Bottom section — pushed to lower ~40% when review exists */}
          <div className={hasReview ? "mt-auto" : ""}>
            {/* One-line review with diagonal stamp overlay */}
            {hasReview && (
              <div className="relative mb-3">
                <div className="glass-dark rounded-xl px-4 py-3">
                  <p className="text-white/40 mb-0.5" style={{ fontSize: 10 }}>한줄평</p>
                  <p className="text-white font-semibold" style={{ fontSize: 15, lineHeight: 1.4 }}>
                    &ldquo;{checkInData.oneLineReview}&rdquo;
                  </p>
                </div>
                {/* Diagonal stamp overlapping top-right corner */}
                <div className="absolute" style={{ top: -20, right: -10, zIndex: 20 }}>
                  <Stamp />
                </div>
              </div>
            )}

            {/* Sauna name */}
            <p className="text-white font-bold" style={{ fontSize: 18 }}>{saunaName}</p>

            {/* Ratings — compact horizontal layout */}
            <div className="mt-3 bg-white/10 rounded-xl px-3 py-2.5 backdrop-blur-sm">
              <div className="flex justify-between">
                {ratings.map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-0.5">
                    <span className="text-white/60" style={{ fontSize: 9 }}>{label}</span>
                    <span className="text-white font-bold" style={{ fontSize: 14 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User footer */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-white/60" style={{ fontSize: 11 }}>{currentUser.nickname}</span>
              <span className="text-white/40" style={{ fontSize: 10 }}>Lv.{currentUser.level}</span>
              <span className="text-white/40" style={{ fontSize: 10 }}>{currentUser.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 w-full max-w-[340px] flex flex-col gap-3 animate-fade-in-up delay-100">
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-3xl gradient-primary text-white text-title-md text-center shadow-glow-primary active:scale-[0.98] transition-all"
        >
          스토리 공유하기
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-3xl bg-surface-container-lowest text-on-surface text-title-md text-center shadow-ambient-sm active:scale-[0.98] transition-all"
        >
          홈으로
        </button>
      </div>

      <Toast message="링크가 복사되었습니다" isVisible={showToast} />
    </div>
  );
}
