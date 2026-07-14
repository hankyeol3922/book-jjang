import { gradientFor } from '@/lib/cover'

/**
 * 표지 이미지가 있으면 실제 이미지를, 없으면 제목 기반 그라디언트 플레이스홀더를 보여준다.
 */
export function BookCover({
  title,
  coverUrl,
  className,
}: {
  title: string
  coverUrl?: string | null
  className?: string
}) {
  if (coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={coverUrl}
        alt={title}
        className={`rounded-md object-cover shadow-sm ${className ?? ''}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-md p-2 text-center font-semibold leading-tight text-white shadow-sm ${className ?? ''}`}
      style={{ background: gradientFor(title) }}
    >
      <span className="line-clamp-4">{title}</span>
    </div>
  )
}
