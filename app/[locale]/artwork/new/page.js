import { getTags, getUserProfiles } from '@/lib/data-access'
import ArtworkForm from '@/components/ArtworkForm'
import {redirect} from 'next/navigation';
import { getUser } from '@/lib/auth/session'

const defaultArtwork = {
  status: "draft",
  title: "",
  medium: "",
  type: "",
  themes: [],
  inspiration: "",
  width: "",
  height: "",
  depth: "",
  is_framed: false,
  care_instructions: "",
  year_created: "",
  profile_id: "",
  images: []
}

export default async function NewArtworkPage({params}) {
  const {locale} = await params; 
  const tags = await getTags()
  const user = await getUser()
  const profiles = await getUserProfiles()
  
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
    <ArtworkForm 
      locale={locale} 
      user={user} 
      defaultArtwork={defaultArtwork} 
      tags={tagTranslations}
      profiles={profiles}
    />
  )
}