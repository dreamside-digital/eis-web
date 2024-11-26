import { getEvents, getTags } from '@/utils/directus'
import ExploreEvents from "@/components/ExploreEvents"
import { eventFormFields } from '@/utils/eventFormFields'

export default async function AllEventsPage({params: {locale}}) {
  const events = await getEvents()
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
      <div className="container max-w-screen-xl mx-auto">
        <ExploreEvents events={events} tags={tagTranslations} locale={locale} messages={messages} />
      </div>
    </section>
  )
}

