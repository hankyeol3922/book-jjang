import 'server-only'
import { requireUser } from '@/lib/supabase/session'
import type { LibraryBookWithBook, Profile } from '@/types/db'

const LIBRARY_SELECT = '*, book:books(*)'

export async function getProfile(): Promise<Profile | null> {
  const { supabase, userId } = await requireUser()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw new Error(`프로필 조회 실패: ${error.message}`)
  return data as Profile | null
}

export async function getLibrary(): Promise<LibraryBookWithBook[]> {
  const { supabase, userId } = await requireUser()
  const { data, error } = await supabase
    .from('library_books')
    .select(LIBRARY_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`서재 조회 실패: ${error.message}`)
  return (data ?? []) as unknown as LibraryBookWithBook[]
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getLibraryBook(id: string): Promise<LibraryBookWithBook | null> {
  // uuid가 아닌 id를 그대로 넘기면 Postgres가 타입 에러를 던지므로 미리 걸러낸다
  if (!UUID_RE.test(id)) return null

  const { supabase, userId } = await requireUser()
  const { data, error } = await supabase
    .from('library_books')
    .select(LIBRARY_SELECT)
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new Error(`독서 기록 조회 실패: ${error.message}`)
  return data as unknown as LibraryBookWithBook | null
}

/** 통계 카드용 — 서재 목록에서 파생 */
export function summarize(library: LibraryBookWithBook[]) {
  const done = library.filter((b) => b.status === 'done').length
  const reading = library.filter((b) => b.status === 'reading').length
  const rated = library.filter((b) => b.rating != null)
  const avgRating = rated.length
    ? (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1)
    : '-'

  return { total: library.length, done, reading, avgRating }
}

/** 월별 완독 그래프용 — 최근 7개월, end_date 기준 */
export function monthlyReads(library: LibraryBookWithBook[], months = 7) {
  const now = new Date()
  const buckets: { key: string; month: string; count: number }[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      month: `${d.getMonth() + 1}월`,
      count: 0,
    })
  }

  for (const b of library) {
    if (b.status !== 'done' || !b.end_date) continue
    const bucket = buckets.find((x) => x.key === b.end_date!.slice(0, 7))
    if (bucket) bucket.count++
  }

  return buckets.map(({ month, count }) => ({ month, count }))
}
