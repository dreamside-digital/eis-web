import { getEvent } from '@/utils/directus'
import Image from 'next/image'

const DATE_FORMAT = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }


export default async function EventPage({slug}) {
  const event = await getEvent(slug)

  const tagsText = event.tags.map(t => t.name).join(", ")
  const startDate = new Date(event.starts_at)
  const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
  const endDate = new Date(event.ends_at)
  const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
  const locationText = [event.location.name, event.location.street_address, event.location.city].filter(i=>i).join(", ")

  return (
    <>
    <section className="bg-navy text-beige py-12 lg:py-24 relative">
      <div className="container mx-auto max-w-screen-lg p-6">
        <Image
          className="relative w-full h-full object-cover rounded-xl mb-6"
          src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.images[0].directus_files_id}`}
          alt={"Event image"} 
          width={800}
          height={800}
        />
        <h1 className="font-title text-4xl md:text-6xl my-8 text-center">
          {event.title}
        </h1>
        <p className="text-2xl uppercase font-medium text-center tracking-wide mb-6">{startDateText} - {endDateText}</p>
        <div className="">
          <div className="flex-1">
            <p className="text-lg md:text-2xl mb-8 leading-relaxed">{event.description}</p>
          </div>

          <div>
            {event.links.map(link => {
              return <div key={link.url} className="mb-4"><a className="text-2xl underline hover:text-white" href={link.url}>{link.link_text}</a></div>
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white text-navy">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <h2 className="text-title text-3xl md:text-5xl font-medium mb-8">Details</h2>
          <div className="md:flex gap-8 lg:gap-12">
            <div className="flex-1">
              <p className="text-xl md:text-2xl mb-2">{`Starts at: ${startDateText}`}</p>
              <p className="text-xl md:text-2xl mb-2">{`Ends at: ${endDateText}`}</p>
              <p className="text-xl md:text-2xl mb-2">{`Location: ${locationText}`}</p>
              <p className="text-xl md:text-2xl mb-2">{`Organizer: ${event.organizer}`}</p>
              <p className="text-xl md:text-2xl mb-2">{`Tags: ${tagsText}`}</p>
              <p className="text-xl md:text-2xl mb-2">{`Contact: ${event.contact}`}</p>
            </div>
            <div className="flex-1">
              <p className="md:text-lg">{event.instructions}</p>
            </div>
          </div>
        </div>
        
      </section>
    </>
  )
}