import { getProfiles, getTags } from '@/utils/directus'
import ExploreProfiles from '@/components/ExploreProfiles'


export default async function AllProfilesPage({params: {locale}}) {
  const profiles = await getProfiles()
  const tags = await getTags()

  return (
    <section className="bg-white text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto">
        <ExploreProfiles profiles={profiles} tags={tags} locale={locale} />
      </div>
    </section>
  )
}