# SAUNA GO Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-only (390px) frontend prototype of SAUNA GO with 6 pages, mock data, and the "Radiant Ritual" design system.

**Architecture:** Next.js 14+ App Router with Tailwind CSS. All data is mock (no backend). Pages are client components using React state for interactions. Shared UI components in `components/ui/`, page-specific components colocated by feature.

**Tech Stack:** Next.js 14+, Tailwind CSS, TypeScript, Google Fonts (Plus Jakarta Sans, Be Vietnam Pro)

**Spec:** `docs/superpowers/specs/2026-03-25-saunago-webapp-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `lib/types.ts` | All TypeScript type definitions |
| `lib/utils.ts` | XP calculation, level lookup, conquest rate |
| `lib/mock-data.ts` | All mock data (user, saunas, check-ins, quests, posts, collections, reviews) |
| `tailwind.config.ts` | Design system tokens (colors, fonts, typography scale, shadows, radii) |
| `app/globals.css` | Tailwind directives + custom typography utility classes |
| `app/layout.tsx` | Root layout: fonts, meta viewport, BottomNav |
| `components/layout/BottomNav.tsx` | Floating bottom navigation with glassmorphism, 5 tabs, center FAB |
| `components/ui/ProgressBar.tsx` | Gradient progress bar (reused in home, map, profile) |
| `components/ui/Badge.tsx` | Status badge (Conquered, Locked, HOST, level) |
| `components/ui/Chip.tsx` | Pill-shaped chip for filters and progress |
| `components/ui/StarRating.tsx` | 5-star interactive rating + display-only mode |
| `components/ui/BottomSheet.tsx` | Draggable bottom sheet with overlay |
| `components/ui/Toast.tsx` | Toast notification (for share clipboard copy) |
| `components/ui/Skeleton.tsx` | Skeleton loading primitives |
| `components/ui/EmptyState.tsx` | Empty state with icon + message |
| `components/home/QuestCard.tsx` | Quest card with icon overflow, progress chip |
| `components/home/HotspotPreview.tsx` | Horizontal scroll community preview cards |
| `components/map/RegionTabs.tsx` | Horizontal scrolling pill tabs for regions |
| `components/map/ConquestBar.tsx` | Region conquest progress display |
| `components/map/SaunaCard.tsx` | Sauna card (conquered vs locked states) |
| `components/check-in/SaunaSelector.tsx` | Search bar + sauna list for selection |
| `components/check-in/RatingForm.tsx` | 6-category star rating form |
| `components/check-in/ReviewInput.tsx` | One-line review + private note inputs |
| `components/community/PostCard.tsx` | Community recruitment post card |
| `components/profile/SaunaLog.tsx` | Timeline of recent sauna visits |
| `components/profile/CollectionGrid.tsx` | Grid of collection items (colored vs silhouette) |
| `app/page.tsx` | Home & Quest page |
| `app/map/page.tsx` | Sauna Conquest Map page |
| `app/check-in/page.tsx` | Check-in page (select → rate → review → submit) |
| `app/check-in/[id]/result/page.tsx` | Certification card page (1:1 square, share) |
| `app/community/page.tsx` | Community page |
| `app/profile/page.tsx` | My Page |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/dada/PJ/saunago
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=no --import-alias="@/*" --use-npm
```

Accept defaults. This creates the full Next.js skeleton with Tailwind.

- [ ] **Step 2: Install Google Fonts**

No extra install needed — Next.js has `next/font/google` built in. Verify the project runs:

```bash
cd /Users/dada/PJ/saunago && npm run dev
```

Expected: Dev server starts on localhost:3000.

- [ ] **Step 3: Configure Tailwind design tokens**

