import { getEvent } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";

const DATE_FORMAT = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }


export default async function EventPage({slug}) {
  const event = await getEvent(slug)

  const tagsText = event.tags.map(t => t.name).join(", ")
  const startDate = new Date(event.starts_at)
  const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
  const endDate = new Date(event.ends_at)
  const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
  const locationText = [event.location.name, event.location.street_address, event.location.city].filter(i=>i).join(", ")
  const cleanDescription = DOMPurify.sanitize(event.description, { USE_PROFILES: { html: true } })

  return (
    <>
    <section className="bg-white text-navy p-6 py-12 pt-24 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-1/2 w-full">
      </div>
      <div className="container mx-auto max-w-xl p-6 bg-beige  text-navy rounded-xl relative">
        <h1 className="font-title text-4xl md:text-6xl mb-6 text-center">
          {event.title}
        </h1>
        <div className="">
          {
            (event.images.length > 0) &&
            <Image
              className="relative w-full h-full object-cover rounded-xl mb-6"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.images[0].directus_files_id}`}
              alt={"Event image"} 
              width={800}
              height={800}
            />
          }
          <div className="flex-1">
            <p className="text-lg md:text-xl mb-2">{`Starts at: ${startDateText}`}</p>
            <p className="text-lg md:text-xl mb-2">{`Ends at: ${endDateText}`}</p>
            <p className="text-lg md:text-xl mb-2">{`Location: ${locationText}`}</p>
            <p className="text-lg md:text-xl mb-2">{`Organizer: ${event.organizer}`}</p>
            <p className="text-lg md:text-xl mb-2">{`Contact: ${event.contact}`}</p>
          </div>

          <div>
            {event.links.map(link => {
              return <div key={link.url} className="my-6"><a className="text-2xl underline hover:text-aubergine" href={link.url}>{link.link_text}</a></div>
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white text-navy">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="md:flex gap-8 lg:gap-12">
            <div className="flex-1">
              <h2 className="text-title text-3xl md:text-5xl font-medium mb-8">Details</h2>
              <div className="md:text-lg mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
              {(event.tags.length > 0) && <p className="uppercase font-medium tracking-wide my-6">{`Tags: ${tagsText}`}</p>}
            </div>
            <div className="flex-1">
              <h2 className="text-title text-3xl md:text-5xl font-medium mb-8">Instructions</h2>
              <p className="md:text-lg">{event.instructions}</p>
            </div>
          </div>
        </div>
        
      </section>
    </>
  )
}