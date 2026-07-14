"use client";

import type { CSSProperties, ReactNode } from "react";
import { BookBuddy, Button, Icon, TopBar } from "../ds";
import type { Character } from "../ds";
import type { ShelfItem } from "./Library";

/**
 * 홈 (Home) — customize your reading buddy. Pick a character (북버디/오리/토마토),
 * a theme color, and dress it with clothes + accessories that unlock as you read.
 * Items share one cohesive knit palette and are fitted per-character (hats sit
 * lower and clothes narrow on the round duck/tomato). See DESIGN.md §11.6.
 */

export interface Customize {
  character: Character;
  theme: string;
  outfit: string; // accessory (소품)
  clothes: string; // 옷
}

type Slot = "face" | "neck" | "hat" | "body";
interface Item {
  id: string;
  name: string;
  unlockAt: number;
  slot: Slot;
  art: ReactNode | null;
}

// ── cohesive "knit" wardrobe palette (literal — shared across all items) ──
const WOOL = "#E2895A";
const WOOL_D = "#BE6A3C";
const CREAM = "#F2E7CE";
const FRAME = "#5A4636";

const CHARACTERS: { id: Character; name: string }[] = [
  { id: "book", name: "북버디" },
  { id: "duck", name: "오리" },
  { id: "tomato", name: "토마토" },
];

export const THEMES: { id: string; name: string; brand: string; hover: string; active: string; soft: string; tint: string }[] = [
  { id: "sage", name: "세이지", brand: "#4FA557", hover: "#3E8C46", active: "#2E7238", soft: "#B7DCA6", tint: "#EDF4E8" },
  { id: "ocean", name: "바다", brand: "#3E8DC4", hover: "#3576A6", active: "#2B5E88", soft: "#AFD2EC", tint: "#E6F1F9" },
  { id: "coral", name: "코랄", brand: "#E56A5E", hover: "#CC564B", active: "#A8433A", soft: "#F5C3BD", tint: "#FCEAE7" },
  { id: "grape", name: "포도", brand: "#8A6BC0", hover: "#7455A8", active: "#5C4488", soft: "#D4C6EA", tint: "#EEE9F7" },
];

export const ACCESSORIES: Item[] = [
  { id: "none", name: "없음", unlockAt: 0, slot: "face", art: null },
  { id: "bow", name: "리본", unlockAt: 1, slot: "neck", art: <Bow /> },
  { id: "glasses", name: "안경", unlockAt: 3, slot: "face", art: <Glasses /> },
  { id: "beret", name: "베레모", unlockAt: 6, slot: "hat", art: <Beret /> },
  { id: "crown", name: "왕관", unlockAt: 10, slot: "hat", art: <Crown /> },
];

export const CLOTHES: Item[] = [
  { id: "none", name: "없음", unlockAt: 0, slot: "body", art: null },
  { id: "scarf", name: "목도리", unlockAt: 2, slot: "neck", art: <Scarf /> },
  { id: "sweater", name: "스웨터", unlockAt: 4, slot: "body", art: <Sweater /> },
  { id: "apron", name: "앞치마", unlockAt: 7, slot: "body", art: <Apron /> },
];

// Per-character fit: round duck/tomato need hats lower and clothes narrower.
// CSS transforms about a view-box origin so scaling stays centered.
const FIT: Record<Exclude<Character, "book">, Partial<Record<Slot, CSSProperties>>> = {
  duck: {
    hat: { transform: "translateY(10px) scale(0.9)", transformOrigin: "34px 8px" },
    neck: { transform: "translateY(3px)", transformOrigin: "45px 84px" },
    body: { transform: "translateY(4px) scaleX(0.82)", transformOrigin: "46px 82px" },
  },
  tomato: {
    hat: { transform: "translateY(16px) scale(0.88)", transformOrigin: "34px 8px" },
    neck: { transform: "translateY(4px)", transformOrigin: "45px 84px" },
    body: { transform: "translateY(5px) scaleX(0.82)", transformOrigin: "46px 82px" },
  },
};

