// 03-data-model.md 와 1:1로 대응하는 TypeScript 타입

export type ReadingStatus = 'want' | 'reading' | 'done'

export interface Profile {
  id: string
  nickname: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  isbn13: string
  title: string
  author: string | null
  publisher: string | null
  pub_date: string | null
  cover_url: string | null
  description: string | null
  aladin_item_id: string | null
  created_at: string
}

export interface LibraryBook {
  id: string
  user_id: string
  book_id: string
  status: ReadingStatus
  rating: number | null // 1~5
  one_liner: string | null
  memo: string | null
  start_date: string | null
  end_date: string | null
  total_pages: number | null
  current_page: number | null
  progress_percent: number | null // 0~100
  created_at: string
  updated_at: string
}

// 서재 목록 조회 시 도서 메타를 조인한 형태
export interface LibraryBookWithBook extends LibraryBook {
  book: Book
}
