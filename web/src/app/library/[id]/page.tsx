import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { getLibraryBook } from '@/lib/queries'
import { RecordEditor } from './RecordEditor'

export const dynamic = 'force-dynamic'

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = await getLibraryBook(id)
  if (!entry) notFound()

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <RecordEditor entry={entry} />
      </main>
    </>
  )
}