function fitStyle(character: Character, slot: Slot): CSSProperties | undefined {
  if (character === "book") return undefined;
  const s = FIT[character][slot];
  return s ? { transformBox: "view-box", ...s } : undefined;
}

export function Home({
  items,
  custom,
  onSet,
  onSearch,
  onLogout,
}: {
  items: ShelfItem[];
  custom: Customize;
  onSet: (patch: Partial<Customize>) => void;
  onSearch: () => void;
  onLogout: () => void;
}) {
  const count = items.length;
  const outfit = ACCESSORIES.find((a) => a.id === custom.outfit && count >= a.unlockAt)?.id ?? "none";
  const clothes = CLOTHES.find((c) => c.id === custom.clothes && count >= c.unlockAt)?.id ?? "none";
  const nextLocked = [...CLOTHES, ...ACCESSORIES].filter((i) => count < i.unlockAt).sort((a, b) => a.unlockAt - b.unlockAt)[0];

  return (
    <>
      <div style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--divider)", zIndex: 20 }}>
        <TopBar wordmark actions={[{ icon: "log-out", label: "로그아웃", onClick: onLogout }]} />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 20px 24px" }}>
        <div style={{ fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-strong)", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
          오늘은 어떤 책을
          <br />읽으셨나요?
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "var(--text-body)", color: "var(--text-muted)" }}>
          {count > 0 ? `지금까지 ${count}권 읽었어요` : "책을 읽고 친구를 꾸며보세요"}
        </p>

        {/* stage */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 2px" }}>
          <div style={{ position: "relative", width: 184, height: 184, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--brand-tint)" }} />
            <div style={{ position: "absolute", bottom: 30, width: 120, height: 16, borderRadius: "50%", background: "color-mix(in srgb, var(--text-strong) 8%, transparent)" }} />
            <DressedBuddy character={custom.character} outfit={outfit} clothes={clothes} size={132} />
          </div>
        </div>

        {/* next-unlock teaser */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 2, marginBottom: 18 }}>
          <span style={pill}>
            {nextLocked ? (
              <>
                <Icon name="lock" size={14} color="var(--text-subtle)" />
                {`${nextLocked.unlockAt - count}권 더 읽으면 '${nextLocked.name}'`}
              </>
            ) : (
              <>
                <Icon name="check" size={14} color="var(--brand)" />
                다 모았어요!
              </>
            )}
          </span>
        </div>

        {/* 캐릭터 */}
        <SectionTitle>캐릭터</SectionTitle>
        <Row cols={3}>
          {CHARACTERS.map((c) => (
            <Tile key={c.id} selected={custom.character === c.id} onClick={() => onSet({ character: c.id })} label={c.name}>
              <BookBuddy character={c.id} size={44} blink={false} bookmark={false} />
            </Tile>
          ))}
        </Row>

        {/* 테마 색 */}
        <SectionTitle>테마 색</SectionTitle>
        <Row cols={4}>
          {THEMES.map((t) => {
            const sel = custom.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSet({ theme: t.id })}
                aria-label={`${t.name} 테마`}
                style={{ ...tileBase(sel), gap: 5 }}
              >
                <span style={{ width: 34, height: 34, borderRadius: "50%", background: t.brand, boxShadow: "var(--shadow-xs)" }} />
                <span style={tileLabel(true)}>{t.name}</span>
              </button>
            );
          })}
        </Row>

        {/* 옷 */}
        <SectionTitle>옷</SectionTitle>
        <Row cols={4}>
          {CLOTHES.map((c) => (
            <ItemTile key={c.id} item={c} count={count} selected={c.id === clothes} character={custom.character} slot="clothes" other={outfit} onClick={() => onSet({ clothes: c.id })} />
          ))}
        </Row>

        {/* 소품 */}
        <SectionTitle>소품</SectionTitle>
        <Row cols={4}>
          {ACCESSORIES.map((a) => (
            <ItemTile key={a.id} item={a} count={count} selected={a.id === outfit} character={custom.character} slot="outfit" other={clothes} onClick={() => onSet({ outfit: a.id })} />
          ))}
        </Row>

        <div style={{ marginTop: 20 }}>
          <Button variant="primary" size="lg" block iconLeft="plus" onClick={onSearch}>
            오늘 읽은 책 담기
          </Button>
        </div>
      </div>
    </>
  );
}

