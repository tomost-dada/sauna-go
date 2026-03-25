"use client";

import StarRating from "@/components/ui/StarRating";

const RATING_CATEGORIES = [
  { key: "ratingHotTub", label: "온탕 만족도" },
  { key: "ratingColdTub", label: "냉탕 만족도" },
  { key: "ratingSauna", label: "사우나 만족도" },
  { key: "ratingCleanliness", label: "청결도" },
  { key: "ratingFacility", label: "시설 만족도" },
  { key: "ratingOverall", label: "전반적 만족도" },
];

interface RatingFormProps {
  ratings: Record<string, number>;
  onRatingChange: (key: string, value: number) => void;
}

export default function RatingForm({ ratings, onRatingChange }: RatingFormProps) {
  return (
    <div className="flex flex-col">
      {RATING_CATEGORIES.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between py-3">
          <span className="text-body-lg text-on-surface">{label}</span>
          <StarRating
            value={ratings[key] ?? 0}
            onChange={(value) => onRatingChange(key, value)}
          />
        </div>
      ))}
    </div>
  );
}
