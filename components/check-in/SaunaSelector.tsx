"use client";

import { useState } from "react";
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

  const selectedSauna = selectedId
    ? saunas.find((s) => s.id === selectedId)
    : null;

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

  const filtered = saunas.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="사우나 검색..."
          className="bg-surface-container-highest/60 rounded-2xl pl-12 pr-5 py-4 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
        />
      </div>
      {query.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {filtered.length === 0 ? (
            <p className="text-body-md text-on-surface-variant text-center py-8">
              일치하는 사우나가 없습니다
            </p>
          ) : (
            filtered.map((sauna) => (
              <div
                key={sauna.id}
                className="p-4 rounded-2xl cursor-pointer transition-all hover:bg-surface-container-lowest hover:shadow-ambient-sm"
                onClick={() => {
                  onSelect(sauna.id);
                  setQuery("");
                }}
              >
                <p className="text-title-md text-on-surface">{sauna.name}</p>
                <p className="text-body-md text-on-surface-variant mt-0.5">
                  {sauna.address}
                </p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                  {CATEGORY_LABELS[sauna.category]}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
