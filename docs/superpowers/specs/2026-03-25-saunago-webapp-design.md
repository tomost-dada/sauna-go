# SAUNA GO Web App - Design Specification

## Overview

SAUNA GO는 사우나 애호가를 위한 게임화(Gamification) 기반 인증 및 커뮤니티 웹앱이다. 사용자는 사우나 방문을 기록하고, 지역별 정복 현황을 관리하며, 커뮤니티에서 동료를 찾고 성취를 공유한다.

### Scope

- **프론트엔드 프로토타입** (백엔드 없음, mock 데이터 사용)
- **모바일 전용** (390px 기준)
- **6개 페이지** 전체 구현

### Tech Stack

- Next.js 14+ (App Router)
- Tailwind CSS (디자인 시스템 토큰 직접 매핑)
- TypeScript
- Mock 데이터 (`/lib/mock-data.ts` 중앙 관리)

---

## Project Structure

```
saunago/
├── app/
│   ├── layout.tsx                     # 글로벌 레이아웃 (폰트, 하단 내비게이션)
│   ├── page.tsx                       # 홈 & 퀘스트
│   ├── map/page.tsx                   # 사우나 정복 맵
│   ├── check-in/page.tsx              # 체크인 (사우나 선택 → 평가)
│   ├── check-in/[id]/result/page.tsx  # 인증 카드
│   ├── community/page.tsx             # 커뮤니티
│   └── profile/page.tsx               # 마이페이지
├── components/
│   ├── layout/
│   │   └── BottomNav.tsx              # 플로팅 하단 내비게이션
│   ├── home/                          # 홈 전용 (QuestCard, HotspotPreview)
│   ├── map/                           # 맵 전용 (RegionTabs, SaunaCard, ConquestBar)
│   ├── check-in/                      # 체크인 전용 (StarRating, ReviewInput)
│   ├── community/                     # 커뮤니티 전용 (PostCard)
│   ├── profile/                       # 프로필 전용 (CollectionGrid, SaunaLog)
│   └── ui/                            # 공유 UI (ProgressBar, Badge, Chip, HeatMeter, BottomSheet, Toast)
├── lib/
│   ├── mock-data.ts                   # 모든 mock 데이터
│   ├── types.ts                       # TypeScript 타입 정의
│   └── utils.ts                       # XP 계산, 정복률 유틸리티
├── tailwind.config.ts                 # 디자인 시스템 토큰
└── public/
    └── images/                        # 사우나 이미지, 아이콘, 배지
```

---

## Design System (Tailwind Token Mapping)

### Colors

디자인 시스템 "The Radiant Ritual"의 토큰을 Tailwind에 매핑한다.

| Token | Value | Usage |
|---|---|---|
| `primary` | `#a13920` | 크리티컬 인터랙티브 상태 |
| `primary-container` | `#fe7d5e` | Level Up 모먼트, CTA |
| `secondary` | `#005f9b` | 프로그레스 트래커, 완료 상태 |
| `secondary-container` | `#b1d5ff` | 세컨더리 버튼 배경 |
| `tertiary` | `#803f9d` | 레어 배지, 엘더 상태 |
| `surface` | `#f8f9fa` | 메인 배경 |
| `surface-container-lowest` | `#ffffff` | 카드 배경 |
| `surface-container-low` | `#f0f2f4` | 글래스모피즘, 피드 교차 배경 |
| `surface-container` | `#e6e8ea` | 세컨더리 모듈 |
| `surface-container-high` | `#dcdfe1` | 네스트된 콘텐츠 |
| `surface-container-highest` | `#d2d5d8` | 인풋 필드 배경 |
| `primary-fixed` | `#ffb4a1` | 그라데이션 엔드포인트 (CTA, FAB) |
| `secondary-fixed-dim` | `#8abae0` | Progress Chip 배경 |
| `on-secondary-fixed` | `#003354` | Progress Chip 텍스트 |
| `on-surface` | `#2c2f30` | 텍스트 (순수 블랙 사용 금지) |
| `on-surface-variant` | `#6b6e70` | 세컨더리 텍스트 |
| `outline-variant` | `rgba(44, 47, 48, 0.15)` | 접근성 고스트 보더 |

