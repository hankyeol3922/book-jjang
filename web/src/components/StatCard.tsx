export function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {value}
      </span>
    </div>
  )
}
