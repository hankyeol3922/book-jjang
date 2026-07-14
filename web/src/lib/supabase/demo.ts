import 'server-only'
import { cache } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * 로그인 UI가 없는 동안 RLS를 "우회"하지 않고 "정상 통과"시키기 위한 데모 세션.
 *
 * 서버에서 데모 계정으로 로그인해 진짜 access token을 얻으므로 auth.uid()가 채워지고,
 * schema.sql 의 RLS 정책이 설계된 그대로 적용된다. service_role 키는 쓰지 않는다.
 *
 * 나중에 구글 로그인을 붙일 때는 이 모듈을 세션 기반 클라이언트로 바꾸기만 하면 된다.
 */
export const getDemoSession = cache(
  async (): Promise<{ supabase: SupabaseClient; userId: string }> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const email = process.env.DEMO_USER_EMAIL
    const password = process.env.DEMO_USER_PASSWORD

    if (!url || !anonKey) {
      throw new Error('.env.local 에 NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY 가 필요합니다.')
    }
    if (!email || !password) {
      throw new Error('데모 계정이 없습니다. `node scripts/seed.mjs` 를 먼저 실행하세요.')
    }

    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) {
      throw new Error(`데모 계정 로그인 실패: ${error?.message ?? '알 수 없는 오류'}`)
    }

    return { supabase, userId: data.user.id }
  },
)
