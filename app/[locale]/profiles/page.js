import { getProfiles, getTags } from '@/utils/directus'
import ExploreProfiles from '@/components/ExploreProfiles'
import { profileFormFields } from '@/utils/profileFormFields'


export default async function AllProfilesPage({params: {locale}}) {
  const profiles = await getProfiles()
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
    <section className="bg-white text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto">
        <ExploreProfiles profiles={profiles} tags={tagTranslations} locale={locale} messages={messages} />
      </div>
    </section>
  )
}