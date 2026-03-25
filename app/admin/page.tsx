"use client";

import { useState } from "react";
import Link from "next/link";
import { saunas, currentUser, communityPosts, COLLECTION_ITEMS_META } from "@/lib/mock-data";
import { LEVEL_THRESHOLDS } from "@/lib/utils";

const TABS = [
  { key: "sauna", label: "사우나", icon: "🧖", count: saunas.length },
  { key: "user", label: "유저", icon: "👤", count: 1 },
  { key: "community", label: "커뮤니티", icon: "💬", count: communityPosts.length },
  { key: "level", label: "레벨", icon: "⚡", count: LEVEL_THRESHOLDS.length },
  { key: "item", label: "아이템", icon: "🎒", count: COLLECTION_ITEMS_META.length },
];

const REGION_LABELS: Record<string, string> = { seoul: "서울", gyeonggi: "경기", jeju: "제주" };
const CATEGORY_LABELS: Record<string, string> = { finnish: "핀란드식", bulgama: "불가마", hotel: "호텔 스파", jjimjilbang: "찜질방" };

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("sauna");
  const [levelData, setLevelData] = useState<{ level: number; xp: number; title: string }[]>(
    LEVEL_THRESHOLDS.map((t) => ({ level: t.level, xp: t.xp, title: t.title }))
  );
  const [itemData, setItemData] = useState(
    COLLECTION_ITEMS_META.map((m) => ({ ...m }))
  );

  return (
    <div className="flex min-h-screen bg-surface-container-low" style={{ fontFamily: "var(--font-body)" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest shrink-0 flex flex-col" style={{ boxShadow: "1px 0 0 var(--color-surface-container)" }}>
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary-bold flex items-center justify-center shadow-glow-primary">
              <span className="text-white text-lg">🔥</span>
            </div>
            <div>
              <h1 className="text-headline-md text-on-surface">SAUNA GO</h1>
              <p className="text-label-sm text-on-surface-variant">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all text-left ${
                activeTab === tab.key
                  ? "bg-primary-container/15 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-title-md flex-1">{tab.label}</span>
              <span className={`text-label-sm px-2 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-primary-container/20 text-primary"
                  : "bg-surface-container text-on-surface-variant"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>

        {/* Back to app */}
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container-low transition-all text-body-md"
          >
            ← 앱으로 돌아가기
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top header */}
        <header className="gradient-primary-bold px-8 py-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-label-md text-white/60 tracking-widest">DATABASE MANAGEMENT</p>
              <h2 className="text-display-sm text-white mt-1">
                {TABS.find((t) => t.key === activeTab)?.icon}{" "}
                {TABS.find((t) => t.key === activeTab)?.label} DB
              </h2>
            </div>
            {/* Summary stats */}
            <div className="flex gap-4">
              {TABS.map((tab) => (
                <div
                  key={tab.key}
                  className={`px-4 py-2 rounded-2xl text-center transition-all cursor-pointer ${
                    activeTab === tab.key ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <p className="text-headline-md text-white">{tab.count}</p>
                  <p className="text-label-sm text-white/60">{tab.label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="p-8 animate-fade-in">
          {activeTab === "sauna" && <SaunaTable />}
          {activeTab === "user" && <UserTable />}
          {activeTab === "community" && <CommunityTable />}
          {activeTab === "level" && <LevelTable data={levelData} onChange={setLevelData} />}
          {activeTab === "item" && <ItemTable data={itemData} onChange={setItemData} />}
        </div>
      </main>
    </div>
  );
}

/* ─── Table Header ─── */
function TableHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-display-sm text-on-surface">{title}</h2>
        <span className="px-3 py-1 rounded-full bg-primary-container/15 text-label-md text-primary">
          {count}건
        </span>
      </div>
      <button
        onClick={onAdd}
        className="px-6 py-2.5 rounded-3xl gradient-primary text-white text-body-md font-semibold shadow-glow-primary active:scale-[0.97] transition-all"
      >
        + 새로 추가
      </button>
    </div>
  );
}

/* ─── Sauna DB ─── */
function SaunaTable() {
  return (
    <>
      <TableHeader title="사우나 관리" count={saunas.length} onAdd={() => alert("사우나 추가 (프로토타입)")} />
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">이름</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">주소</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">지역</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">카테고리</th>
              <th className="text-right text-label-md text-on-surface-variant px-5 py-3">정복 수</th>
              <th className="text-right text-label-md text-on-surface-variant px-5 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {saunas.map((s, i) => (
              <tr
                key={s.id}
                className="transition-colors hover:bg-surface-container-low/50 animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 20, 200)}ms`, borderBottom: "1px solid var(--color-surface-container-low)" }}
              >
                <td className="px-5 py-4">
                  <p className="text-title-md text-on-surface">{s.name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-body-md text-on-surface-variant">{s.address}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                    {REGION_LABELS[s.region]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                    {CATEGORY_LABELS[s.category]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-title-md text-secondary">{s.totalConqueredCount}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-label-md text-primary hover:text-primary-container transition-colors">편집</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─── User DB ─── */
function UserTable() {
  const u = currentUser;
  return (
    <>
      <TableHeader title="유저 관리" count={1} onAdd={() => alert("유저 추가 (프로토타입)")} />
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">프로필</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">이메일</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">레벨</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">XP</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">칭호</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">가입일</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-label-md font-bold shadow-glow-primary">
                    {u.nickname.charAt(0)}
                  </div>
                  <span className="text-title-md text-on-surface">{u.nickname}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-body-md text-on-surface-variant">{u.email}</td>
              <td className="px-5 py-4">
                <span className="px-2.5 py-1 rounded-full bg-primary-container/15 text-label-md text-primary">Lv. {u.level}</span>
              </td>
              <td className="px-5 py-4 text-title-md text-secondary">{u.xp} XP</td>
              <td className="px-5 py-4">
                <span className="px-2.5 py-1 rounded-full bg-secondary-container/30 text-label-md text-secondary">{u.title}</span>
              </td>
              <td className="px-5 py-4 text-body-md text-on-surface-variant">
                {new Date(u.createdAt).toLocaleDateString("ko-KR")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─── Community DB ─── */
function CommunityTable() {
  return (
    <>
      <TableHeader title="커뮤니티 관리" count={communityPosts.length} onAdd={() => alert("게시글 추가 (프로토타입)")} />
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">호스트</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">사우나</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">지역</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">카테고리</th>
              <th className="text-center text-label-md text-on-surface-variant px-5 py-3">정원</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">모임일</th>
              <th className="text-right text-label-md text-on-surface-variant px-5 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {communityPosts.map((p, i) => (
              <tr
                key={p.id}
                className="hover:bg-surface-container-low/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 40}ms`, borderBottom: "1px solid var(--color-surface-container-low)" }}
              >
                <td className="px-5 py-4 text-title-md text-on-surface">{p.hostNickname}</td>
                <td className="px-5 py-4 text-body-md text-on-surface">{p.saunaName}</td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                    {REGION_LABELS[p.region]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-title-md text-primary">{p.currentSpots}</span>
                  <span className="text-body-md text-on-surface-variant">/{p.maxSpots}</span>
                </td>
                <td className="px-5 py-4 text-body-md text-on-surface-variant">{p.meetDate}</td>
                <td className="px-5 py-4 text-right">
                  <button className="text-label-md text-primary hover:text-primary-container transition-colors">편집</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <TableHeader title="레벨 설정" count={data.length} onAdd={() => alert("레벨 추가 (프로토타입)")} />
      <p className="text-body-lg text-on-surface-variant mb-6">XP 기준값과 칭호를 직접 수정할 수 있습니다. 변경 시 실시간 반영됩니다.</p>
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="text-center text-label-md text-on-surface-variant px-5 py-3 w-20">레벨</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3 w-40">필요 XP</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">칭호</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3 w-40">XP 구간</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const nextXp = i < data.length - 1 ? data[i + 1].xp : "MAX";
              return (
                <tr
                  key={row.level}
                  className="hover:bg-surface-container-low/50 transition-colors"
                  style={{ borderBottom: "1px solid var(--color-surface-container-low)" }}
                >
                  <td className="px-5 py-3 text-center">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-label-md font-bold mx-auto">
                      {row.level}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      value={row.xp}
                      onChange={(e) => updateRow(i, "xp", e.target.value)}
                      className="bg-surface-container-highest/40 rounded-xl px-4 py-2 text-body-md text-on-surface outline-none w-28 focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) => updateRow(i, "title", e.target.value)}
                      className="bg-surface-container-highest/40 rounded-xl px-4 py-2 text-body-md text-on-surface outline-none w-full max-w-xs focus:bg-surface-container-lowest focus:shadow-focus-primary transition-all"
                    />
                  </td>
                  <td className="px-5 py-3 text-body-md text-on-surface-variant">
                    {row.xp} ~ {nextXp}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
      <TableHeader title="아이템 설정" count={data.length} onAdd={() => alert("아이템 추가 (프로토타입)")} />
      <p className="text-body-lg text-on-surface-variant mb-6">아이템의 레어리티를 변경할 수 있습니다.</p>
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="text-center text-label-md text-on-surface-variant px-5 py-3 w-16">아이콘</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">이름</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3">타입 ID</th>
              <th className="text-left text-label-md text-on-surface-variant px-5 py-3 w-40">레어리티</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr
                key={item.itemType}
                className="hover:bg-surface-container-low/50 transition-colors"
                style={{ borderBottom: "1px solid var(--color-surface-container-low)" }}
              >
                <td className="px-5 py-3 text-center text-2xl">{item.emoji}</td>
                <td className="px-5 py-3 text-title-md text-on-surface">{item.displayName}</td>
                <td className="px-5 py-3 text-body-md text-on-surface-variant font-mono">{item.itemType}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${
                      item.rarity === "legendary" ? "bg-primary-container" :
                      item.rarity === "rare" ? "bg-tertiary" :
                      "bg-surface-container-high"
                    }`} />
                    <select
                      value={item.rarity}
                      onChange={(e) => updateRarity(i, e.target.value)}
                      className="bg-surface-container-highest/40 rounded-xl px-4 py-2 text-body-md text-on-surface outline-none focus:shadow-focus-primary transition-all cursor-pointer"
                    >
                      <option value="common">일반 (Common)</option>
                      <option value="rare">레어 (Rare)</option>
                      <option value="legendary">전설 (Legendary)</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
