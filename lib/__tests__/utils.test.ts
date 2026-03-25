import { describe, it, expect } from "vitest";
import { getLevelFromXP, getXPProgress, calculateXP, calculateConquestRate } from "../utils";

describe("getLevelFromXP", () => {
  it("returns level 1 for 0 XP", () => {
    expect(getLevelFromXP(0).level).toBe(1);
  });
  it("returns level 7 for 1720 XP", () => {
    expect(getLevelFromXP(1720).level).toBe(7);
    expect(getLevelFromXP(1720).title).toBe("Hot Stone Master");
  });
  it("returns level 10 for 3200+ XP", () => {
    expect(getLevelFromXP(5000).level).toBe(10);
  });
});

describe("getXPProgress", () => {
  it("calculates progress within level 7", () => {
    const progress = getXPProgress(1720);
    expect(progress.current).toBe(70);
    expect(progress.total).toBe(450);
  });
  it("returns 100% at max level", () => {
    expect(getXPProgress(3200).percent).toBe(100);
  });
});

describe("calculateXP", () => {
  it("returns 100 for basic check-in", () => {
    expect(calculateXP({ oneLineReview: "" }, false)).toBe(100);
  });
  it("adds 20 for review", () => {
    expect(calculateXP({ oneLineReview: "Great!" }, false)).toBe(120);
  });
  it("adds 50 for first visit", () => {
    expect(calculateXP({ oneLineReview: "" }, true)).toBe(150);
  });
  it("adds both bonuses", () => {
    expect(calculateXP({ oneLineReview: "Nice" }, true)).toBe(170);
  });
});

describe("calculateConquestRate", () => {
  const saunas = [
    { id: "1", region: "seoul" as const },
    { id: "2", region: "seoul" as const },
    { id: "3", region: "jeju" as const },
  ] as any[];
  it("calculates conquest for seoul", () => {
    const result = calculateConquestRate("seoul", saunas, ["1"]);
    expect(result.visited).toBe(1);
    expect(result.total).toBe(2);
    expect(result.percent).toBe(50);
  });
  it("returns 0 for unvisited region", () => {
    const result = calculateConquestRate("jeju", saunas, []);
    expect(result.percent).toBe(0);
  });
});
