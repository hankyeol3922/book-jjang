'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/supabase/session'
import { isValidNickname } from '@/lib/nickname'

export interface ActionResult {
  ok: boolean
  error?: string
}

/** 마이페이지에서 닉네임을 저장한다 — profiles 테이블에 실제 반영. */
export async function saveProfile(rawNickname: string): Promise<ActionResult> {
  const nickname = rawNickname.trim()
  if (!isValidNickname(nickname)) {
    return { ok: false, error: '닉네임은 공백 제외 2~20자로 입력해 주세요.' }
  }

  const { supabase, userId } = await requireUser()

  const { error } = await supabase
    .from('profiles')
    .update({ nickname })
    .eq('id', userId) // RLS(profiles_update_own)가 이미 막지만 명시적으로 한 번 더

  if (error) return { ok: false, error: `프로필 저장 실패: ${error.message}` }

  revalidatePath('/mypage')
  revalidatePath('/library') // 서재 상단 인사말도 닉네임을 쓰므로 갱신
  return { ok: true }
}
