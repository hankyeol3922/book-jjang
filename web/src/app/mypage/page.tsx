import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/queries'
import { ProfileEditor } from './ProfileEditor'

// 저장 즉시 반영돼야 하므로 매 요청마다 조회
export const dynamic = 'force-dynamic'

export default async function MyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const profile = await getProfile()

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-8">
        <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          마이페이지
        </h1>
        <ProfileEditor
          initialNickname={profile?.nickname ?? ''}
          email={user.email ?? null}
          isAnonymous={user.is_anonymous ?? false}
        />
      </main>
    </>
  )
}
