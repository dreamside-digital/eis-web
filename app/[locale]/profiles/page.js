import { getProfiles, getTags } from '@/lib/data-access'
import ExploreProfiles from '@/components/ExploreProfiles'


export default async function ProfilesPage({params: {locale}}) {
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
    <section className="bg-light text-dark p-6 py-12">
      <div className="container max-w-screen-lg mx-auto">
        <ExploreProfiles tags={tagTranslations} />
      </div>
    </section>
  )
}