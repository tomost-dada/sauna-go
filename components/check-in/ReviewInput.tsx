"use client";

interface ReviewInputProps {
  review: string;
  note: string;
  onReviewChange: (v: string) => void;
  onNoteChange: (v: string) => void;
}

export default function ReviewInput({
  review,
  note,
  onReviewChange,
  onNoteChange,
}: ReviewInputProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-title-md text-on-surface mb-1">한줄평</p>
        <p className="text-label-sm text-on-surface-variant mb-3 flex items-center gap-1">
          <span>🌐</span> 공개
        </p>
        <input
          type="text"
          value={review}
          onChange={(e) => onReviewChange(e.target.value)}
          placeholder="이 사우나를 한 마디로?"
          className="bg-surface-container-highest/60 rounded-2xl px-5 py-4 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
        />
      </div>
      <div>
        <p className="text-title-md text-on-surface mb-1">비밀 메모</p>
        <p className="text-label-sm text-on-surface-variant mb-3 flex items-center gap-1">
          <span>🔒</span> 나만 보기
        </p>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="라커 번호, 꿀팁 등"
          className="bg-surface-container-highest/60 rounded-2xl px-5 py-4 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
}
