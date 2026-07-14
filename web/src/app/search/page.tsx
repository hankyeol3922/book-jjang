'use client'

import { useState, useTransition, type FormEvent } from 'react'
import type { AladinBook } from '@/lib/aladin'
import { Nav } from '@/components/Nav'
import { BookCover } from '@/components/BookCover'
import { addToLibrary } from './actions'

type AddState = 'added' | 'duplicate' | 'saving'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AladinBook[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [state, setState] = useState<Record<string, AddState>>({})
  const [, startTransition] = useTransition()

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const res = await fetch(`/api/aladin/search?query=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '검색 중 오류가 발생했습니다.')
      setResults(data.books ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleAdd(key: string, book: AladinBook) {
    setError(null)
    setState((s) => ({ ...s, [key]: 'saving' }))

    startTransition(async () => {
      const result = await addToLibrary(book)

      if (!result.ok) {
        setState((s) => {
          const next = { ...s }
          delete next[key]
          return next
        })
        setError(result.error ?? '서재에 담지 못했습니다.')
        return
      }

      setState((s) => ({ ...s, [key]: result.duplicate ? 'duplicate' : 'added' }))
    })
  }

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          책 검색
        </h1>

        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목 또는 저자를 입력"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {loading ? '검색 중…' : '검색'}
          </button>
        </form>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {!error && searched && !loading && results.length === 0 && (
          <p className="text-sm text-zinc-500">검색 결과가 없어요.</p>
        )}

        <ul className="flex flex-col gap-3">
          {results.map((b) => {
            const key = b.isbn13 || b.itemId
            const added = state[key]
            return (
              <li
                key={key}
                className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <BookCover
                  title={b.title}
                  coverUrl={b.cover}
                  className="h-24 w-16 shrink-0 text-[10px]"
                />
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {b.title}
                  </span>
                  <span className="mt-0.5 text-sm text-zinc-500">{b.author}</span>
                  <span className="mt-0.5 text-xs text-zinc-400">
                    {[b.publisher, b.pubDate].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(key, b)}
                  disabled={Boolean(added)}
                  className={`h-9 shrink-0 self-center rounded-full px-4 text-sm font-medium transition-colors disabled:cursor-default ${
                    added === 'added' || added === 'duplicate'
                      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      : added === 'saving'
                        ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {added === 'saving'
                    ? '담는 중…'
                    : added === 'duplicate'
                      ? '✓ 이미 있음'
                      : added === 'added'
                        ? '✓ 담음'
                        : '＋ 서재'}
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-8 text-xs text-zinc-400">
          * 알라딘 실시간 검색 결과입니다. &quot;＋서재&quot;를 누르면 Supabase에 실제로 저장됩니다.
        </p>
      </main>
    </>
  )
}
