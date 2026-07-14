import type { ReadingStatus } from '@/types/db'
import { statusLabel } from '@/lib/labels'

const styles: Record<ReadingStatus, string> = {
  want: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
  reading: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
}

export function StatusBadge({ status }: { status: ReadingStatus }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {statusLabel[status]}
    </span>
  )
}