const pill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 14px",
  background: "var(--surface-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-pill)",
  boxShadow: "var(--shadow-xs)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--fw-semibold)",
  color: "var(--text-body)",
};

const tileBase = (sel: boolean): CSSProperties => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  padding: "10px 4px 8px",
  background: sel ? "var(--brand-tint)" : "var(--surface-card)",
  border: `${sel ? 2 : 1}px solid ${sel ? "var(--brand)" : "var(--border)"}`,
  borderRadius: "var(--radius-md)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
});
const tileLabel = (unlocked: boolean): CSSProperties => ({
  fontSize: "var(--text-xs)",
  fontWeight: "var(--fw-semibold)",
  color: unlocked ? "var(--text-body)" : "var(--text-subtle)",
});

function SectionTitle({ children }: { children: ReactNode }) {
  return <div style={{ margin: "6px 0 10px", fontSize: "var(--text-body)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>{children}</div>;
}
function Row({ cols, children }: { cols: number; children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, marginBottom: 16 }}>{children}</div>;
}
function Tile({ selected, onClick, label, children }: { selected: boolean; onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} style={tileBase(selected)}>
      {children}
      <span style={tileLabel(true)}>{label}</span>
    </button>
  );
}

function ItemTile({
  item,
  count,
  selected,
  character,
  slot,
  other,
  onClick,
}: {
  item: Item;
  count: number;
  selected: boolean;
  character: Character;
  slot: "outfit" | "clothes";
  other: string;
  onClick: () => void;
}) {
  const unlocked = count >= item.unlockAt;
  const outfit = slot === "outfit" ? item.id : other;
  const clothes = slot === "clothes" ? item.id : other;
  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onClick}
      aria-label={unlocked ? `${item.name} 입기` : `${item.name} 잠김, ${item.unlockAt}권 필요`}
      style={{ ...tileBase(selected), cursor: unlocked ? "pointer" : "default" }}
    >
      <div style={{ filter: unlocked ? "none" : "grayscale(1)", opacity: unlocked ? 1 : 0.4 }}>
        <DressedBuddy character={character} outfit={outfit} clothes={clothes} size={40} blink={false} />
      </div>
      <span style={tileLabel(unlocked)}>{unlocked ? item.name : `${item.unlockAt}권`}</span>
      {!unlocked && (
        <span style={{ position: "absolute", top: 6, right: 6 }}>
          <Icon name="lock" size={12} color="var(--text-subtle)" />
        </span>
      )}
    </button>
  );
}

function DressedBuddy({
  character,
  outfit,
  clothes,
  size,
  blink = true,
}: {
  character: Character;
  outfit: string;
  clothes: string;
  size: number;
  blink?: boolean;
}) {
  const acc = ACCESSORIES.find((a) => a.id === outfit);
  const clo = CLOTHES.find((c) => c.id === clothes);
  const w = size;
  const h = size * 1.06;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <BookBuddy character={character} expression="happy" size={size} blink={blink} bookmark={character === "book"} />
      {(clo?.art || acc?.art) && (
        <svg viewBox="0 0 100 106" width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} aria-hidden="true">
          {clo?.art && <g style={fitStyle(character, clo.slot)}>{clo.art}</g>}
          {acc?.art && <g style={fitStyle(character, acc.slot)}>{acc.art}</g>}
        </svg>
      )}
    </div>
  );
}

