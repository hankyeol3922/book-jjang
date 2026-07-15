import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Next.js 16: 예전 middleware.ts 규칙이 proxy.ts로 바뀌었다.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // 정적 자산과 인증 콜백(/auth/*)은 프록시에서 제외한다.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
