import { getProfile, getTags, createEvent } from '@/utils/directus'
import Image from 'next/image'
import EventForm from '@/components/EventForm'
import { eventFormFields } from '@/utils/eventFormFields'

export default async function NewEventPage({params: {locale}}) {
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
    <EventForm tags={tagTranslations} createEvent={createEvent} messages={messages} locale={locale} />
  )
}