"use client"

import Carousel from "@/components/Carousel"
import Accordion from "@/components/Accordion"
import Filters from "@/components/Filters"
import {useState, useEffect} from 'react'
import {getEvent} from '@/utils/directus'
import { ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, RectangleStackIcon } from '@heroicons/react/24/solid'


import Image from 'next/image'
import Link from 'next/link'

const PAGE_LIMIT = 5

export default function ExploreEvents({events, tags, locale, messages }) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [currentPage, setCurrentPage] = useState(0)
  const [showAccordion, setShowAccordion] = useState(true)
  
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
    <div className="flex flex-col gap-6 md:flex-row pt-12">
      <div className="basis-1/4">
        <h1 className="font-title text-4xl mb-6">{messages.explore_events}</h1>
        <button onClick={toggleDisplayMode} className="bg-dark hover:bg-highlight rounded-full px-3 py-1 text-white mb-6">
          { showAccordion ? (
            <div className="inline-flex items-center gap-1">
              <Squares2X2Icon className="w-4 h-4" />
              <span>Grid view</span>
            </div>
            ) : (
            <div className="inline-flex items-center gap-1">
              <RectangleStackIcon className="w-4 h-4" />
              <span>Slide view</span>
            </div>
          )}
        </button>
        <Filters 
          tags={tags} 
          currentFilters={currentFilters} 
          setCurrentFilters={setCurrentFilters} 
          messages={messages}
        />
      </div>
      { showAccordion &&
      <div className="basis-3/4">
        <div className="flex justify-between">
          <div className="hidden md:flex items-center p-2">
            <button className={`btn text-sm px-4 py-2 w-12 h-12 rounded-full ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>
              <ChevronLeftIcon />
            </button>
          </div>
          <div>
            <Accordion events={eventsPage} locale={locale} messages={messages} />
          </div>
          <div className="hidden md:flex items-center p-2">
            <button className={`btn text-sm px-4 py-2 w-12 h-12 rounded-full ${(pageEndIndex >= filteredEvents.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredEvents.length)}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <div className="flex md:hidden gap-2 mt-2 justify-center">
          <button className={`btn text-sm px-4 py-2 w-12 h-12 rounded-full ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>
              <ChevronLeftIcon />
            </button>
            <button className={`btn text-sm px-4 py-2 w-12 h-12 rounded-full ${(pageEndIndex >= filteredEvents.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredEvents.length)}>
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
              return (
                <div className="max-w-lg h-full" key={event.id}>
                  <div className="h-full p-6 bg-light text-dark relative">
                    <Link className="text-xl no-underline hover:text-highlight" href={`/${locale}/events/${event.slug}`}>
                      <h1 className="font-title text-xl md:text-2xl mb-4">
                        {event.public_name}
                      </h1>
                    </Link>
                    <p className="mb-4">{event.pronouns}</p>
                    <div className="">
                      {
                        event.event_picture &&
                        <Image
                          className="relative w-full h-auto aspect-video object-cover rounded-xl mb-4"
                          src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.event_picture}`}
                          alt={event.public_name} 
                          width={500}
                          height={500}
                        />
                      }
                      <div className="flex-1">
                        <p className="mb-4">{event.short_introduction}</p>
                      </div>

                      <div className="flex-1 mb-4">
                        {(event.tags.length > 0) && <p className="uppercase font-medium tracking-wide text-sm">{`${messages.tags}: ${tagsText}`}</p>}
                      </div>

                      <Link href={`/${locale}/events/${event.slug}`} className="font-medium underline">
                        {messages.full_event}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      }
    </div>
  )
}