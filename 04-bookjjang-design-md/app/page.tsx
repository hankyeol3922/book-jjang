"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "./components/PhoneFrame";
import { Home, THEMES, type Customize } from "./components/screens/Home";
import { Library, type ShelfItem } from "./components/screens/Library";
import { BookSearch } from "./components/screens/BookSearch";
import { BookRecord } from "./components/screens/BookRecord";
import type { RecordBook, RecordDraft } from "./components/screens/BookRecord";
import { Login } from "./components/screens/Login";
import { getBook } from "./data/books";
import { BookBuddy } from "./components/ds";
import type { BottomNavItem } from "./components/ds";

const NAV_ITEMS: BottomNavItem[] = [
  { key: "search", icon: "search", label: "검색" },
  { key: "home", icon: "home", label: "홈", primary: true },
  { key: "shelf", icon: "library", label: "내 서재" },
];

const STORAGE_KEY = "bookjjang.shelf.v1";

/**
 * 북박이장 앱 셸. `activeKey`로 화면을 전환하고, 담긴 책(`added`)·기록(`records`)·
 * 토스트를 상위에서 소유해 서재/검색/기록 화면이 공유한다. 담긴 책은 서재
 * 그리드에 쌓인다. 아직 실제 라우팅·영속화는 없다(로컬 상태 프로토타입, O-13).
 *  - "record" → 기록하기 화면(별점·한줄평·메모)
 *  - "search" → 책 검색 화면
 *  - 그 외("shelf"/"home") → 내 서재(빈 상태 또는 표지 그리드)
 */
export default function BookJjangApp() {
  const [activeKey, setActiveKey] = useState("home");
  const [added, setAdded] = useState<string[]>([]);
  const [records, setRecords] = useState<Record<string, RecordDraft>>({});
  const [addedAt, setAddedAt] = useState<Record<string, number>>({});
  const [booksById, setBooksById] = useState<Record<string, RecordBook>>({});
  const [custom, setCustom] = useState<Customize>({ character: "book", theme: "sage", outfit: "none", clothes: "none" });
  const [recordBook, setRecordBook] = useState<RecordBook | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Restore the shelf from localStorage after mount (avoids SSR hydration
  // mismatch — initial render is empty, then we load).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { added?: unknown; records?: unknown; addedAt?: unknown; books?: unknown; loggedIn?: unknown; outfit?: unknown; custom?: unknown };
        if (Array.isArray(data.added)) setAdded(data.added.filter((id): id is string => typeof id === "string"));
        if (data.records && typeof data.records === "object") setRecords(data.records as Record<string, RecordDraft>);
        if (data.addedAt && typeof data.addedAt === "object") setAddedAt(data.addedAt as Record<string, number>);
        if (data.books && typeof data.books === "object") setBooksById(data.books as Record<string, RecordBook>);
        if (data.loggedIn === true) setLoggedIn(true);
        if (data.custom && typeof data.custom === "object") {
          setCustom((prev) => ({ ...prev, ...(data.custom as Partial<Customize>) }));
        } else if (typeof data.outfit === "string") {
          setCustom((prev) => ({ ...prev, outfit: data.outfit as string })); // migrate old single-slot
        }
      }
    } catch {
      /* ignore corrupt/unavailable storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (only after the initial load, so we never clobber stored
  // data with the empty mount state).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ added, records, addedAt, books: booksById, loggedIn, custom }));
    } catch {
      /* ignore quota/unavailable storage */
    }
  }, [added, records, addedAt, booksById, loggedIn, custom, hydrated]);

  const addedSet = new Set(added);
  // Newest first, resolving each id to its stored book (Aladin result or mock) + rating + add time.
  const shelf: ShelfItem[] = added
    .map((id) => {
      const book = booksById[id] ?? getBook(id);
      return book ? { book, rating: records[id]?.rating ?? 0, addedAt: addedAt[id] ?? Date.now() } : null;
    })
    .filter((it): it is ShelfItem => it !== null)
    .reverse();

  function notify(message: string) {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  }

  function remember(book: RecordBook) {
    setBooksById((prev) => ({ ...prev, [book.id]: book }));
  }

  function shelve(id: string) {
    setAdded((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setAddedAt((prev) => (prev[id] ? prev : { ...prev, [id]: Date.now() }));
  }

  function addBook(book: RecordBook) {
    remember(book);
    shelve(book.id);
    notify(`'${book.title}' 서재에 담았어요`);
  }

  function openRecord(book: RecordBook) {
    remember(book);
    setRecordBook(book);
    setActiveKey("record");
  }

  function saveRecord(draft: RecordDraft) {
    if (!recordBook) return;
    remember(recordBook);
    setRecords((prev) => ({ ...prev, [recordBook.id]: draft }));
    shelve(recordBook.id);
    notify(`'${recordBook.title}' 서재에 담았어요`);
    setActiveKey("shelf");
  }

  function deleteBook(id: string) {
    const title = booksById[id]?.title ?? getBook(id)?.title ?? "책";
    setAdded((prev) => prev.filter((x) => x !== id));
    setRecords((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setAddedAt((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setBooksById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    notify(`'${title}' 서재에서 뺐어요`);
    setActiveKey("shelf");
  }

  function logout() {
    setLoggedIn(false);
    setActiveKey("home");
  }

  function setCustomize(patch: Partial<Customize>) {
    setCustom((prev) => ({ ...prev, ...patch }));
  }

  // Keep the search tab lit while the record screen (a search sub-flow) is open.
  const navActive = activeKey === "record" ? "search" : activeKey;
  const inApp = hydrated && loggedIn;

  // Theme color → override the --brand family for the whole app.
  const t = THEMES.find((x) => x.id === custom.theme) ?? THEMES[0];
  const themeVars = {
    "--brand": t.brand,
    "--brand-hover": t.hover,
    "--brand-active": t.active,
    "--brand-soft": t.soft,
    "--brand-tint": t.tint,
  } as React.CSSProperties;

  return (
    <div style={themeVars}>
    <PhoneFrame
      nav={inApp ? { items: NAV_ITEMS, activeKey: navActive, onSelect: setActiveKey } : undefined}
      toast={inApp ? toast : null}
    >
      {!hydrated ? (
        // splash while restoring session (matches SSR empty state → no mismatch)
        <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BookBuddy expression="happy" size={112} />
        </div>
      ) : !loggedIn ? (
        <Login onLogin={() => setLoggedIn(true)} />
      ) : activeKey === "record" && recordBook ? (
        <BookRecord
          book={recordBook}
          initial={records[recordBook.id]}
          isEditing={addedSet.has(recordBook.id)}
          onBack={() => setActiveKey("shelf")}
          onSave={saveRecord}
          onDelete={() => deleteBook(recordBook.id)}
        />
      ) : activeKey === "search" ? (
        <BookSearch added={addedSet} onAdd={addBook} onOpen={openRecord} onBack={() => setActiveKey("home")} />
      ) : activeKey === "shelf" ? (
        <Library items={shelf} onSearch={() => setActiveKey("search")} onOpen={openRecord} onLogout={logout} />
      ) : (
        <Home items={shelf} custom={custom} onSet={setCustomize} onSearch={() => setActiveKey("search")} onLogout={logout} />
      )}
    </PhoneFrame>
    </div>
  );
}
