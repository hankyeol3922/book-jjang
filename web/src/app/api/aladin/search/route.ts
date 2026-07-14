import { NextResponse } from 'next/server'
import { searchAladin } from '@/lib/aladin'

// GET /api/aladin/search?query=키워드
// 알라딘 검색을 서버에서 프록시하여 TTB 키를 클라이언트에 노출하지 않는다.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')?.trim()

  if (!query) {
    return NextResponse.json(
      { error: 'query 파라미터가 필요합니다.' },
      { status: 400 },
    )
  }

  try {
    const books = await searchAladin(query)
    return NextResponse.json({ books })
  } catch (e) {
    const message = e instanceof Error ? e.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