### Typography

| Token | Font | Usage |
|---|---|---|
| `font-display` | Plus Jakarta Sans | 헤드라인, 레벨, 퀘스트 제목 |
| `font-body` | Be Vietnam Pro | 본문, 유틸리티, 네비게이션 |

### Typography Scale

| Token | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `display-lg` | Plus Jakarta Sans | 36px | 700 | 1.2 | 레벨 숫자, 퀘스트 제목 |
| `display-md` | Plus Jakarta Sans | 28px | 700 | 1.25 | 인증 카드 한줄평 강조 |
| `display-sm` | Plus Jakarta Sans | 24px | 600 | 1.3 | 섹션 제목 |
| `headline-md` | Plus Jakarta Sans | 20px | 600 | 1.35 | 카드 제목 |
| `title-md` | Be Vietnam Pro | 16px | 600 | 1.4 | 서브 타이틀 |
| `body-lg` | Be Vietnam Pro | 16px | 400 | 1.5 | 피드 콘텐츠, 본문 |
| `body-md` | Be Vietnam Pro | 14px | 400 | 1.5 | 일반 텍스트 |
| `label-md` | Be Vietnam Pro | 12px | 500 | 1.4 | uppercase, letter-spacing 0.05rem, 상태 태그 |
| `label-sm` | Be Vietnam Pro | 11px | 500 | 1.4 | 캡션, 날짜 |

### Core Rules

