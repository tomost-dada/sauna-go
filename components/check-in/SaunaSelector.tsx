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
      <div className="bg-primary-container/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-title-md text-on-surface">{selectedSauna.name}</p>
          <p className="text-body-md text-on-surface-variant">
            {selectedSauna.address}
          </p>
        </div>
        <button
          className="text-label-md text-primary cursor-pointer ml-4 shrink-0"
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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="사우나 검색..."
        className="bg-surface-container-highest rounded-2xl px-4 py-3 text-body-lg text-on-surface outline-none w-full focus:bg-surface-container-lowest focus:shadow-focus-primary"
      />
      {query.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          {filtered.length === 0 ? (
            <p className="text-body-md text-on-surface-variant text-center py-4">
              일치하는 사우나가 없습니다
            </p>
          ) : (
            filtered.map((sauna) => (
              <div
                key={sauna.id}
                className="py-3 px-4 rounded-2xl cursor-pointer transition-colors hover:bg-surface-container-lowest"
                onClick={() => {
                  onSelect(sauna.id);
                  setQuery("");
                }}
              >
                <p className="text-title-md text-on-surface">{sauna.name}</p>
                <p className="text-body-md text-on-surface-variant">
                  {sauna.address}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-label-sm text-on-surface-variant bg-surface-container-high">
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
