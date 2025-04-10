import { getEvents, getTags } from '@/lib/data-access'
import ExploreEvents from "@/components/ExploreEvents"

export default async function AllEventsPage({params}) {
  const {locale} = await params;
  const tags = await getTags()

  const tagTranslations = tags.map(t => {
    const translation = t.translations.find(tr => tr.languages_code === locale)
    return {
      id: t.id,
      slug: t.slug,
      sort: t.sort,
      name: translation?.name || t.name
    }
  })

  return (
    <section className="bg-light text-dark p-6 py-12">
      <div className="container max-w-screen-lg mx-auto">
        <ExploreEvents tags={tagTranslations} locale={locale} />
      </div>
    </section>
  )
}

