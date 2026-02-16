import ColorPaletteTool from '@/components/artbox/ColorPaletteTool'
import { backfillMissingPalettes } from '@/lib/data-access'

export const revalidate = 60

export default async function DiscoverPage({ params }) {
  const { locale } = await params

  await backfillMissingPalettes()

  return (
    <section className="bg-light text-dark min-h-screen">
      <div className="container max-w-screen-lg mx-auto px-6 py-8 md:py-12">
        <ColorPaletteTool locale={locale} />
      </div>
    </section>
  )
}
