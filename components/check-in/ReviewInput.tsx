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
        <p className="text-title-md text-on-surface mb-2">한줄평</p>
        <p className="text-label-sm text-on-surface-variant mb-2">공개</p>
        <input
          type="text"
          value={review}
          onChange={(e) => onReviewChange(e.target.value)}
          placeholder="이 사우나를 한 마디로?"
          className="bg-surface-container-highest rounded-2xl px-4 py-3 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary"
        />
      </div>
      <div>
        <p className="text-title-md text-on-surface mb-2">비밀 메모</p>
        <p className="text-label-sm text-on-surface-variant mb-2">나만 보기</p>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="라커 번호, 꿀팁 등"
          className="bg-surface-container-highest rounded-2xl px-4 py-3 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary min-h-[80px] resize-none"
        />
      </div>
    </div>
  );
}
