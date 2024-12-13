import { getProfile, getTags } from '@/lib/data-access'
import Image from 'next/image'
import ProfileForm from '@/components/ProfileForm'
import { profileFormFields } from '@/utils/profileFormFields'

export default async function EditProfilePage({params: {locale,slug}}) {
  const profile = await getProfile(slug)
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
  const messages = profileFormFields[locale]

  return (
    <ProfileForm defaultProfile={profile} tags={tagTranslations} messages={messages} locale={locale} />
  )
}