import { getEvents, getTags } from '@/lib/data-access'
import ExploreEvents from "@/components/ExploreEvents"
import { eventFormFields } from '@/utils/eventFormFields'

export default async function AllEventsPage({params: {locale}}) {
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
  
  const messages = eventFormFields[locale]

  return (
    <section className="bg-light text-dark p-6 py-12">
      <div className="container max-w-screen-lg mx-auto">
        <ExploreEvents tags={tagTranslations} locale={locale} messages={messages} />
      </div>
    </section>
  )
}

