import { NextResponse } from "next/server";

/**
 * 알라딘(Aladin) 도서 검색 프록시. 브라우저에서 알라딘 API를 직접 부르면 CORS로
 * 막히고 키가 노출되므로, 서버(라우트 핸들러)에서 대신 호출한다.
 *
 * 키는 환경변수 `ALADIN_TTB_KEY`(예: `.env.local`)에서 읽는다. 키가 없으면
 * `{ configured: false }`를 돌려주고, 클라이언트(BookSearch)는 로컬 목업으로
 * 폴백한다. 키를 넣고 서버를 재시작하면 실제 검색·표지가 바로 켜진다.
 * See DESIGN.md §11.3 · O-15.
 */

const TINTS = ["sage", "gold", "rose", "mist"] as const;

function tintFor(s: string): (typeof TINTS)[number] {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}

interface AladinItem {
  title?: string;
  author?: string;
  publisher?: string;
  pubDate?: string;
  isbn13?: string;
  isbn?: string;
  itemId?: number;
  cover?: string;
}

export async function GET(req: Request) {
  const key = process.env.ALADIN_TTB_KEY;
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";

  if (!key) return NextResponse.json({ configured: false, items: [] });
  if (!q) return NextResponse.json({ configured: true, items: [] });

  const api = new URL("http://www.aladin.co.kr/ttb/api/ItemSearch.aspx");
  api.search = new URLSearchParams({
    ttbkey: key,
    Query: q,
    QueryType: "Keyword",
    MaxResults: "20",
    start: "1",
    SearchTarget: "Book",
    output: "js",
    Version: "20131101",
    Cover: "Big",
  }).toString();

  try {
    const res = await fetch(api, { cache: "no-store" });
    const text = await res.text();
    const data = JSON.parse(text.trim());
    const items = (data.item ?? []).map((it: AladinItem) => {
      const id = String(it.isbn13 || it.itemId || it.isbn || it.title || "");
      return {
        id,
        title: it.title ?? "",
        author: it.author ?? "",
        publisher: it.publisher ?? "",
        year: (it.pubDate ?? "").slice(0, 4),
        cover: it.cover || undefined,
        tint: tintFor(id),
      };
    });
    return NextResponse.json({ configured: true, items });
  } catch {
    return NextResponse.json({ configured: true, items: [], error: true });
  }
}
