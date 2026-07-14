import type { ReadingStatus } from '@/types/db'

export const statusLabel: Record<ReadingStatus, string> = {
  want: '읽고 싶음',
  reading: '읽는 중',
  done: '완료',
}

export const readingStatuses: ReadingStatus[] = ['want', 'reading', 'done']
