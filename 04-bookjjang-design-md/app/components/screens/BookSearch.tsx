"use client";

import { useEffect, useState, type ReactNode } from "react";
import { BookBuddy, BookCover, Button, Input, TopBar } from "../ds";
import type { Expression } from "../ds";
import type { RecordBook } from "./BookRecord";
import { CATALOG } from "../../data/books";

/**
 * 책 검색 (Book search) — search a book by title/author via the Aladin API
 * (server route `/api/search`), browse results with real covers, and quick-add
 * or tap a row to record. Falls back to the local mock catalog when no Aladin
 * key is configured. See DESIGN.md §11.3.
 */

function localSearch(q: string): RecordBook[] {
  const lc = q.toLowerCase();
  return CATALOG.filter((b) => b.title.toLowerCase().includes(lc) || b.author.toLowerCase().includes(lc));
}

export function BookSearch({
  added,
  onAdd,
  onOpen,
  onBack,
}: {
  added: Set<string>;
  onAdd: (book: RecordBook) => void;
  onOpen: (book: RecordBook) => void;
  onBack: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecordBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const q = query.trim();

  // Fetch from the Aladin proxy (debounced); fall back to the mock catalog when
  // the API isn't configured or the request fails.
  useEffect(() => {
    if (!q) {
      setResults([]);
      setLoading(false);
      setError(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.configured) {
          setResults(data.items as RecordBook[]);
          setError(!!data.error);
        } else {
          setResults(localSearch(q)); // no Aladin key → local mock fallback
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setResults(localSearch(q));
          setError(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <>
      {/* top bar */}
      <div style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--divider)", zIndex: 20 }}>
        <TopBar title="책 검색" leading="chevron-left" onLeading={onBack} />
      </div>

      {/* body */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* search field */}
        <div style={{ padding: "12px 20px 8px" }}>
          <Input
            value={query}
            onChange={setQuery}
            placeholder="제목이나 저자를 검색해 보세요"
            iconLeft="search"
            clearable
            autoFocus
            aria-label="책 검색"
          />
        </div>

        {/* results / states */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "4px 20px 20px" }}>
          {!q ? (
            <CenteredState
              expr="reading"
              title="어떤 책을 찾고 있나요?"
              desc="제목이나 저자를 입력하면 여기에 결과가 나와요"
            />
          ) : loading && results.length === 0 ? (
            <CenteredState expr="reading" title="책을 찾고 있어요" desc="잠시만 기다려 주세요" />
          ) : error ? (
            <CenteredState expr="sad" title="검색 중 문제가 생겼어요" desc="잠시 후 다시 시도해 주세요" />
          ) : results.length === 0 ? (
            <CenteredState
              expr="sad"
              title={`'${q}' 검색 결과가 없어요`}
              desc="다른 제목이나 저자로 검색해 볼까요?"
            />
          ) : (
            <>
              <div style={{ margin: "4px 2px 10px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                검색 결과 {results.length}권
              </div>
              {results.map((b) => (
                <ResultRow
                  key={b.id}
                  book={b}
                  added={added.has(b.id)}
                  onAdd={() => onAdd(b)}
                  onOpen={() => onOpen(b)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ResultRow({
  book,
  added,
  onAdd,
  onOpen,
}: {
  book: RecordBook;
  added: boolean;
  onAdd: () => void;
  onOpen: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--divider)" }}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${book.title} 기록하기`}
        style={{
          display: "flex",
          flex: 1,
          minWidth: 0,
          alignItems: "center",
          gap: 12,
          padding: 0,
          border: "none",
          background: "none",
          textAlign: "left",
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <BookCover title={book.title} src={book.cover} tint={book.tint} size="sm" />
        <span style={{ flex: 1, minWidth: 0, display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: "var(--text-body)",
              fontWeight: "var(--fw-bold)",
              color: "var(--text-strong)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {book.title}
          </span>
          <span
            style={{
              display: "block",
              marginTop: 2,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {book.author}
          </span>
          <span style={{ display: "block", marginTop: 1, fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>
            {book.publisher} · {book.year}
          </span>
        </span>
      </button>
      {added ? (
        <Button size="sm" variant="ghost" iconLeft="check" disabled>
          담김
        </Button>
      ) : (
        <Button size="sm" variant="soft" iconLeft="plus" onClick={onAdd}>
          담기
        </Button>
      )}
    </div>
  );
}

function CenteredState({ expr, title, desc }: { expr: Expression; title: ReactNode; desc: ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 6,
        padding: "12px 8px 40px",
      }}
    >
      <BookBuddy expression={expr} size={92} blink={false} />
      <div style={{ marginTop: 12, fontSize: "var(--text-h3)", fontWeight: "var(--fw-bold)", color: "var(--text-strong)" }}>
        {title}
      </div>
      <p style={{ margin: "2px 0 0", fontSize: "var(--text-body)", lineHeight: 1.55, color: "var(--text-muted)", maxWidth: 250 }}>
        {desc}
      </p>
    </div>
  );
}

export default BookSearch;
