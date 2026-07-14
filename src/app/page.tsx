import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-24 text-center dark:bg-black">
      <div className="flex flex-col items-center gap-3">
        <span className="text-6xl">📚</span>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          북박이장
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          나만의 온라인 책장 — 읽은 책을 차곡차곡
        </p>
      </div>

      {/* TODO: Supabase 구글 OAuth 연결. 현재는 목업 서재로 이동 */}
      <Link
        href="/library"
        className="flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
      >
        <span className="font-bold text-blue-600">G</span>
        구글로 시작하기
      </Link>

      <p className="max-w-sm text-sm text-zinc-500">
        읽은 책을 기록하고, 메모와 한줄평을 남기고, 나만의 독서 통계를 확인하세요.
      </p>
      <p className="text-xs text-zinc-400">
        * 로그인은 아직 목업입니다 — 클릭하면 예시 서재로 이동합니다.
      </p>
    </main>
  );
}
