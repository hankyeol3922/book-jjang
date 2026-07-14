// 알라딘 Open API 호출 헬퍼 — 반드시 서버 사이드에서만 사용 (TTB 키 보호)

const ALADIN_BASE = 'https://www.aladin.co.kr/ttb/api'

export interface AladinBook {
  isbn13: string
  title: string
  author: string
  publisher: string
  pubDate: string
  cover: string
  description: string
  itemId: string
}

interface AladinRawItem {
  isbn13?: string
  isbn?: string
  title?: string
  author?: string
  publisher?: string
  pubDate?: string
  cover?: string
  description?: string
  itemId?: number | string
}

function mapItem(it: AladinRawItem): AladinBook {
  return {
    isbn13: it.isbn13 || it.isbn || '',
    title: it.title ?? '',
    author: it.author ?? '',
    publisher: it.publisher ?? '',
    pubDate: it.pubDate ?? '',
    cover: it.cover ?? '',
    description: it.description ?? '',
    itemId: String(it.itemId ?? ''),
  }
}

// 제목/저자 키워드 검색 (ItemSearch)
export async function searchAladin(query: string): Promise<AladinBook[]> {
  const key = process.env.ALADIN_TTB_KEY
  if (!key) throw new Error('ALADIN_TTB_KEY 환경변수가 설정되지 않았습니다.')

  const params = new URLSearchParams({
    ttbkey: key,
    Query: query,
    QueryType: 'Keyword',
    MaxResults: '20',
    start: '1',
    SearchTarget: 'Book',
    Cover: 'Big',
    output: 'js',
    Version: '20131101',
  })

  const res = await fetch(`${ALADIN_BASE}/ItemSearch.aspx?${params.toString()}`)
  if (!res.ok) throw new Error(`알라딘 API 오류: ${res.status}`)

  const data = (await res.json()) as { item?: AladinRawItem[] }
  return (data.item ?? []).map(mapItem)
}

// ISBN13으로 단건 상세 조회 (ItemLookUp)
export async function lookupAladin(isbn13: string): Promise<AladinBook | null> {
  const key = process.env.ALADIN_TTB_KEY
  if (!key) throw new Error('ALADIN_TTB_KEY 환경변수가 설정되지 않았습니다.')

  const params = new URLSearchParams({
    ttbkey: key,
    ItemId: isbn13,
    ItemIdType: 'ISBN13',
    Cover: 'Big',
    output: 'js',
    Version: '20131101',
  })

  const res = await fetch(`${ALADIN_BASE}/ItemLookUp.aspx?${params.toString()}`)
  if (!res.ok) throw new Error(`알라딘 API 오류: ${res.status}`)

  const data = (await res.json()) as { item?: AladinRawItem[] }
  const first = data.item?.[0]
  return first ? mapItem(first) : null
}