Replace `tailwind.config.ts` with the full design system:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#a13920",
          container: "#fe7d5e",
          fixed: "#ffb4a1",
        },
        secondary: {
          DEFAULT: "#005f9b",
          container: "#b1d5ff",
          "fixed-dim": "#8abae0",
        },
        tertiary: "#803f9d",
        surface: {
          DEFAULT: "#f8f9fa",
          "container-lowest": "#ffffff",
          "container-low": "#f0f2f4",
          container: "#e6e8ea",
          "container-high": "#dcdfe1",
          "container-highest": "#d2d5d8",
        },
        "on-surface": {
          DEFAULT: "#2c2f30",
          variant: "#6b6e70",
        },
        "on-secondary-fixed": "#003354",
        "outline-variant": "rgba(44, 47, 48, 0.15)",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        body: ["var(--font-be-vietnam-pro)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "2rem",
        "3xl": "3rem",
      },
      boxShadow: {
        ambient: "0 20px 40px rgba(44, 47, 48, 0.06)",
        "ambient-sm": "0 8px 24px rgba(44, 47, 48, 0.04)",
        "focus-primary": "0 0 0 4px rgba(254, 125, 94, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Set up globals.css with typography utilities**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .text-display-lg {
    font-family: var(--font-plus-jakarta-sans), sans-serif;
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
  }
  .text-display-md {
    font-family: var(--font-plus-jakarta-sans), sans-serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.25;
  }
  .text-display-sm {
    font-family: var(--font-plus-jakarta-sans), sans-serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
  }
  .text-headline-md {
    font-family: var(--font-plus-jakarta-sans), sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.35;
  }
  .text-title-md {
    font-family: var(--font-be-vietnam-pro), sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
  }
  .text-body-lg {
    font-family: var(--font-be-vietnam-pro), sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
  }
  .text-body-md {
    font-family: var(--font-be-vietnam-pro), sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }
  .text-label-md {
    font-family: var(--font-be-vietnam-pro), sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
  }
  .text-label-sm {
    font-family: var(--font-be-vietnam-pro), sans-serif;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 5: Set up root layout with fonts**

Replace `app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAUNA GO",
  description: "사우나 정복 & 커뮤니티",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${plusJakartaSans.variable} ${beVietnamPro.variable}`}>
      <body className="font-body text-on-surface bg-surface max-w-[390px] mx-auto min-h-screen relative">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder home page**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="p-6 pb-24">
      <h1 className="text-display-lg text-on-surface">SAUNA GO</h1>
      <p className="text-body-lg text-on-surface-variant mt-2">사우나 정복을 시작하세요</p>
    </div>
  );
}
```

- [ ] **Step 7: Verify dev server renders correctly**

```bash
cd /Users/dada/PJ/saunago && npm run dev
```

Open localhost:3000. Verify: "SAUNA GO" in Plus Jakarta Sans bold, body text in Be Vietnam Pro, surface background color.

- [ ] **Step 8: Commit**

```bash
cd /Users/dada/PJ/saunago && git init && git add -A && git commit -m "feat: scaffold Next.js project with Tailwind design system tokens"
```

---

## Task 2: Types, Utilities & Mock Data

**Files:**
- Create: `lib/types.ts`, `lib/utils.ts`, `lib/mock-data.ts`
- Test: `lib/__tests__/utils.test.ts`

- [ ] **Step 1: Create type definitions**

Create `lib/types.ts` with all types from the spec: `User`, `Sauna`, `CheckIn`, `CollectionItemType`, `CollectionItemMeta`, `Collection`, `SaunaReview`, `Quest`, `CommunityPost`. Export all types. Use the exact definitions from the spec document.

- [ ] **Step 2: Create utility functions**

Create `lib/utils.ts`:

```typescript
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
```

- [ ] **Step 3: Write tests for utility functions**

Install vitest:

```bash
cd /Users/dada/PJ/saunago && npm install -D vitest
```

Create `lib/__tests__/utils.test.ts`:

```typescript
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
```

- [ ] **Step 4: Run tests**

Add to `package.json` scripts: `"test": "vitest run"`. Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname) },
  },
});
```

