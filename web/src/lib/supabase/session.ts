import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * 로그인한 사용자의 세션 기반 Supabase 클라이언트와 userId를 반환한다.
 * 세션이 없으면 홈(로그인)으로 리다이렉트한다.
 *
 * 기존 getDemoSession()을 대체한다 — 반환 형태 { supabase, userId }가 같으므로
 * 호출부는 import와 함수명만 바꾸면 된다. 쿠키 기반이라 진짜 로그인 유저의
 * auth.uid()로 RLS가 그대로 적용된다.
 */
export const requireUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return { supabase, userId: user.id }
})
