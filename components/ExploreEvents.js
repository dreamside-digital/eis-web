"use client"

import Carousel from "@/components/Carousel"
import Accordion from "@/components/Accordion"
import TagFilter from "@/components/TagFilter"
import ProximityFilter from "@/components/ProximityFilter"
import ViewSwitcher from "@/components/ViewSwitcher"
import {useState, useEffect} from 'react'
import {getEvents} from '@/lib/data-access'
import { ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import { DATE_FORMAT } from '@/utils/constants'
import TagButton from '@/components/TagButton'
import CalendarView from '@/components/CalendarView'
import DOMPurify from "isomorphic-dompurify";

import Image from 'next/image'
import Link from 'next/link'

const PAGE_LIMIT = 5

export default function ExploreEvents({events, tags, locale, messages }) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [currentPage, setCurrentPage] = useState(0)
  const [view, setView] = useState("grid")
  const [currentFilters, setCurrentFilters] = useState({tags: []})
  const [orderByProximity, setOrderByProximity] = useState(false)
  const [location, setLocation] = useState()
  
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
    setShowCalendar(!showCalendar)
  }

  const pageStartIndex = currentPage * PAGE_LIMIT
  const pageEndIndex = pageStartIndex + PAGE_LIMIT
  const eventsPage = filteredEvents.slice(pageStartIndex, pageEndIndex)
  return (
    <div className="flex-col gap-6 pt-12">
      <h1 className="font-title text-4xl md:text-6xl lg:text-7xl mb-6">{messages.explore_events}</h1>
      <div className="filters bg-white lg:py-6 mb-6 grid max-lg:divide-y lg:grid-cols-3 lg:divide-x">
        <div className="max-lg:py-6 px-6">
          <ProximityFilter 
            location={location}
            setLocation={setLocation}
            orderByProximity={orderByProximity}
            setOrderByProximity={setOrderByProximity}
            messages={messages}
          />
        </div>
        <div className="max-lg:py-6 px-6">
          <TagFilter 
            tags={tags} 
            currentFilters={currentFilters} 
            setCurrentFilters={setCurrentFilters} 
            messages={messages}
          />
        </div>
        <div className="max-lg:py-6 px-6">
          <ViewSwitcher 
            options={[{ value: "grid", label: "Grid"}, { value: "calendar", label: "Calendar"}]}
            view={view} 
            setView={setView} 
          />
        </div>
      </div>
      { (view === 'calendar') &&
      <div className="">
        <CalendarView events={filteredEvents} />
      </div>
      }

      { (view === "grid") &&
        <div className="basis-3/4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            })}
          </div>
        </div>
      }
    </div>
  )
}