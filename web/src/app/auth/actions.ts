'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/** 로그아웃 — 세션 쿠키를 지우고 홈으로 보낸다. */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