Then:

```bash
cd /Users/dada/PJ/saunago && npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Create mock data**

Create `lib/mock-data.ts` with all mock data per spec:
- 1 `currentUser` (level 7, XP 1720, "Hot Stone Master")
- 23 saunas (10 seoul, 8 gyeonggi, 5 jeju) with realistic Korean sauna names, addresses, categories. Use `https://picsum.photos/seed/{name}/400/300` for imageUrl.
- 6 check-ins for the current user (visited 6 of the 23 saunas)
- 3 quests with progress
- 5 community posts
- 10 `COLLECTION_ITEMS_META` entries with emoji and rarity
- 10 collection entries (5 unlocked, 5 locked)
- `saunaReviews` map: `Record<string, SaunaReview[]>` with 2-5 reviews per sauna

- [ ] **Step 6: Commit**

```bash
cd /Users/dada/PJ/saunago && git add lib/ package.json && git commit -m "feat: add types, utility functions with tests, and mock data"
```

---

## Task 3: Shared UI Components

**Files:**
- Create: `components/ui/ProgressBar.tsx`, `components/ui/Badge.tsx`, `components/ui/Chip.tsx`, `components/ui/StarRating.tsx`, `components/ui/BottomSheet.tsx`, `components/ui/Toast.tsx`, `components/ui/Skeleton.tsx`

- [ ] **Step 1: Create ProgressBar**

`components/ui/ProgressBar.tsx`: Accepts `percent` (0-100), `variant` ("primary" | "secondary"). Renders gradient bar. Primary: `from-primary-container to-primary-fixed`. Secondary: `from-secondary to-secondary-container`. Height 8px, `rounded-full`, `surface-container` track background. Animate width with `transition-all duration-500`.

- [ ] **Step 2: Create Badge**

`components/ui/Badge.tsx`: Accepts `variant` ("conquered" | "locked" | "host" | "level"), `children`. Conquered: `primary-container` bg, white text. Locked: `surface-container-high` bg. Host: `primary` bg. Level: `secondary-container` bg. All `rounded-full`, `text-label-md`.

- [ ] **Step 3: Create Chip**

`components/ui/Chip.tsx`: Accepts `active`, `children`, `onClick`. Active: `primary-container` bg + white text. Inactive: `surface-container-low` bg + `on-surface-variant` text. `rounded-full`, `px-4 py-2`, `text-body-md`.

- [ ] **Step 4: Create StarRating**

`components/ui/StarRating.tsx`: Accepts `value`, `onChange?`, `readonly?`. 5 stars. Interactive: tap to set. Display: filled stars in `primary-container`, empty in `surface-container-high`. Uses inline SVG star paths. Size 24px interactive, 16px display.

- [ ] **Step 5: Create BottomSheet**

`components/ui/BottomSheet.tsx`: Accepts `isOpen`, `onClose`, `title`, `children`. Overlay: `on-surface/30` bg. Sheet: `surface-container-lowest`, `rounded-t-2xl`, max 50vh. Drag handle bar at top (40px wide, 4px tall, `surface-container-high`). Close on overlay tap. Animate slide up/down with `transition-transform duration-300`.

- [ ] **Step 6: Create Toast**

`components/ui/Toast.tsx`: Accepts `message`, `isVisible`. Fixed bottom-center (above nav). `surface-container-lowest` bg, `shadow-ambient`, `rounded-2xl`. Auto-hide after 2s. Animate fade in/out.

- [ ] **Step 7: Create Skeleton**

`components/ui/Skeleton.tsx`: `Skeleton` component with `className` prop. Renders `surface-container` bg div with `animate-pulse`. Variants: `SkeletonText` (rounded bar), `SkeletonCard` (2xl rounded rect).

- [ ] **Step 8: Create EmptyState**

