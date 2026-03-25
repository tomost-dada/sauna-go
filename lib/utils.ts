import { CheckIn, Sauna } from "./types";

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: "Newbie Steamer" },
  { level: 2, xp: 150, title: "Warm Beginner" },
  { level: 3, xp: 350, title: "Bath Explorer" },
  { level: 4, xp: 600, title: "Heat Seeker" },
  { level: 5, xp: 900, title: "Sauna Regular" },
  { level: 6, xp: 1250, title: "Steam Veteran" },
  { level: 7, xp: 1650, title: "Hot Stone Master" },
  { level: 8, xp: 2100, title: "Sauna Conqueror" },
  { level: 9, xp: 2600, title: "Legendary Bather" },
  { level: 10, xp: 3200, title: "Grand Sauna Elder" },
] as const;

export function getLevelFromXP(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      return LEVEL_THRESHOLDS[i];
    }
  }
  return LEVEL_THRESHOLDS[0];
}

export function getXPProgress(xp: number) {
  const current = getLevelFromXP(xp);
  const nextIdx = LEVEL_THRESHOLDS.findIndex((t) => t.level === current.level + 1);
  if (nextIdx === -1) return { current: 0, total: 0, percent: 100 };
  const next = LEVEL_THRESHOLDS[nextIdx];
  const progress = xp - current.xp;
  const total = next.xp - current.xp;
  return { current: progress, total, percent: Math.round((progress / total) * 100) };
}

export function calculateXP(checkIn: Pick<CheckIn, "oneLineReview">, isFirstVisit: boolean) {
  let xp = 100;
  if (checkIn.oneLineReview.trim().length > 0) xp += 20;
  if (isFirstVisit) xp += 50;
  return xp;
}

export function calculateConquestRate(
  region: Sauna["region"],
  saunas: Sauna[],
  visitedSaunaIds: string[]
) {
  const regionSaunas = saunas.filter((s) => s.region === region);
  const visited = regionSaunas.filter((s) => visitedSaunaIds.includes(s.id));
  return {
    visited: visited.length,
    total: regionSaunas.length,
    percent: regionSaunas.length === 0 ? 0 : Math.round((visited.length / regionSaunas.length) * 100),
  };
}
