"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saunas, currentUser } from "@/lib/mock-data";
import { CheckIn } from "@/lib/types";
import SaunaSelector from "@/components/check-in/SaunaSelector";
import RatingForm from "@/components/check-in/RatingForm";
import ReviewInput from "@/components/check-in/ReviewInput";
import Skeleton, { SkeletonText } from "@/components/ui/Skeleton";

export default function CheckInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedSaunaId, setSelectedSaunaId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({
    ratingHotTub: 0,
    ratingColdTub: 0,
    ratingSauna: 0,
    ratingCleanliness: 0,
    ratingFacility: 0,
    ratingOverall: 0,
  });
  const [review, setReview] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!selectedSaunaId) return;

    const newId = Date.now().toString();
    const checkIn: CheckIn = {
      id: newId,
      userId: currentUser.id,
      saunaId: selectedSaunaId,
      ratingHotTub: ratings.ratingHotTub,
      ratingColdTub: ratings.ratingColdTub,
      ratingSauna: ratings.ratingSauna,
      ratingCleanliness: ratings.ratingCleanliness,
      ratingFacility: ratings.ratingFacility,
      ratingOverall: ratings.ratingOverall,
      oneLineReview: review,
      privateNote: note,
      visitedAt: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("saunago_last_checkin", JSON.stringify(checkIn));
    router.push(`/check-in/${newId}/result`);
  };

  if (loading) {
    return (
      <div className="p-6 pb-24">
        <SkeletonText className="w-24 h-7 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-16 w-full mb-3" />
        <Skeleton className="h-16 w-full mb-3" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 animate-fade-in">
      <h1 className="text-display-sm text-on-surface mb-6">체크인</h1>

      <SaunaSelector
        saunas={saunas}
        onSelect={(id) => setSelectedSaunaId(id || null)}
        selectedId={selectedSaunaId}
      />

      {selectedSaunaId && (
        <>
          <div className="mt-8">
            <h2 className="text-headline-md text-on-surface mb-4">평가</h2>
            <RatingForm ratings={ratings} onRatingChange={handleRatingChange} />
          </div>

          <div className="mt-8">
            <h2 className="text-headline-md text-on-surface mb-4">리뷰</h2>
            <ReviewInput
              review={review}
              note={note}
              onReviewChange={setReview}
              onNoteChange={setNote}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full py-4 rounded-3xl bg-gradient-to-r from-primary-container to-primary-fixed text-white text-title-md text-center active:scale-[0.98] transition-transform"
          >
            체크인 완료
          </button>
        </>
      )}
    </div>
  );
}
