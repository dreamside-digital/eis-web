import { getProfile, getTags } from '@/lib/data-access'
import Image from 'next/image'
import ProfileForm from '@/components/ProfileForm'
import { getUser } from '@/lib/auth/session'
import {redirect} from 'next/navigation';

export default async function EditProfilePage({params}) {
  const {locale,slug} = await params;
  const profile = await getProfile(slug)
  const tags = await getTags()
  const user = await getUser()
  
  if (!user) {
    redirect(`/${locale}/login`) 
  }

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
    <ProfileForm user={user} defaultProfile={profile} tags={tagTranslations} />
  )
}