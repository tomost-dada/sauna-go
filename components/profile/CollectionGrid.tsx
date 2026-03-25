"use client";

import { Collection, CollectionItemMeta } from "@/lib/types";

interface CollectionGridProps {
  collections: Collection[];
  meta: CollectionItemMeta[];
}

export default function CollectionGrid({ collections, meta }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {meta.map((item) => {
        const collectionEntry = collections.find(
          (c) => c.itemType === item.itemType && c.unlockedAt !== null
        );
        const isUnlocked = !!collectionEntry;

        if (isUnlocked) {
          const containerClass =
            item.rarity === "legendary"
              ? "bg-primary-container/10 ring-2 ring-primary-container/30 rounded-2xl"
              : item.rarity === "rare"
              ? "bg-tertiary/5 ring-1 ring-tertiary/20 rounded-2xl"
              : "bg-surface-container-lowest";

          const emojiClass =
            item.rarity === "legendary" ? "text-3xl animate-float" : "text-3xl";

          return (
            <div
              key={item.itemType}
              className={`flex flex-col items-center gap-1.5 p-2 transition-all ${containerClass}`}
            >
              <span className={emojiClass}>{item.emoji}</span>
              <span className="text-label-sm text-on-surface text-center">{item.displayName}</span>
            </div>
          );
        }

        return (
          <div
            key={item.itemType}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl opacity-25"
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-label-sm text-on-surface-variant text-center">???</span>
          </div>
        );
      })}
    </div>
  );
}
