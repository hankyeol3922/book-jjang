'use client'

export function StarRating({
  value,
  onChange,
  size = 'text-xl',
}: {
  value: number | null
  onChange?: (v: number) => void
  size?: string
}) {
  const v = value ?? 0
  const interactive = typeof onChange === 'function'

  return (
    <div className={`inline-flex ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          aria-label={`${i}점`}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            i <= v ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
