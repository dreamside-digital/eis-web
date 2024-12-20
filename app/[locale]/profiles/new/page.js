import { getTags, userSession, currentUser } from '@/lib/data-access'
import Image from 'next/image'
import ProfileForm from '@/components/ProfileForm'
import { profileFormFields } from '@/utils/profileFormFields'
import { redirect } from 'next/navigation';

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

export default async function NewProfilePage({params: {locale}}) {
  const tags = await getTags()
  const session = await userSession()
  const user = await currentUser(session)
  if (!user) {
    redirect('/login')
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
  const messages = profileFormFields[locale]

  return (
    <ProfileForm user={user} defaultProfile={defaultProfile} tags={tagTranslations} messages={messages} locale={locale} />
  )
}