'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * 구글 OAuth 로그인 시작 버튼.
 * 클릭하면 구글 동의 화면으로 이동하고, 완료 후 /auth/callback 으로 돌아온다.
 */
export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    // 성공하면 구글로 리다이렉트되므로 아래는 실행되지 않는다.
    if (error) {
      setLoading(false)
      setError('로그인을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
      >
        <span className="font-bold text-blue-600">G</span>
        {loading ? '구글로 이동 중…' : '구글로 시작하기'}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
