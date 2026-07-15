'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/supabase/session'
import type { AladinBook } from '@/lib/aladin'

export interface AddResult {
  ok: boolean
  /** 이미 서재에 있던 책 */
  duplicate?: boolean
  error?: string
}

/**
 * 검색 결과의 책을 서재에 담는다.
 *   1) books 에 ISBN13 기준 1회 캐싱 (이미 있으면 재사용)
 *   2) library_books 에 '읽고 싶음' 상태로 추가
 */
export async function addToLibrary(book: AladinBook): Promise<AddResult> {
  if (!book.isbn13) {
    return { ok: false, error: 'ISBN이 없는 도서는 서재에 담을 수 없어요.' }
  }

  const { supabase, userId } = await requireUser()

  // 1) 도서 메타 캐시 — 있으면 재사용, 없으면 삽입
  //    (books 에는 UPDATE 정책이 없으므로 upsert 대신 조회 후 삽입)
  const { data: found, error: findErr } = await supabase
    .from('books')
    .select('id')
    .eq('isbn13', book.isbn13)
    .maybeSingle()

  if (findErr) return { ok: false, error: `도서 조회 실패: ${findErr.message}` }

  let bookId = found?.id as string | undefined

  if (!bookId) {
    const { data: inserted, error: insertErr } = await supabase
      .from('books')
      .insert({
        isbn13: book.isbn13,
        title: book.title,
        author: book.author || null,
        publisher: book.publisher || null,
        pub_date: book.pubDate || null,
        cover_url: book.cover || null,
        description: book.description || null,
        aladin_item_id: book.itemId || null,
      })
      .select('id')
      .single()

    if (insertErr) {
      // 동시에 같은 책이 캐싱됐을 수 있으므로 한 번 더 조회
      const { data: retry } = await supabase
        .from('books')
        .select('id')
        .eq('isbn13', book.isbn13)
        .maybeSingle()

      if (!retry) return { ok: false, error: `도서 저장 실패: ${insertErr.message}` }
      bookId = retry.id
    } else {
      bookId = inserted.id
    }
  }

  // 2) 내 서재에 추가 — (user_id, book_id) UNIQUE 로 중복 방지
  const { data: already } = await supabase
    .from('library_books')
    .select('id')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .maybeSingle()

  if (already) return { ok: true, duplicate: true }

  const { error: libErr } = await supabase
    .from('library_books')
    .insert({ user_id: userId, book_id: bookId, status: 'want' })

  if (libErr) return { ok: false, error: `서재 추가 실패: ${libErr.message}` }

  revalidatePath('/library')
  return { ok: true }
}
