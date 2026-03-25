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
          const ringClass =
            item.rarity === "legendary"
              ? "ring-2 ring-primary-container/50 rounded-2xl p-2"
              : item.rarity === "rare"
              ? "ring-2 ring-tertiary/30 rounded-2xl p-2"
              : "p-2";

          return (
            <div key={item.itemType} className={`flex flex-col items-center gap-1 ${ringClass}`}>
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-label-sm text-on-surface text-center">{item.displayName}</span>
            </div>
          );
        }

        return (
          <div key={item.itemType} className="flex flex-col items-center gap-1 opacity-20">
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-label-sm text-on-surface-variant text-center">???</span>
          </div>
        );
      })}
    </div>
  );
}