/* ── wardrobe art — one cohesive knit palette (WOOL / WOOL_D / CREAM) ── */
function Bow() {
  return (
    <g>
      <path d="M45 84 L33 77 L33 91 Z" fill={WOOL} />
      <path d="M45 84 L57 77 L57 91 Z" fill={WOOL} />
      <path d="M39 80 L45 84 L39 88" fill="none" stroke={WOOL_D} strokeWidth="1" opacity="0.55" />
      <path d="M51 80 L45 84 L51 88" fill="none" stroke={WOOL_D} strokeWidth="1" opacity="0.55" />
      <rect x="42" y="80.5" width="6" height="7" rx="2" fill={WOOL_D} />
    </g>
  );
}
function Glasses() {
  return (
    <g>
      <circle cx="34" cy="51" r="7.2" fill="#fff" opacity="0.3" />
      <circle cx="56" cy="51" r="7.2" fill="#fff" opacity="0.3" />
      <g fill="none" stroke={FRAME} strokeWidth="2.2" strokeLinecap="round">
        <circle cx="34" cy="51" r="7.2" />
        <circle cx="56" cy="51" r="7.2" />
        <path d="M41 50 Q45 47 49 50" />
        <path d="M26.8 51 L21 49" />
        <path d="M63.2 51 L69 49" />
      </g>
    </g>
  );
}
function Beret() {
  return (
    <g>
      <path d="M13 12 Q18 -3 39 -1 Q57 1 53 12 Q39 17 25 15.5 Q16 15 13 12 Z" fill={WOOL} />
      <circle cx="40" cy="-1.5" r="2.6" fill={WOOL} />
      <path d="M15 12 Q34 17 51 12" stroke={WOOL_D} strokeWidth="1.8" fill="none" opacity="0.85" />
    </g>
  );
}
function Crown() {
  return (
    <g>
      <path d="M14 15 L14 3 L23 10 L34 0 L45 10 L54 3 L54 15 Z" fill="var(--gold-500)" stroke={WOOL_D} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="34" cy="4" r="2" fill={CREAM} />
      <circle cx="19" cy="10" r="1.5" fill={CREAM} />
      <circle cx="49" cy="10" r="1.5" fill={CREAM} />
    </g>
  );
}
function Scarf() {
  return (
    <g>
      <path d="M12 80 Q45 88 78 80 L78 90 Q45 98 12 90 Z" fill={WOOL} />
      <path d="M12 84 Q45 92 78 84" stroke={CREAM} strokeWidth="2" fill="none" opacity="0.85" />
      <path d="M22 88 L18 104 L28 104 L30 88 Z" fill={WOOL} />
      <path d="M21 104 L21 106 M25 104 L25 106" stroke={WOOL_D} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}
function Sweater() {
  return (
    <g>
      <path d="M13 69 Q46 62 79 69 L79 96 Q46 103 13 96 Z" fill={WOOL} />
      <path d="M34 66 Q46 74 58 66 L56 70 Q46 76 36 70 Z" fill={CREAM} />
      <path d="M23 75 L23 95 M46 79 L46 100 M69 75 L69 95" stroke={WOOL_D} strokeWidth="1.2" opacity="0.4" />
      <path d="M13 88 Q46 95 79 88" stroke={WOOL_D} strokeWidth="1" opacity="0.3" />
    </g>
  );
}
function Apron() {
  return (
    <g>
      <path d="M33 63 L59 63 L63 97 Q46 102 29 97 Z" fill={CREAM} />
      <path d="M33 63 Q46 68 59 63" stroke={WOOL} strokeWidth="2" fill="none" />
      <path d="M40 63 L36 52 M52 63 L56 52" stroke={WOOL} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <rect x="40" y="80" width="12" height="9" rx="1.5" fill="none" stroke={WOOL} strokeWidth="1.6" />
    </g>
  );
}

export default Home;
