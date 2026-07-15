'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/supabase/session'
import type { ReadingStatus } from '@/types/db'

export interface SaveRecordInput {
  id: string
  status: ReadingStatus
  rating: number | null
  oneLiner: string
  memo: string
  startDate: string
  endDate: string
  currentPage: number | null
  progressPercent: number | null
}

export interface ActionResult {
  ok: boolean
  error?: string
}

/** 빈 문자열은 DB에 null로 (date 컬럼에 ''를 넣으면 오류) */
const nullify = (v: string) => (v.trim() === '' ? null : v.trim())

export async function saveRecord(input: SaveRecordInput): Promise<ActionResult> {
  const { supabase, userId } = await requireUser()

  const { error } = await supabase
    .from('library_books')
    .update({
      status: input.status,
      rating: input.rating,
      one_liner: nullify(input.oneLiner),
      memo: nullify(input.memo),
      start_date: nullify(input.startDate),
      end_date: nullify(input.endDate),
      current_page: input.currentPage,
      progress_percent: input.progressPercent,
    })
    .eq('id', input.id)
    .eq('user_id', userId) // RLS가 이미 막지만 명시적으로 한 번 더

  if (error) return { ok: false, error: error.message }

  revalidatePath('/library')
  revalidatePath(`/library/${input.id}`)
  return { ok: true }
}
