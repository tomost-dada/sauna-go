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
    { label: "종합", value: checkInData.ratingOverall },
  ];

  const avgRating = (
    ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
  ).toFixed(1);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${saunaName} 인증 카드`,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-6">

          {/* Top: SAUNA GO branding + date */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-label-md text-white/60 tracking-widest">SAUNA GO</p>
              <p className="text-label-sm text-white/40 mt-1">{visitedDate}</p>
            </div>
            {/* User info */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-label-md font-bold"
                style={{ boxShadow: "0 4px 16px rgba(254,125,94,0.4)" }}
              >
                {currentUser.nickname.charAt(0)}
              </div>
            </div>
          </div>

          {/* Conquered Stamp */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="relative flex flex-col items-center justify-center"
              style={{
                width: 160,
                height: 160,
              }}
            >
              {/* Outer stamp ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "4px solid rgba(254, 125, 94, 0.9)",
                  boxShadow: "0 0 40px rgba(254, 125, 94, 0.3), inset 0 0 40px rgba(254, 125, 94, 0.1)",
                  transform: "rotate(-12deg)",
                }}
              />
              {/* Inner stamp ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: 8,
                  border: "2px solid rgba(254, 125, 94, 0.6)",
                  transform: "rotate(-12deg)",
                }}
              />
              {/* Stamp content */}
              <div
                className="relative flex flex-col items-center justify-center"
                style={{ transform: "rotate(-12deg)" }}
              >
                <span className="text-label-md text-primary-fixed tracking-[0.2em]">CONQUERED</span>
                <span className="text-display-sm text-white font-bold mt-0.5">정복 완료</span>
                <div className="w-16 h-0.5 bg-primary-container/60 rounded-full my-1.5" />
                <span className="text-label-sm text-primary-fixed/80">{avgRating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-auto">
            {/* One-line review */}
            {checkInData.oneLineReview?.trim() && (
              <div className="mb-5">
                <div className="glass-dark rounded-2xl px-5 py-4">
                  <p className="text-white/40 text-label-sm mb-1">한줄평</p>
                  <p className="text-headline-md text-white leading-snug">
                    &ldquo;{checkInData.oneLineReview}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Sauna name + location */}
            <p className="text-display-sm text-white font-bold">{saunaName}</p>
            {sauna && (
              <p className="text-body-md text-white/50 mt-1">{sauna.address}</p>
            )}

            {/* Ratings grid */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-3 mt-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              {ratings.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="text-label-sm text-white/60">{label}</span>
                  <div className="[&_span]:text-white [&_svg]:text-white">
                    <StarRating value={value} readonly size="sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* User info footer */}
            <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-body-md text-white/70">{currentUser.nickname}</span>
              <span className="text-label-sm text-white/40">Lv.{currentUser.level}</span>
              <span className="text-label-sm text-white/40">{currentUser.title}</span>
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
