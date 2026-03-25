"use client";

import { useState, useRef, useEffect } from "react";
import { Sauna } from "@/lib/types";

const CATEGORY_LABELS: Record<Sauna["category"], string> = {
  finnish: "핀란드식",
  bulgama: "불가마",
  hotel: "호텔 스파",
  jjimjilbang: "찜질방",
};

interface SaunaSelectorProps {
  saunas: Sauna[];
  onSelect: (saunaId: string) => void;
  selectedId: string | null;
}

export default function SaunaSelector({
  saunas,
  onSelect,
  selectedId,
}: SaunaSelectorProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedSauna = selectedId
    ? saunas.find((s) => s.id === selectedId)
    : null;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selected state
  if (selectedSauna) {
    return (
      <div className="bg-primary-container/10 rounded-2xl p-4 flex items-center justify-between shadow-ambient-sm">
        <div>
          <p className="text-title-md text-on-surface">{selectedSauna.name}</p>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            {selectedSauna.address}
          </p>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
            {CATEGORY_LABELS[selectedSauna.category]}
          </span>
        </div>
        <button
          className="text-label-md text-primary cursor-pointer ml-4 shrink-0 px-3 py-1.5 rounded-2xl hover:bg-primary/10 transition-all"
          onClick={() => {
            setQuery("");
            onSelect("");
          }}
        >
          변경
        </button>
      </div>
    );
  }

  const filtered = query.length > 0
    ? saunas.filter((s) => {
        const q = query.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
      })
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleSelect = (saunaId: string) => {
    onSelect(saunaId);
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <>
      <div ref={wrapperRef} className="relative">
        {/* Search input */}
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 0 && setShowDropdown(true)}
            placeholder="사우나 이름으로 검색..."
            className="bg-surface-container-highest/60 rounded-2xl pl-12 pr-5 py-4 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
          />
        </div>

        {/* Dropdown results */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-2xl shadow-ambient-lg z-20 max-h-[320px] overflow-y-auto animate-fade-in">
            {filtered.length > 0 ? (
              <>
                {filtered.map((sauna) => (
                  <div
                    key={sauna.id}
                    className="p-4 cursor-pointer transition-all hover:bg-surface-container-low first:rounded-t-2xl"
                    onClick={() => handleSelect(sauna.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-title-md text-on-surface truncate">{sauna.name}</p>
                        <p className="text-body-md text-on-surface-variant mt-0.5 truncate">
                          {sauna.address}
                        </p>
                      </div>
                      <span className="ml-3 shrink-0 px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                        {CATEGORY_LABELS[sauna.category]}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Divider */}
                <div className="mx-4 h-px bg-surface-container" />
                {/* Add new sauna option */}
                <div
                  className="p-4 cursor-pointer transition-all hover:bg-primary-container/5 rounded-b-2xl flex items-center gap-3"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowAddPopup(true);
                  }}
                >
                  <span className="w-8 h-8 rounded-full bg-primary-container/15 flex items-center justify-center text-primary text-lg">+</span>
                  <div>
                    <p className="text-title-md text-primary">새로운 장소 등록하기</p>
                    <p className="text-label-sm text-on-surface-variant">찾으시는 사우나가 없나요?</p>
                  </div>
                </div>
              </>
            ) : (
              /* No results - prompt to add */
              <div className="p-6 flex flex-col items-center gap-4">
                <span className="text-4xl">🧖</span>
                <p className="text-body-md text-on-surface-variant text-center">
                  &ldquo;{query}&rdquo;에 대한 검색 결과가 없습니다
                </p>
                <button
                  className="gradient-primary text-white text-body-md font-semibold px-6 py-3 rounded-3xl shadow-glow-primary active:scale-[0.97] transition-all"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowAddPopup(true);
                  }}
                >
                  새로운 장소 등록하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Sauna Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-on-surface/40"
            onClick={() => setShowAddPopup(false)}
          />
          {/* Popup */}
          <div className="relative bg-surface-container-lowest rounded-3xl p-6 w-full max-w-[340px] shadow-ambient-lg animate-fade-in-up">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary">
                <span className="text-3xl">🏢</span>
              </div>
            </div>

            <h3 className="text-headline-md text-on-surface text-center">
              새로운 장소를 등록하시겠습니까?
            </h3>
            <p className="text-body-md text-on-surface-variant text-center mt-2">
              DB에 없는 사우나를 제보해주시면 검토 후 등록됩니다. 등록 완료 시 특별 배지와 XP를 드립니다!
            </p>

            {/* Reward preview */}
            <div className="flex items-center justify-center gap-4 mt-4 py-3 bg-primary-container/10 rounded-2xl">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🏅</span>
                <span className="text-label-md text-primary">특별 배지</span>
              </div>
              <div className="w-px h-4 bg-surface-container" />
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⚡</span>
                <span className="text-label-md text-primary">+100 XP</span>
              </div>
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="사우나 이름"
              defaultValue={query}
              className="mt-4 bg-surface-container-highest/60 rounded-2xl px-5 py-3.5 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
            />
            <input
              type="text"
              placeholder="주소 (선택)"
              className="mt-3 bg-surface-container-highest/60 rounded-2xl px-5 py-3.5 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
            />

            {/* Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                className="flex-1 py-3.5 rounded-3xl bg-surface-container text-on-surface-variant text-title-md text-center active:scale-[0.97] transition-all"
                onClick={() => setShowAddPopup(false)}
              >
                취소
              </button>
              <button
                className="flex-1 py-3.5 rounded-3xl gradient-primary text-white text-title-md text-center shadow-glow-primary active:scale-[0.97] transition-all"
                onClick={() => {
                  setShowAddPopup(false);
                  alert("등록 요청이 접수되었습니다! 검토 후 알려드릴게요. 🎉");
                }}
              >
                등록 요청
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
