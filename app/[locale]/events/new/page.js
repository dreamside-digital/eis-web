import { getProfile, getTags, createEvent, userSession, currentUser } from '@/lib/data-access'
import Image from 'next/image'
import EventForm from '@/components/EventForm'
import { redirect } from 'next/navigation';

export default async function NewEventPage({params: {locale}}) {
  const session = await userSession()
  const user = await currentUser(session)
  
  if (!user) {
    redirect('/login')
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