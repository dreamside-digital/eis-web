import { getEvent } from '@/lib/data-access'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";

const DATE_FORMAT = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }


export default async function EventPage({params}) {
  const { slug } = params
  const event = await getEvent(slug)
  const tagsText = event.tags.map(t => t.name).join(", ")
  const startDate = new Date(event.starts_at)
  const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
  const endDate = new Date(event.ends_at)
  const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
  // const locationText = [event.location.name, event.location.street_address, event.location.city].filter(i=>i).join(", ")
  const locationText = [event.venue, event.address].filter(i=>i).join(", ")
  const cleanDescription = DOMPurify.sanitize(event.description, { USE_PROFILES: { html: true } })
  const cleanInstructions = DOMPurify.sanitize(event.instructions, { USE_PROFILES: { html: true } })

  return (
    <>
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
      </div>
      <div className="container max-w-screen-lg mx-auto relative flex justify-center pt-6">
        <div className="p-6 w-full bg-beige text-dark ">
          <div className="flex flex-col lg:flex-row lg:gap-4">
            <div>
                {
                  event.main_image &&
                  <Image
                    className="max-w-80 relative w-full h-full object-cover  aspect-square mr-6"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.main_image}`}
                    alt={event.main_image.description || event.title} 
                    width={800}
                    height={800}
                  />
                }
            </div>
            <div className="flex-1 flex flex-col">
              <h1 className="font-title text-2xl md:text-4xl mb-6">
                {event.title}
              </h1>
              <p className="uppercase tracking-wide text-sm mb-2">{`${startDateText} - ${endDateText}`}</p>
              <p className="uppercase tracking-wide text-sm mb-2">{`${locationText}`}</p>
              <p className="my-4">{event.event_preview}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="text-dark relative">
      <div className="container max-w-screen-lg mx-auto px-6 mb-12 lg:mb-20">
        <div className="flex flex-col md:flex-row max-md:divide-y md:divide-x">
          <div className="basis-3/4 md:pr-8">
          {(cleanDescription.length > 0) &&
            <div className="mb-6">
              <p className="font-title text-2xl">Details</p>
              <div className="" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
            </div>
          }

          {(cleanInstructions.length > 0) &&
            <div className="mb-6">
              <p className="font-title text-2xl">Instructions</p>
              <div className="" dangerouslySetInnerHTML={{ __html: cleanInstructions }} />
            </div>
          } 
          </div>

          <div className="basis-1/4 max-md:pt-6 md:pl-8">
            {(event.tags?.length > 0) &&
            <div className="mb-6">
              <p className="uppercase mb-2 font-medium">Tags</p>
              {event.tags?.map(tag => {
                return <div key={tag.name} className="">{tag.name}</div>
              })}
            </div>
            }

            {(event.links?.length > 0) &&
              <div className="mb-6">
                <p className="uppercase mb-2 font-medium">Links</p>
                {event.links?.map(link => {
                  return <div key={link.url} className=""><a className="underline hover:text-aubergine" href={link.url}>{link.link_text}</a></div>
                })}
              </div>
            }

            <div className="mb-6">
              <p className="uppercase mb-2 font-medium">Organizer</p>
              <p>{event.organizer}</p>
            </div>

            <div className="mb-6">
              <p className="uppercase mb-2 font-medium">Contact</p>
              <p>{event.contact}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    </>
  )
}