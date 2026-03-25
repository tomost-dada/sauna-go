"use client";

import { Quest } from "@/lib/types";
import Chip from "@/components/ui/Chip";

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  return (
    <div
      className="relative bg-surface-container-lowest rounded-2xl p-6 pt-10"
      style={{ boxShadow: "0 8px 24px rgba(44, 47, 48, 0.04)" }}
    >
      {/* Icon breaking card boundary */}
      <div
        className="absolute -top-5 left-6 w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-xl"
        style={{ boxShadow: "0 8px 32px rgba(254, 125, 94, 0.30)" }}
      >
        {quest.icon}
      </div>

      <h3 className="text-headline-md text-on-surface mt-2">{quest.title}</h3>
      <p className="text-body-md text-on-surface-variant mt-1">{quest.description}</p>

      <div className="flex justify-between items-center mt-4">
        <Chip active={quest.current > 0}>
          {quest.current}/{quest.target}
        </Chip>
        <span className="text-label-md text-primary-container">+{quest.xpReward} XP</span>
      </div>
    </div>
  );
}
