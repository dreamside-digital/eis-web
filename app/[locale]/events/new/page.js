import { getTags, createEvent } from '@/lib/data-access'
import Image from 'next/image'
import EventForm from '@/components/EventForm'
import {redirect} from 'next/navigation';
import { getUser } from '@/lib/auth/session'

export default async function NewEventPage({params}) {
  const {locale} = await params;
  const user = await getUser()
  if (!user) {
    redirect(`/${locale}/login`)
  }
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
    <EventForm tags={tagTranslations} createEvent={createEvent} />
  )
}