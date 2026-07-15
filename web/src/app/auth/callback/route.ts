import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * 구글 로그인 후 Supabase가 ?code=... 와 함께 여기로 리다이렉트한다.
 * code를 세션으로 교환(exchangeCodeForSession)해 쿠키에 저장한 뒤 서재로 보낸다.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/library'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // 배포 환경(프록시)
      const isLocal = process.env.NODE_ENV === 'development'

      if (isLocal) return NextResponse.redirect(`${origin}${next}`)
      if (forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${next}`)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 실패 시 홈으로 (에러 플래그와 함께)
  return NextResponse.redirect(`${origin}/?error=auth`)
}
