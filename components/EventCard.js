import Image from 'next/image'
import Link from 'next/link'
import TagButton from '@/components/TagButton'
import { DATE_FORMAT } from '@/utils/constants'

export default function EventCard({ event }) {
  if (!event) return null;
  const tagsText = event.tags.map(t => t.name).join(", ")
  const startDate = new Date(event.starts_at)
  const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
  const endDate = new Date(event.ends_at)
  const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
  const locationText = [event.title, event.address].filter(i=>i).join(", ")
  const cleanDescription = DOMPurify.sanitize(event.description, { USE_PROFILES: { html: true } })
  return (
    <div className="max-w-lg h-full" key={event.id}>
      <Link className="no-underline hover:no-underline" href={`/events/${event.slug}`}>
        <div className="p-6 bg-beige text-dark relative">
          <h1 className="font-title text-xl md:text-2xl mb-4 text-center">
            {event.title}
          </h1>
        <div className="">
          {
            (event.main_image) &&
            <Image
              className="relative w-full h-full object-cover  mb-4"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.main_image}`}
              alt={"Event image"} 
              width={500}
              height={500}
            />
          }
          <div className="flex-1 mb-4">
            <p className="">{`${startDateText} - ${endDateText}`}</p>
            <p className="">{`${locationText || "TBA"}`}</p>
            <p className="">{`Organizer: ${event.organizer}`}</p>
          </div>
          <div className="inline-flex gap-1">
            {event.tags.map(t => <TagButton key={t.id} tag={t} />)}
          </div>
        </div>
      </div>
      </Link>
    </div>
  )
}
  