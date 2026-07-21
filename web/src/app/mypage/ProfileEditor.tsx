'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { isValidNickname, nicknameLength, NICKNAME_MAX } from '@/lib/nickname'
import { saveProfile } from './actions'

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50'

export function ProfileEditor({
  initialNickname,
  email,
  isAnonymous,
}: {
  initialNickname: string
  email: string | null
  isAnonymous: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [nickname, setNickname] = useState(initialNickname)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const valid = isValidNickname(nickname)
  const dirty = nickname.trim() !== initialNickname.trim()
  const len = nicknameLength(nickname)
  const account = isAnonymous ? '비회원(익명) 로그인' : (email ?? '구글 로그인')

  function handleSave() {
    setMessage(null)
    startTransition(async () => {
      const result = await saveProfile(nickname)
      if (result.ok) {
        setMessage({ ok: true, text: '저장했습니다 — Supabase에 반영됐어요.' })
        router.refresh()
      } else {
        setMessage({ ok: false, text: result.error ?? '저장에 실패했어요.' })
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 계정 정보 (읽기 전용) */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-500">계정</span>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{account}</p>
      </div>

      {/* 닉네임 편집 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nickname" className="text-sm font-medium text-zinc-500">
            닉네임
          </label>
          <span className={`text-xs ${valid ? 'text-zinc-400' : 'text-red-500'}`}>
            {len}/{NICKNAME_MAX}
          </span>
        </div>
        <input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={40}
          placeholder="2~20자"
          className={inputClass}
        />
        {!valid && nickname.length > 0 && (
          <p className="text-xs text-red-500">
            닉네임은 공백 제외 2~20자로 입력해 주세요.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending || !valid || !dirty}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? '저장 중…' : '저장'}
        </button>
        {message && (
          <span className={`text-sm ${message.ok ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </span>
        )}
      </div>
    </div>
  )
}