1. **No-Line Rule:** 1px 보더 금지. 배경색 변화로 영역 구분.
2. **Surface Hierarchy:** `surface-container-lowest` 카드 → `surface` 배경 위에 놓아 자연스러운 깊이 생성.
3. **Glass & Gradient:** CTA에 `primary` → `primary-container` 그라데이션. 플로팅 요소에 `backdrop-blur(12-20px)`.
4. **Ambient Shadows:** `box-shadow: 0 20px 40px rgba(44,47,48,0.06)`. 부드러운 글로우.
5. **Corner Radius:** 메인 컨테이너 `rounded-2xl` (2rem), 버튼 `rounded-3xl` (3rem), 칩 `rounded-full`.
6. **텍스트 색상:** 순수 블랙(#000) 금지 → `on-surface` (#2c2f30) 사용.

---

## Bottom Navigation

모든 페이지에서 하단 고정되는 글로벌 네비게이션.

- **5개 탭:** 홈 | 커뮤니티 | **CHECK-IN** | 맵 | 프로필
- **CHECK-IN 버튼:** 중앙 FAB 스타일. `primary-container` → `primary-fixed` 그라데이션. 다른 탭보다 위로 돌출 (네거티브 마진).
- **글래스 효과:** `surface-container-low` 80% opacity + `backdrop-blur(16px)`.
- **콘텐츠 영역:** `pb-24`로 네비게이션과 겹침 방지.

---

## Global UI States

프로토타입이므로 실제 네트워크 요청은 없지만, 완성도를 위해 다음 상태를 정의한다.

- **Loading:** 각 페이지 진입 시 0.5초 skeleton 표시. 카드는 `surface-container` 배경의 펄스 애니메이션 직사각형. 텍스트는 둥근 `surface-container-high` 바.
- **Empty:** 데이터가 없는 경우 중앙에 일러스트 아이콘 + 안내 문구. 예: 체크인 없을 때 "아직 정복한 사우나가 없어요!", 커뮤니티 필터 결과 없을 때 "모집글이 없습니다."
- **Error:** 프로토타입에서는 발생하지 않으므로 별도 구현 불필요.

---

## Components: BottomSheet

잠긴 사우나 카드 탭 시 나타나는 바텀시트.

- **높이:** 화면 50%.
- **배경:** `surface-container-lowest` + 상단 `rounded-2xl`.
- **오버레이:** `on-surface` 30% opacity 배경.
- **닫기:** 드래그 다운 또는 오버레이 탭.
- **내용:** 사우나 이름 + 타 사용자 한줄평 리스트 (최대 5개). 각 리뷰는 닉네임 + 별점 + 한줄평.

---

## Page Designs

### 1. 홈 & 퀘스트 (`/`)

**목적:** 현재 상태 확인 및 참여 유도.

- **프로필 섹션 (상단):** 아바타, 닉네임, 칭호(예: "Hot Stone Master"), 레벨 배지. XP 프로그레스 바는 `secondary` → `primary` 그라데이션.
- **오늘의 퀘스트 (중앙, 3개 슬롯):** 각각 `surface-container` 배경 카드. 아이콘이 카드 상단을 넘는 네거티브 마진 ("Intentional Asymmetry"). 진행 상태를 pill 형태 Progress Chip으로 표시.
- **Hotspots 미리보기 (하단):** 커뮤니티 인기글 2-3개, 수평 스크롤 카드. `surface-container-low` 배경으로 섹션 구분.

### 2. 사우나 정복 맵 (`/map`)

**목적:** 지역별 방문 기록 관리 및 정복 성취감.

- **지역 탭 (상단):** 수평 스크롤 pill 탭. 활성 탭은 `primary-container` 배경.
- **정복 진행률 바:** "3/10 정복" + 퍼센트 바 (`secondary` 그라데이션).
- **카드 리스트 (2열 그리드):**
  - **정복 완료:** 컬러 이미지 + "Conquered" 배지 + 방문 날짜.
  - **미정복 (잠금):** 흑백 이미지 + 자물쇠 아이콘 + "Locked". 탭 시 바텀시트로 타 사용자 한줄평 열람.

### 3. 체크인 (`/check-in`)

**목적:** 방문 기록 입력 및 평가.

- **플로우:** 단일 페이지 스크롤 형식 (Step 1 → Step 2 → Step 3 순서로 세로 배치).
  - **Step 1 - 사우나 선택:** 검색 바 (`surface-container-highest` 배경, 클라이언트 사이드 이름/주소 필터링) + 최근 방문 목록. 사우나 선택 시 Step 2로 스크롤.
  - **Step 2 - 별점 평가 (6개 항목, 각 5점):** 온탕, 냉탕, 사우나, 청결도, 시설, 전반적 만족도. `primary-container` 색상 별. 검색 결과 없을 시 "일치하는 사우나가 없습니다" 표시.
  - **Step 3 - 텍스트 입력:** 한줄평(공개) + 비밀 메모(비공개). `surface-container-highest` 배경, 포커스 시 `primary-container` ambient shadow.
- **제출 버튼:** `primary-container` → `primary-fixed` 그라데이션, 풀 와이드, `rounded-3xl`. 제출 후 `/check-in/[id]/result`로 이동.

### 4. 인증 카드 (`/check-in/[id]/result`)

**목적:** 평가 결과 요약 및 SNS 공유.

- **카드 비율:** 1:1 정사각형 (인스타그램 피드 최적화).
- **구성:** 사우나 이미지 상단 배경 + 사용자 배지 + 6개 별점 시각화 + 한줄평 중앙 강조 (`display-md`) + 방문 날짜.
- **공유 버튼:** "Share" CTA. `navigator.share()` 지원 시 네이티브 공유, 미지원 시 클립보드 복사 + 토스트 알림.

### 5. 커뮤니티 (`/community`)

**목적:** '같이 가요' 파트너 모집.

- **필터:** 위치 + 사우나 타입 pill 필터.
- **게시글 카드:** `surface-container-lowest` 배경. HOST 배지 (primary), 모집 정원 ("Host + 2 Spots"), "참여하기" 버튼, 채팅 아이콘.
- **카드 간 구분:** `surface` ↔ `surface-container-low` 배경 교차 ("river" 효과).

### 6. 마이페이지 (`/profile`)

**목적:** 개인 기록 및 아이템 수집함.

- **프로필 헤더:** 큰 아바타 + 닉네임 + 칭호 + 레벨/XP.
- **최근 사우나 로그:** 타임라인 형태. 날짜, 장소, 별점 요약.
- **컬렉션 그리드:** 획득 아이템은 컬러, 미획득은 실루엣. 배지도 동일 패턴.

---

## Mock Data Strategy

`/lib/mock-data.ts`에서 모든 데이터를 중앙 관리한다.

- **사용자:** 레벨 7, 누적 XP 1720, 다음 레벨까지 380/450 진행 (Level 8 = 2100), 칭호 "Hot Stone Master", 컬렉션 아이템 5개 보유.
- **사우나:** 서울 10곳, 경기 8곳, 제주 5곳. 각각 이름, 주소, 카테고리, 이미지 URL, 정복 인원.
- **체크인:** 사용자가 방문한 사우나 6곳에 대한 별점/리뷰 데이터.
- **퀘스트:** 3개 (전통 핀란드 사우나 방문 2/3, 주간 탐험가 1/5, 열기 공유 0/1).
- **커뮤니티:** 모집글 5개 (호스트, 위치, 정원, 참여 현황).
- **컬렉션:** 전체 아이템 10개 중 5개 획득. `CollectionItemMeta[]` 상수로 10개 아이템의 displayName, emoji, rarity 정의.
- **사우나 리뷰 (바텀시트용):** 각 사우나별 타 사용자 `SaunaReview[]` 2-5개 제공.

## Utility Functions

- `calculateXP(checkIn)`: 체크인 기반 XP 계산 (기본 100 + 한줄평 20 + 첫방문 50).
- `calculateConquestRate(region, userCheckIns)`: 지역별 정복률 계산.
- `getLevelFromXP(xp)`: XP 기반 레벨 산출. 레벨 테이블은 아래 참조.

### Level Thresholds

| Level | 필요 누적 XP | 칭호 |
|---|---|---|
| 1 | 0 | Newbie Steamer |
| 2 | 150 | Warm Beginner |
| 3 | 350 | Bath Explorer |
| 4 | 600 | Heat Seeker |
| 5 | 900 | Sauna Regular |
| 6 | 1250 | Steam Veteran |
| 7 | 1650 | Hot Stone Master |
| 8 | 2100 | Sauna Conqueror |
| 9 | 2600 | Legendary Bather |
| 10 | 3200 | Grand Sauna Elder |

각 레벨의 XP 프로그레스 바는 `(현재 XP - 현재 레벨 시작 XP) / (다음 레벨 시작 XP - 현재 레벨 시작 XP) * 100`으로 계산.

---

## Type Definitions

```typescript
type User = {
  id: string;
  nickname: string;
  email: string;
  level: number;
  xp: number;
  title: string;
  profileImgUrl: string;
  createdAt: string;
};

type Sauna = {
  id: string;
  name: string;
  address: string;
  region: 'seoul' | 'gyeonggi' | 'jeju';
  category: 'finnish' | 'bulgama' | 'hotel' | 'jjimjilbang';
  locationLat: number;
  locationLng: number;
  description: string;
  imageUrl: string;
  totalConqueredCount: number;
};

type CheckIn = {
  id: string;
  userId: string;
  saunaId: string;
  ratingHotTub: number;
  ratingColdTub: number;
  ratingSauna: number;
  ratingCleanliness: number;
  ratingFacility: number;
  ratingOverall: number;
  oneLineReview: string;
  privateNote: string;
  visitedAt: string;
  createdAt: string;
};

type CollectionItemType = 'wooden_bucket' | 'scented_oil' | 'luxury_robe' | 'sauna_hat' | 'towel_set' | 'thermometer' | 'birch_whisk' | 'sand_timer' | 'steam_stone' | 'ice_bucket';

type CollectionItemMeta = {
  itemType: CollectionItemType;
  displayName: string;
  emoji: string;          // 프로토타입에서 이미지 대신 이모지 사용
  rarity: 'common' | 'rare' | 'legendary';
};

type Collection = {
  id: string;
  userId: string;
  itemType: CollectionItemType;
  unlockedAt: string | null;
};

// 바텀시트에서 사용되는 타 사용자 리뷰
type SaunaReview = {
  nickname: string;
  title: string;
  ratingOverall: number;
  oneLineReview: string;
  visitedAt: string;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  xpReward: number;
};

type CommunityPost = {
  id: string;
  hostId: string;
  hostNickname: string;
  hostTitle: string;
  saunaId: string;
  saunaName: string;
  region: Sauna['region'];
  category: Sauna['category'];
  maxSpots: number;
  currentSpots: number;
  meetDate: string;
  description: string;
  createdAt: string;
};
```