`components/ui/EmptyState.tsx`: Accepts `icon` (emoji string), `message` (string). Renders centered column: large emoji (48px), message in `text-body-lg text-on-surface-variant`, `py-16`. Usage examples: icon="🧖" message="아직 정복한 사우나가 없어요!", icon="📭" message="모집글이 없습니다", icon="🔍" message="일치하는 사우나가 없습니다".

- [ ] **Step 9: Verify components render**

Create a temporary test route or update home page to render each component. Verify visually in browser at localhost:3000.

- [ ] **Step 10: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/ui/ && git commit -m "feat: add shared UI components (ProgressBar, Badge, Chip, StarRating, BottomSheet, Toast, Skeleton, EmptyState)"
```

---

## Task 4: Bottom Navigation

**Files:**
- Create: `components/layout/BottomNav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create BottomNav component**

`components/layout/BottomNav.tsx`: `"use client"` component. 5 tabs using `next/link` and `usePathname()`. Tab items: Home (`/`), Community (`/community`), Check-in (`/check-in`), Map (`/map`), Profile (`/profile`). Icons as inline SVG (simple line icons). Center CHECK-IN button: `rounded-full`, `w-14 h-14`, gradient `from-primary-container to-primary-fixed`, `-mt-6` for upward protrusion, `shadow-ambient`. Nav bar: `fixed bottom-0`, `max-w-[390px]`, `bg-surface-container-low/80`, `backdrop-blur-[16px]`. Active tab: `text-primary` icon + label. Inactive: `text-on-surface-variant`.

- [ ] **Step 2: Add BottomNav to layout**

In `app/layout.tsx`, import and render `<BottomNav />` inside body, after `{children}`.

- [ ] **Step 3: Create stub pages for navigation**

Create minimal page files so navigation works:
- `app/map/page.tsx`: `<div className="p-6 pb-24"><h1 className="text-display-sm">정복 맵</h1></div>`
- `app/check-in/page.tsx`: same pattern with "체크인"
- `app/community/page.tsx`: same with "커뮤니티"
- `app/profile/page.tsx`: same with "마이페이지"

- [ ] **Step 4: Verify navigation**

Run dev server. Click each tab. Verify: active state changes, CHECK-IN FAB is visually prominent, glassmorphism blur works when scrolling content behind nav.

- [ ] **Step 5: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/layout/ app/ && git commit -m "feat: add floating bottom navigation with glassmorphism and FAB check-in button"
```

---

**Note on skeleton loading:** Each page (Tasks 5-10) should include a `loading` state initialized to `true`, with a `useEffect(() => { setTimeout(() => setLoading(false), 500) }, [])`. When `loading` is true, render `Skeleton` components matching the page layout. When false, render actual content. This simulates the spec's 0.5s skeleton requirement.

**Note on empty states:** Pages with filterable or potentially empty lists should render `EmptyState` when the filtered list is empty.

**Note on HeatMeter:** The spec lists a "Heat Meter" radial progress component. This is not used by any current page design, so it is intentionally omitted. It can be added later if needed.

**Note on images:** All images use external placeholder URLs (`https://picsum.photos/seed/{name}/400/300` for saunas). No local image files are needed. Avatars use initial-letter circles.

---

## Task 5: Home & Quest Page

