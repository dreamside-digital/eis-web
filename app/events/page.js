import { getEvents } from '@/utils/directus'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from "isomorphic-dompurify";
const DATE_FORMAT = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }



export default async function AllEventsPage({params}) {
  const events = await getEvents()

  return (
    <section className="bg-white text-dark p-6 py-12">
      <div className="container mx-auto grid grid-cols-3 gap-12">
      {events.map(event => {
        const tagsText = event.tags.map(t => t.name).join(", ")
        const startDate = new Date(event.starts_at)
        const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
        const endDate = new Date(event.ends_at)
        const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
        const locationText = [event.location.name, event.location.street_address, event.location.city].filter(i=>i).join(", ")
        const cleanDescription = DOMPurify.sanitize(event.description, { USE_PROFILES: { html: true } })

        return (
          <div key={event.id}>
            <div className="p-6 bg-light text-dark rounded-xl relative">
              <Link className="text-xl no-underline hover:text-highlight" href={`/events/${event.slug}`}>
                <h1 className="font-title text-xl md:text-2xl mb-4 text-center">
                  {event.title}
                </h1>
              </Link>
              <div className="">
                {
                  (event.main_image) &&
                  <Image
                    className="relative w-full h-full object-cover rounded-xl mb-4"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.main_image}`}
                    alt={"Event image"} 
                    width={800}
                    height={800}
                  />
                }
                <div className="flex-1 mb-4">
                  <p className="mb-1">{`Starts at: ${startDateText}`}</p>
                  <p className="mb-1">{`Ends at: ${endDateText}`}</p>
                  <p className="mb-1">{`Location: ${locationText}`}</p>
                  <p className="mb-1">{`Organizer: ${event.organizer}`}</p>
                  <p className="">{`Contact: ${event.contact}`}</p>
                </div>

                <div className="">
                  <Link className="font-medium underline" href={`/events/${event.slug}`}>{`Event page`}</Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </section>
  )
}