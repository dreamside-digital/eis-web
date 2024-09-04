import { getEvents, getTags } from '@/utils/directus'
import ExploreEvents from "@/components/ExploreEvents"


export default async function AllEventsPage({params}) {
  const events = await getEvents()
  const tags = await getTags()

  return (
    <section className="bg-white text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto">
        <ExploreEvents events={events} tags={tags} />
      </div>
    </section>
  )
}