**Files:**
- Create: `components/home/QuestCard.tsx`, `components/home/HotspotPreview.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create QuestCard component**

`components/home/QuestCard.tsx`: Accepts `quest: Quest`. Card with `surface-container` bg, `rounded-2xl`, `p-6`. Icon emoji at top with `-mt-10` for intentional asymmetry (breaks out of card). Quest title in `text-headline-md`. Description in `text-body-md text-on-surface-variant`. Progress chip (`Chip` component) showing `{current}/{target}`. XP reward label.

- [ ] **Step 2: Create HotspotPreview component**

`components/home/HotspotPreview.tsx`: Accepts `posts: CommunityPost[]`. Horizontal scroll container (`overflow-x-auto flex gap-4 pb-2`). Each card: `surface-container-lowest` bg, `rounded-2xl`, `min-w-[260px]`, host name, sauna name, spots info.

- [ ] **Step 3: Build the full Home page**

Update `app/page.tsx` as `"use client"`:

**Profile Section:** Avatar (placeholder circle with `primary-container` bg + initials), nickname, title badge, level number in `text-display-lg`. XP `ProgressBar` below.

**Today's Quest Section:** `text-display-sm` section title. 3 `QuestCard` components in vertical stack with `gap-8` (extra gap for icon overflow).

**Hotspots Section:** `surface-container-low` bg full-width section. `text-headline-md` title "Hotspots". `HotspotPreview` with mock community posts.

Import all data from `lib/mock-data.ts`.

- [ ] **Step 4: Verify home page**

Run dev server. Check: profile section shows level 7 + XP bar, 3 quest cards with overlapping icons, horizontal scroll hotspots. All typography correct. No 1px borders anywhere.

- [ ] **Step 5: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/home/ app/page.tsx && git commit -m "feat: implement home page with quest cards and hotspot previews"
```

---

## Task 6: Sauna Conquest Map Page

**Files:**
- Create: `components/map/RegionTabs.tsx`, `components/map/ConquestBar.tsx`, `components/map/SaunaCard.tsx`
- Modify: `app/map/page.tsx`

- [ ] **Step 1: Create RegionTabs**

`components/map/RegionTabs.tsx`: Horizontal scroll pill tabs. Accepts `regions`, `activeRegion`, `onChange`. Each tab is a `Chip` with active/inactive states. Container: `overflow-x-auto flex gap-3`, no scrollbar (`scrollbar-hide`).

- [ ] **Step 2: Create ConquestBar**

`components/map/ConquestBar.tsx`: Accepts `visited`, `total`, `percent`. Shows "3/10 정복" text in `text-headline-md` + `ProgressBar` (secondary variant).

- [ ] **Step 3: Create SaunaCard**

`components/map/SaunaCard.tsx`: Accepts `sauna: Sauna`, `isConquered: boolean`, `visitedAt?: string`, `onClick`. If conquered: color image, "Conquered" badge, visited date. If locked: grayscale image (`grayscale` CSS filter), lock icon overlay, "Locked" badge. Card: `rounded-2xl`, `overflow-hidden`, `surface-container-lowest` bg. Image 1:1 aspect ratio at top.

- [ ] **Step 4: Build the Map page**

Update `app/map/page.tsx` as `"use client"`. State: `activeRegion`, `loading`, `bottomSheetSaunaId`. Region tabs at top (All, Seoul, Gyeonggi, Jeju — "All" shows combined stats across regions). ConquestBar below tabs (filtered by region). 2-column grid of SaunaCards. Locked card tap opens BottomSheet with sauna reviews from `saunaReviews` mock data. Include skeleton loading (0.5s). If filtered region has zero saunas, show `EmptyState` with icon="🧖" message="이 지역에 등록된 사우나가 없어요!".

- [ ] **Step 5: Verify map page**

Run dev server, navigate to /map. Check: region tabs scroll horizontally, conquest bar updates on tab change, conquered cards show color images, locked cards show grayscale. Tap locked card → bottom sheet shows reviews.

