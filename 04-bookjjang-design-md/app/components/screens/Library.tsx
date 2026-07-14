"use client";

import { BookBuddy, BookCover, Button, Icon, StarRating, TopBar } from "../ds";
import type { RecordBook } from "./BookRecord";

/**
 * 내 서재 (Library) — the reader's shelf. Empty on first run (mascot naps and
 * nudges to add a first book); once books are added it shows the profile, a
 * small stats summary, and a cover grid with per-book ratings. Tapping a book
 * reopens its record. Covers PRD P0-8. See DESIGN.md §11.2.
 */

export interface ShelfItem {
  book: RecordBook;
  rating: number;
  addedAt: number;
}

export function Library({
  items,
  onSearch,
  onOpen,
  onLogout,
}: {
  items: ShelfItem[];
  onSearch: () => void;
  onOpen: (book: RecordBook) => void;
  onLogout: () => void;
}) {
  const isEmpty = items.length === 0;

  return (
    <>
      {/* top bar */}
      <div style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--divider)", zIndex: 20 }}>
        <TopBar wordmark actions={[{ icon: "log-out", label: "로그아웃", onClick: onLogout }]} />
      </div>

      {/* content */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          padding: isEmpty ? "8px 20px 20px" : "8px 20px 24px",
          overflowY: isEmpty ? "hidden" : "auto",
        }}
      >
        {/* profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "8px 0 4px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--brand-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--brand)",
              flex: "none",
            }}
          >
            <Icon name="user" size={28} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>
              독서가 민지
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>나만의 조용한 책장</div>
          </div>
        </div>

        {isEmpty ? <EmptyState onSearch={onSearch} /> : <Shelf items={items} onSearch={onSearch} onOpen={onOpen} />}
      </div>
    </>
  );
}

function EmptyState({ onSearch }: { onSearch: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 8,
        padding: "0 8px 24px",
      }}
    >
      <BookBuddy expression="sleepy" size={112} blink={false} />
      <div style={{ marginTop: 14, fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>
        아직 서재가 비어 있어요
      </div>
      <p
        style={{
          margin: "4px 0 22px",
          fontSize: "var(--text-body-lg)",
          lineHeight: 1.55,
          color: "var(--text-muted)",
          maxWidth: 240,
        }}
      >
        읽은 책을 검색해서
        <br />내 서재에 첫 책을 담아볼까요?
      </p>
      <Button variant="primary" size="lg" iconLeft="search" onClick={onSearch}>
        책 검색하러 가기
      </Button>
    </div>
  );
}

function Shelf({ items, onSearch, onOpen }: { items: ShelfItem[]; onSearch: () => void; onOpen: (book: RecordBook) => void }) {
  const rated = items.filter((it) => it.rating > 0);
  const avg = rated.length ? rated.reduce((sum, it) => sum + it.rating, 0) / rated.length : 0;

  return (
    <>
      {/* stats */}
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          margin: "12px 0 20px",
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          overflow: "hidden",
        }}
      >
        <Stat label="읽은 책" value={`${items.length}`} unit="권" />
        <div style={{ width: 1, background: "var(--divider)" }} />
        <Stat label="평균 별점" value={avg ? avg.toFixed(1) : "-"} star={avg > 0} />
      </div>

      {/* monthly reading chart */}
      <MonthlyChart addedAt={items.map((it) => it.addedAt)} />

      {/* section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>내 책장</span>
        <Button variant="ghost" size="sm" iconLeft="plus" onClick={onSearch}>
          책 담기
        </Button>
      </div>

      {/* cover grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px 8px" }}>
        {items.map((it) => (
          <button
            key={it.book.id}
            type="button"
            onClick={() => onOpen(it.book)}
            aria-label={`${it.book.title} 기록 보기`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <BookCover title={it.book.title} src={it.book.cover} tint={it.book.tint} size="lg" />
            <span
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--fw-semibold)",
                color: "var(--text-strong)",
                lineHeight: 1.3,
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {it.book.title}
            </span>
            {it.rating > 0 ? (
              <StarRating value={it.rating} size="sm" readOnly aria-label={`별점 ${it.rating}점`} />
            ) : (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>미평가</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

const MONTHS = 6;

/**
 * MonthlyChart — books added per month over the last 6 months. Single-series
 * brand bars on a recessive track; counts wear ink tokens, not the series color
 * (dataviz rules). Only rendered client-side (shelf is non-empty only after
 * hydration), so `new Date()` here is safe from SSR mismatch. See DESIGN.md O-8.
 */
function MonthlyChart({ addedAt }: { addedAt: number[] }) {
  const now = new Date();
  const buckets = Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
    return { key: d.getFullYear() * 12 + d.getMonth(), label: `${d.getMonth() + 1}월`, count: 0 };
  });
  for (const ts of addedAt) {
    const d = new Date(ts);
    const b = buckets.find((x) => x.key === d.getFullYear() * 12 + d.getMonth());
    if (b) b.count += 1;
  }
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div style={{ margin: "0 0 22px" }}>
      <div style={{ marginBottom: 12, fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>
        최근 6개월
      </div>
      <div
        role="img"
        aria-label={`최근 6개월 월별 담은 책 수: ${buckets.map((b) => `${b.label} ${b.count}권`).join(", ")}`}
        style={{ display: "flex", alignItems: "stretch", gap: 10, height: 120 }}
      >
        {buckets.map((b) => (
          <div key={b.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
              {/* track */}
              <div style={{ position: "absolute", inset: 0, background: "var(--surface-sunken)", borderRadius: 8 }} />
              {/* bar */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: `${(b.count / max) * 100}%`,
                  minHeight: b.count > 0 ? 8 : 0,
                  background: "var(--brand)",
                  borderRadius: "6px 6px 0 0",
                  transition: "height var(--dur-base) var(--ease-out)",
                }}
              >
                {b.count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -18,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--fw-bold)",
                      color: "var(--text-strong)",
                    }}
                  >
                    {b.count}
                  </span>
                )}
              </div>
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, unit, star }: { label: string; value: string; unit?: string; star?: boolean }) {
  return (
    <div style={{ flex: 1, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
        {star && <Icon name="star" size={18} color="var(--rating)" fill="var(--rating)" />}
        <span style={{ fontSize: "var(--text-h2)", fontWeight: "var(--fw-extrabold)", color: "var(--text-strong)" }}>{value}</span>
        {unit && <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--fw-bold)", color: "var(--text-muted)" }}>{unit}</span>}
      </div>
      <div style={{ marginTop: 2, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}

export default Library;
