'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * 비회원(익명) 로그인 버튼.
 * Supabase signInAnonymously로 진짜 익명 세션을 만들어 자기만의 빈 서재로 시작한다.
 * (Supabase에서 "Anonymous sign-ins"이 켜져 있어야 동작한다.)
 */
export function GuestSignInButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGuest() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInAnonymously()

    if (error) {
      setLoading(false)
      setError('비회원으로 시작하지 못했어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    // 익명 세션 쿠키가 설정됐으니 서버가 새 세션을 읽도록 이동 후 갱신
    router.push('/library')
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleGuest}
        disabled={loading}
        className="text-sm font-medium text-zinc-500 underline underline-offset-4 transition-colors hover:text-zinc-800 disabled:opacity-60 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {loading ? '들어가는 중…' : '비회원으로 시작하기'}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
