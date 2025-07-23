import { getTags, getUserProfiles, getArtwork } from '@/lib/data-access'
import ArtworkEditForm from '@/components/ArtworkEditForm'
import {redirect} from 'next/navigation';
import { getUser } from '@/lib/auth/session'

export default async function EditArtworkPage({params}) {
  const {locale, id} = await params; 
  const tags = await getTags()
  const user = await getUser()
  const profiles = await getUserProfiles()
  
  if (!user) {
    redirect(`/${locale}/login`)
  }

  let artwork
  try {
    artwork = await getArtwork(id)
  } catch (error) {
    redirect(`/${locale}/artwork`)
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
    <ArtworkEditForm 
      locale={locale} 
      user={user} 
      artwork={artwork}
      tags={tagTranslations}
      profiles={profiles}
    />
  )
}