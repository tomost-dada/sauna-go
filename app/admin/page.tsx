"use client";

import { useState } from "react";
import Link from "next/link";
import { saunas, currentUser, communityPosts, COLLECTION_ITEMS_META } from "@/lib/mock-data";
import { LEVEL_THRESHOLDS } from "@/lib/utils";
import Chip from "@/components/ui/Chip";

const TABS = [
  { key: "sauna", label: "🧖 사우나", count: saunas.length },
  { key: "user", label: "👤 유저", count: 1 },
  { key: "community", label: "💬 커뮤니티", count: communityPosts.length },
  { key: "level", label: "⚡ 레벨", count: LEVEL_THRESHOLDS.length },
  { key: "item", label: "🎒 아이템", count: COLLECTION_ITEMS_META.length },
];

const REGION_LABELS: Record<string, string> = { seoul: "서울", gyeonggi: "경기", jeju: "제주" };
const CATEGORY_LABELS: Record<string, string> = { finnish: "핀란드식", bulgama: "불가마", hotel: "호텔", jjimjilbang: "찜질방" };
const RARITY_LABELS: Record<string, string> = { common: "일반", rare: "레어", legendary: "전설" };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("sauna");
  const [levelData, setLevelData] = useState<{ level: number; xp: number; title: string }[]>(
    LEVEL_THRESHOLDS.map((t) => ({ level: t.level, xp: t.xp, title: t.title }))
  );
  const [itemData, setItemData] = useState(
    COLLECTION_ITEMS_META.map((m) => ({ ...m }))
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="gradient-primary-bold px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label-md text-white/60 tracking-widest">ADMIN</p>
            <h1 className="text-display-sm text-white mt-1">SAUNA GO</h1>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-white/20 text-white text-label-md backdrop-blur-sm"
          >
            ← 앱으로
          </Link>
        </div>
        {/* Stats */}
        <div className="flex gap-3 mt-5">
          {TABS.map((tab) => (
            <div key={tab.key} className="flex-1 bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className="text-display-sm text-white">{tab.count}</p>
              <p className="text-label-sm text-white/60 mt-0.5">{tab.label.split(" ")[1]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 overflow-x-auto flex gap-2 scrollbar-hide">
        {TABS.map((tab) => (
          <Chip
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Chip>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 pb-8 animate-fade-in">
        {activeTab === "sauna" && <SaunaTable />}
        {activeTab === "user" && <UserTable />}
        {activeTab === "community" && <CommunityTable />}
        {activeTab === "level" && (
          <LevelTable data={levelData} onChange={setLevelData} />
        )}
        {activeTab === "item" && (
          <ItemTable data={itemData} onChange={setItemData} />
        )}
      </div>
    </div>
  );
}

/* ─── Table Header ─── */
function TableHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-headline-md text-on-surface">{title}</h2>
        <span className="px-2.5 py-1 rounded-full bg-primary-container/15 text-label-md text-primary">
          {count}
        </span>
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2 rounded-3xl gradient-primary text-white text-label-md shadow-glow-primary active:scale-[0.97] transition-all"
      >
        + 추가
      </button>
    </div>
  );
}

/* ─── Sauna DB ─── */
function SaunaTable() {
  return (
    <>
      <TableHeader title="사우나 DB" count={saunas.length} onAdd={() => alert("사우나 추가 (프로토타입)")} />
      <div className="flex flex-col gap-3">
        {saunas.map((s, i) => (
          <div key={s.id} className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm animate-fade-in" style={{ animationDelay: `${Math.min(i * 30, 200)}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-title-md text-on-surface truncate">{s.name}</p>
                <p className="text-body-md text-on-surface-variant mt-0.5 truncate">{s.address}</p>
              </div>
              <button className="text-label-sm text-primary ml-2 shrink-0">편집</button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                {REGION_LABELS[s.region]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                {CATEGORY_LABELS[s.category]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-label-sm text-secondary">
                🏔️ {s.totalConqueredCount}명
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── User DB ─── */
function UserTable() {
  const u = currentUser;
  return (
    <>
      <TableHeader title="유저 DB" count={1} onAdd={() => alert("유저 추가 (프로토타입)")} />
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white text-headline-md font-bold shadow-glow-primary">
            {u.nickname.charAt(0)}
          </div>
          <div>
            <p className="text-headline-md text-on-surface">{u.nickname}</p>
            <p className="text-body-md text-on-surface-variant">{u.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "레벨", value: `Lv. ${u.level}` },
            { label: "XP", value: `${u.xp} XP` },
            { label: "칭호", value: u.title },
            { label: "가입일", value: new Date(u.createdAt).toLocaleDateString("ko-KR") },
          ].map((item) => (
            <div key={item.label} className="bg-surface-container-low rounded-2xl p-3">
              <p className="text-label-sm text-on-surface-variant">{item.label}</p>
              <p className="text-title-md text-on-surface mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Community DB ─── */
function CommunityTable() {
  return (
    <>
      <TableHeader title="커뮤니티 DB" count={communityPosts.length} onAdd={() => alert("게시글 추가 (프로토타입)")} />
      <div className="flex flex-col gap-3">
        {communityPosts.map((p, i) => (
          <div key={p.id} className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-title-md text-on-surface">{p.saunaName}</p>
                <p className="text-body-md text-on-surface-variant mt-0.5">호스트: {p.hostNickname}</p>
              </div>
              <button className="text-label-sm text-primary shrink-0">편집</button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                {REGION_LABELS[p.region]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                {CATEGORY_LABELS[p.category]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-container/15 text-label-sm text-primary">
                {p.currentSpots}/{p.maxSpots}명
              </span>
              <span className="text-label-sm text-on-surface-variant">
                📅 {p.meetDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Level DB (editable) ─── */
function LevelTable({
  data,
  onChange,
}: {
  data: { level: number; xp: number; title: string }[];
  onChange: (d: { level: number; xp: number; title: string }[]) => void;
}) {
  const updateRow = (index: number, field: "xp" | "title", value: string) => {
    const next = [...data];
    if (field === "xp") {
      next[index] = { ...next[index], xp: parseInt(value) || 0 };
    } else {
      next[index] = { ...next[index], title: value };
    }
    onChange(next);
  };

  return (
    <>
      <TableHeader title="레벨 DB" count={data.length} onAdd={() => alert("레벨 추가 (프로토타입)")} />
      <p className="text-body-md text-on-surface-variant mb-4">XP 기준값과 칭호를 직접 수정할 수 있습니다.</p>
      <div className="flex flex-col gap-2">
        {data.map((row, i) => (
          <div key={row.level} className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm flex items-center gap-3">
            {/* Level badge */}
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-label-md font-bold shrink-0">
              {row.level}
            </div>
            {/* Editable fields */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-label-sm text-on-surface-variant w-8 shrink-0">XP</span>
                <input
                  type="number"
                  value={row.xp}
                  onChange={(e) => updateRow(i, "xp", e.target.value)}
                  className="bg-surface-container-highest/60 rounded-xl px-3 py-1.5 text-body-md text-on-surface outline-none w-20 focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-label-sm text-on-surface-variant w-8 shrink-0">칭호</span>
                <input
                  type="text"
                  value={row.title}
                  onChange={(e) => updateRow(i, "title", e.target.value)}
                  className="bg-surface-container-highest/60 rounded-xl px-3 py-1.5 text-body-md text-on-surface outline-none flex-1 focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Item DB (editable rarity) ─── */
function ItemTable({
  data,
  onChange,
}: {
  data: { itemType: string; displayName: string; emoji: string; rarity: string }[];
  onChange: (d: any[]) => void;
}) {
  const updateRarity = (index: number, rarity: string) => {
    const next = [...data];
    next[index] = { ...next[index], rarity };
    onChange(next);
  };

  return (
    <>
      <TableHeader title="아이템 DB" count={data.length} onAdd={() => alert("아이템 추가 (프로토타입)")} />
      <p className="text-body-md text-on-surface-variant mb-4">레어리티를 변경할 수 있습니다.</p>
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={item.itemType} className="bg-surface-container-lowest rounded-2xl p-4 shadow-ambient-sm flex items-center gap-4">
            {/* Emoji */}
            <span className="text-3xl">{item.emoji}</span>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-title-md text-on-surface">{item.displayName}</p>
              <p className="text-label-sm text-on-surface-variant mt-0.5">{item.itemType}</p>
            </div>
            {/* Rarity dropdown */}
            <select
              value={item.rarity}
              onChange={(e) => updateRarity(i, e.target.value)}
              className="bg-surface-container-highest/60 rounded-xl px-3 py-1.5 text-body-md text-on-surface outline-none focus:shadow-focus-primary transition-all appearance-none cursor-pointer"
            >
              <option value="common">일반</option>
              <option value="rare">레어</option>
              <option value="legendary">전설</option>
            </select>
            {/* Rarity indicator */}
            <span className={`w-3 h-3 rounded-full shrink-0 ${
              item.rarity === "legendary" ? "bg-primary-container" :
              item.rarity === "rare" ? "bg-tertiary" :
              "bg-surface-container-high"
            }`} />
          </div>
        ))}
      </div>
    </>
  );
}
