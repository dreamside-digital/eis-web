import { getTags, userSession, currentUser } from '@/lib/data-access'
import Image from 'next/image'
import ProfileForm from '@/components/ProfileForm'
import {redirect} from 'next/navigation';
import { getUser } from '@/lib/auth/session'
import { getPrompts } from '@/lib/data-access';

const defaultProfile = {
  status: "draft",
  profile_type: "individual",
  email_address: "",
  public_name: "",
  short_introduction: "",
  pronouns: "",
  current_projects: "",
  artistic_practice: "",
  inspirations: "",
  past_projects: "",
  tags: [],
  links: [{link_text: "", url: ""}, {link_text: "", url: ""}, {link_text: "", url: ""}],
  location: "",
  postal_code: "",
}

export default async function NewProfilePage({params}) {
  const {locale} = await params; 
  const tags = await getTags()
  const user = await getUser()
  const prompts = await getPrompts()
  
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
    <ProfileForm locale={locale} user={user} defaultProfile={defaultProfile} tags={tagTranslations} prompts={prompts} />
  )
}