- [ ] **Step 6: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/map/ app/map/ && git commit -m "feat: implement sauna conquest map with region tabs, conquest bar, and bottom sheet reviews"
```

---

## Task 7: Check-in Page

**Files:**
- Create: `components/check-in/SaunaSelector.tsx`, `components/check-in/RatingForm.tsx`, `components/check-in/ReviewInput.tsx`
- Modify: `app/check-in/page.tsx`

- [ ] **Step 1: Create SaunaSelector**

`components/check-in/SaunaSelector.tsx`: Search input (`surface-container-highest` bg, no border, `rounded-2xl`, focus: `shadow-focus-primary` + `bg-surface-container-lowest`). Client-side filter by name/address. List of matching saunas. "No results" empty state. Accepts `onSelect(saunaId)`.

- [ ] **Step 2: Create RatingForm**

`components/check-in/RatingForm.tsx`: 6 rating categories each with label + `StarRating` interactive. Labels: 온탕 만족도, 냉탕 만족도, 사우나 만족도, 청결도, 시설 만족도, 전반적 만족도. Accepts `ratings` state object + `onRatingChange`.

- [ ] **Step 3: Create ReviewInput**

`components/check-in/ReviewInput.tsx`: Two text inputs. "한줄평" (public, placeholder: "이 사우나를 한 마디로?") and "비밀 메모" (private, placeholder: "라커 번호, 꿀팁 등 나만 보기"). Same input styling as SaunaSelector. Accepts `review`, `note`, `onReviewChange`, `onNoteChange`.

- [ ] **Step 4: Build the Check-in page**

Update `app/check-in/page.tsx` as `"use client"`. Single scroll form with 3 sections:
- Step 1: SaunaSelector (visible initially, collapses to selected sauna chip after selection)
- Step 2: RatingForm (visible after sauna selected)
- Step 3: ReviewInput (visible after sauna selected)
- Submit button: full-width, gradient `from-primary-container to-primary-fixed`, `rounded-3xl`, `text-title-md text-white`. On submit:
  1. Generate ID: `const newId = Date.now().toString()`
  2. Build `CheckIn` object with all ratings, review, note, selected sauna ID, `visitedAt: new Date().toISOString().split('T')[0]`
  3. Store: `localStorage.setItem('saunago_last_checkin', JSON.stringify(checkIn))`
  4. Navigate: `router.push(\`/check-in/${newId}/result\`)`

- [ ] **Step 5: Verify check-in flow**

Run dev server, go to /check-in. Search for sauna → select → rate all 6 categories → write review → submit. Verify navigation to result page.

- [ ] **Step 6: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/check-in/ app/check-in/page.tsx && git commit -m "feat: implement check-in page with sauna search, rating form, and review input"
```

---

## Task 8: Certification Card Page

**Files:**
- Create: `app/check-in/[id]/result/page.tsx`

- [ ] **Step 1: Build the Certification Card page**

Create `app/check-in/[id]/result/page.tsx` as `"use client"`. Reads check-in data via `JSON.parse(localStorage.getItem('saunago_last_checkin'))` (falls back to first mock check-in if null). Look up the sauna name from mock data using `saunaId`. Renders:

**1:1 Card (centered, max 350x350px):**
- Top: sauna image as background with dark overlay gradient
- Overlay: user avatar + level badge + title
- Center: one-line review in `text-display-md`, white text, centered
- Bottom grid: 6 rating items with star icons + scores
- Footer: visited date in `text-label-sm`

**Below card:**
- "Share" button: full-width CTA, gradient, `rounded-3xl`. On click: `navigator.share()` if available, else copy current URL to clipboard + show Toast "링크가 복사되었습니다".
- "홈으로" secondary button: `secondary-container` bg, navigates to `/`.

- [ ] **Step 2: Verify certification card**

Navigate to `/check-in/test-1/result`. Check: 1:1 card renders correctly, ratings display, share button works (clipboard copy + toast on desktop).

- [ ] **Step 3: Commit**

```bash
cd /Users/dada/PJ/saunago && git add app/check-in/ && git commit -m "feat: implement certification card page with 1:1 share card and toast notification"
```

---

## Task 9: Community Page

**Files:**
- Create: `components/community/PostCard.tsx`
- Modify: `app/community/page.tsx`

- [ ] **Step 1: Create PostCard**

`components/community/PostCard.tsx`: Accepts `post: CommunityPost`, `even: boolean` (for river bg effect). Card shows: host nickname + HOST badge, sauna name + location chip, meet date, "Host + {remaining} Spots" capacity, "참여하기" button (`secondary-container` bg, `rounded-3xl`), chat icon. Background alternates: even → `surface`, odd → `surface-container-low`.

- [ ] **Step 2: Build Community page**

Update `app/community/page.tsx` as `"use client"`. State: `regionFilter`, `categoryFilter`, `loading`. Top: page title "같이 가요" in `text-display-sm`. Filter row: region chips + category chips (horizontal scroll, `scrollbar-hide`). Post list: `PostCard` components with alternating backgrounds. Include skeleton loading (0.5s). When filter matches nothing, show `EmptyState` with icon="📭" message="모집글이 없습니다".

- [ ] **Step 3: Verify community page**

Navigate to /community. Check: filters work, cards alternate background, HOST badge visible, capacity display correct.

- [ ] **Step 4: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/community/ app/community/ && git commit -m "feat: implement community page with filters and post cards"
```

---

## Task 10: Profile (My Page)

**Files:**
- Create: `components/profile/SaunaLog.tsx`, `components/profile/CollectionGrid.tsx`
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Create SaunaLog**

`components/profile/SaunaLog.tsx`: Accepts `checkIns: CheckIn[]`, `saunas: Sauna[]`. Timeline layout: left dotted line, each entry is a card with date, sauna name, overall rating stars, one-line review excerpt. `surface-container-lowest` cards on `surface` bg.

- [ ] **Step 2: Create CollectionGrid**

`components/profile/CollectionGrid.tsx`: Accepts `collections: Collection[]`, `meta: CollectionItemMeta[]`. 5-column grid. Unlocked items: emoji at full opacity + display name below. Locked items: emoji at 20% opacity + "???" text. Rare/legendary items get a subtle `tertiary` or `primary-container` glow ring.

- [ ] **Step 3: Build Profile page**

Update `app/profile/page.tsx` as `"use client"`:

**Profile Header:** Large avatar circle (64px, `primary-container` bg + initials), nickname in `text-headline-md`, title badge, level + XP progress bar.

**Recent Sauna Log:** `text-display-sm` section title. `SaunaLog` with user's check-ins. If no check-ins, show `EmptyState` icon="🧖" message="아직 방문한 사우나가 없어요!".

**Collection:** `text-display-sm` section title with count "5/10". `CollectionGrid`.

Include skeleton loading (0.5s) for the entire page.

- [ ] **Step 4: Verify profile page**

Navigate to /profile. Check: profile info matches mock user, timeline shows 6 visits, collection grid shows 5 colored + 5 silhouette items.

- [ ] **Step 5: Commit**

```bash
cd /Users/dada/PJ/saunago && git add components/profile/ app/profile/ && git commit -m "feat: implement profile page with sauna log timeline and collection grid"
```

---

## Task 11: Polish & Final Verification

**Files:**
- Modify: various files for polish

- [ ] **Step 1: Add page transitions and micro-interactions**

Add a `@keyframes fadeIn` animation in `globals.css` and a `.animate-fade-in` class (`animation: fadeIn 300ms ease-out`). Apply to page content wrappers. Add `transition-all duration-200` to interactive elements (buttons, chips, tabs). Add `active:scale-95` to tappable cards/buttons for press feedback.

- [ ] **Step 2: Verify all pages end-to-end**

Walk through every page:
1. Home: level, XP, quests, hotspots
2. Map: region switching, conquest bar, locked → bottom sheet
3. Check-in: search → select → rate → review → submit → result card
4. Result: 1:1 card, share button
5. Community: filters, post cards, river effect
6. Profile: info, timeline, collection

- [ ] **Step 3: Build check**

```bash
cd /Users/dada/PJ/saunago && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Final commit**

```bash
cd /Users/dada/PJ/saunago && git add -A && git commit -m "feat: add page transitions, skeleton loading, and final polish"
```
