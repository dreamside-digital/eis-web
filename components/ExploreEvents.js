"use client"

import Carousel from "@/components/Carousel"
import Accordion from "@/components/Accordion"
import Filters from "@/components/Filters"
import {useState, useEffect} from 'react'
import {getEvents} from '@/utils/directus'
import { ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, RectangleStackIcon } from '@heroicons/react/24/solid'
import { DATE_FORMAT } from '@/utils/constants'
import TagButton from '@/components/TagButton'

import Image from 'next/image'
import Link from 'next/link'

const PAGE_LIMIT = 5

export default function ExploreEvents({events, tags, locale, messages }) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [currentPage, setCurrentPage] = useState(0)
  const [showAccordion, setShowAccordion] = useState(false)
  
  const selectedTags = tags.map(t => t.id).concat('all')
  const [currentFilters, setCurrentFilters] = useState({ proximity: true, tags: selectedTags})

  useEffect(() => {
    const fetchEvents = async() => {
      const data = await getEvents(currentFilters)
      setFilteredEvents(data)
    }

    fetchEvents()

  }, [currentFilters])

  const incrementPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const decrementPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const toggleDisplayMode = () => {
    setShowAccordion(!showAccordion)
  }

  const pageStartIndex = currentPage * PAGE_LIMIT
  const pageEndIndex = pageStartIndex + PAGE_LIMIT
  const eventsPage = filteredEvents.slice(pageStartIndex, pageEndIndex)

  return (
    <div className="flex-col gap-6 pt-12">
      <div className="">
        <h1 className="font-title text-4xl mb-6">{messages.explore_events}</h1>
        <Filters 
          tags={tags} 
          currentFilters={currentFilters} 
          setCurrentFilters={setCurrentFilters} 
          messages={messages}
        />
      </div>
      { showAccordion &&
      <div className="">
        <div className="flex justify-between">
          <div className="hidden md:flex items-center p-2">
            <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>
              <ChevronLeftIcon />
            </button>
          </div>
          <div>
            <Accordion events={eventsPage} locale={locale} messages={messages} />
          </div>
          <div className="hidden md:flex items-center p-2">
            <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(pageEndIndex >= filteredEvents.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredEvents.length)}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <div className="flex md:hidden gap-2 mt-2 justify-center">
          <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>
              <ChevronLeftIcon />
            </button>
            <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(pageEndIndex >= filteredEvents.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredEvents.length)}>
              <ChevronRightIcon />
            </button>
        </div>
      </div>
      }

      { !showAccordion &&
        <div className="basis-3/4">
          <div className="grid grid-cols-3 gap-6">
            { filteredEvents.map(event => {
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
                    <div className="p-6 bg-light text-dark relative">
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
            })}
          </div>
        </div>
      }
    </div>
  )
}