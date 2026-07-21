import type { SupabaseClient, User } from '@supabase/supabase-js'

/**
 * auth.users 의 구글 display name 등에서 프로필 닉네임 초기값을 만든다.
 * profiles.nickname 의 2~20자 CHECK 를 절대 위반하지 않도록 clamp 한다.
 * (DB 트리거 handle_new_user 와 동일한 규칙 — 앱/트리거 어느 쪽이 만들어도 결과가 같다.)
 */
export function deriveNickname(user: User): string {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const candidates: Array<unknown> = [
    meta.name,
    meta.full_name,
    user.email ? user.email.split('@')[0] : undefined,
  ]

  let raw = ''
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim() !== '') {
      raw = c.trim()
      break
    }
  }

  // 20자 clamp (유니코드 안전) → 2자 미만이면 기본값
  const nick = [...raw].slice(0, 20).join('')
  return [...nick].length < 2 ? '독서가' : nick
}

/**
 * 로그인한 사용자의 프로필이 없으면 생성한다 (멱등).
 * 이미 있으면(트리거가 먼저 만들었거나 재로그인) onConflict/ignoreDuplicates 로 건드리지 않는다.
 * 세션이 살아있는 supabase 클라이언트를 받으므로 RLS insert 정책(auth.uid() = id)을 통과한다.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      { id: user.id, nickname: deriveNickname(user) },
      { onConflict: 'id', ignoreDuplicates: true },
    )

  // 프로필 생성 실패가 로그인 자체를 막지 않도록 로깅만 한다
  // (대부분 트리거가 이미 생성해 둔 상태다.)
  if (error) {
    console.error('ensureProfile 실패:', error.message)
  }
}
