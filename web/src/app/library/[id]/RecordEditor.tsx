'use client'

import { useState, useTransition, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { LibraryBookWithBook, ReadingStatus } from '@/types/db'
import { readingStatuses, statusLabel } from '@/lib/labels'
import { BookCover } from '@/components/BookCover'
import { StarRating } from '@/components/StarRating'
import { ProgressBar } from '@/components/ProgressBar'
import { saveRecord } from './actions'

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50'

export function RecordEditor({ entry }: { entry: LibraryBookWithBook }) {
  const { book } = entry
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [status, setStatus] = useState<ReadingStatus>(entry.status)
  const [rating, setRating] = useState<number | null>(entry.rating)
  const [oneLiner, setOneLiner] = useState(entry.one_liner ?? '')
  const [memo, setMemo] = useState(entry.memo ?? '')
  const [startDate, setStartDate] = useState(entry.start_date ?? '')
  const [endDate, setEndDate] = useState(entry.end_date ?? '')
  const [current, setCurrent] = useState(entry.current_page ?? 0)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const total = entry.total_pages ?? 0
  const percent =
    status === 'done'
      ? 100
      : total > 0
        ? Math.round((current / total) * 100)
        : (entry.progress_percent ?? 0)

  function handleSave() {
    setMessage(null)
    startTransition(async () => {
      const result = await saveRecord({
        id: entry.id,
        status,
        rating,
        oneLiner,
        memo,
        startDate,
        endDate,
        currentPage: total > 0 ? current : entry.current_page,
        progressPercent: percent,
      })

      if (result.ok) {
        setMessage({ ok: true, text: '저장했습니다 — Supabase에 실제로 반영됐어요.' })
        router.refresh()
      } else {
        setMessage({ ok: false, text: `저장 실패: ${result.error}` })
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/library" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← 내 서재
      </Link>

      {/* 책 헤더 */}
      <header className="flex gap-4">
        <BookCover
          title={book.title}
          coverUrl={book.cover_url}
          className="h-32 w-24 shrink-0 text-xs"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {book.title}
          </h1>
          <p className="text-sm text-zinc-500">
            {[book.author, book.publisher, book.pub_date].filter(Boolean).join(' · ')}
          </p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ReadingStatus)}
            className="w-32 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            {readingStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Field label="별점">
        <StarRating value={rating} onChange={setRating} />
      </Field>

      <Field label="한줄평">
        <input
          value={oneLiner}
          onChange={(e) => setOneLiner(e.target.value)}
          placeholder="이 책을 한 줄로 표현하면?"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="시작일">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="완료일">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label={`진행률 ${percent}%${total > 0 ? ` (${current} / ${total}p)` : ''}`}
      >
        <div className="flex items-center gap-3">
          {total > 0 && status !== 'done' && (
            <input
              type="range"
              min={0}
              max={total}
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
          )}
          <div className="flex-1">
            <ProgressBar percent={percent} />
          </div>
        </div>
      </Field>

      <Field label="메모">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={5}
          placeholder="독서 중 떠오른 생각을 남겨보세요"
          className={inputClass}
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? '저장 중…' : '저장'}
        </button>
        {message && (
          <span
            className={`text-sm ${message.ok ? 'text-green-600' : 'text-red-500'}`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      {children}
    </div>
  )
}
