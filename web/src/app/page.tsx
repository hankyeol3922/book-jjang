import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { GuestSignInButton } from "@/components/GuestSignInButton";

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

      <div className="flex flex-col items-center gap-3">
        <GoogleSignInButton />
        <GuestSignInButton />
      </div>

      <p className="max-w-sm text-sm text-zinc-500">
        읽은 책을 기록하고, 메모와 한줄평을 남기고, 나만의 독서 통계를 확인하세요.
      </p>
    </main>
  );
}
