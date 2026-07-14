import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { StatCard } from '@/components/StatCard'
import { BookCover } from '@/components/BookCover'
import { StarRating } from '@/components/StarRating'
import { StatusBadge } from '@/components/StatusBadge'
import { MonthlyChart } from '@/components/MonthlyChart'
import { getLibrary, getProfile, monthlyReads, summarize } from '@/lib/queries'

// 서재는 저장 즉시 반영돼야 하므로 매 요청마다 조회
export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const [profile, library] = await Promise.all([getProfile(), getLibrary()])
  const stats = summarize(library)
  const chart = monthlyReads(library)

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* 프로필 헤더 */}
        <section className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl">
            🐻
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {profile?.nickname ?? '독서가'} 님의 책장
            </h1>
            <p className="text-sm text-zinc-500">
              지금까지 {stats.total}권을 담았어요
            </p>
          </div>
        </section>

        {/* 통계 */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="총 읽은 권수" value={`${stats.done}권`} />
          <StatCard label="읽는 중" value={`${stats.reading}권`} />
          <StatCard label="평균 별점" value={`★ ${stats.avgRating}`} />
          <div className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="text-xs text-zinc-500">월별 완독</span>
            <div className="h-14 w-full">
              <MonthlyChart data={chart} />
            </div>
          </div>
        </section>

        {/* 읽은 책 목록 */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-500">읽은 책</h2>

          {library.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
              아직 담은 책이 없어요.{' '}
              <Link href="/search" className="underline">
                책을 검색해서 서재에 추가
              </Link>
              해보세요.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {library.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/library/${entry.id}`}
                  className="group flex flex-col gap-2"
                >
                  <BookCover
                    title={entry.book.title}
                    coverUrl={entry.book.cover_url}
                    className="aspect-[3/4] w-full text-sm transition-opacity group-hover:opacity-90"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {entry.book.title}
                    </span>
                    <div className="flex items-center justify-between gap-1">
                      <StarRating value={entry.rating} size="text-sm" />
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
