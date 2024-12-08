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
import Loader from '@/components/Loader'

import Image from 'next/image'
import Link from 'next/link'

const PAGE_LIMIT = 5

export default function ExploreEvents({tags, locale, messages }) {
  const [filteredEvents, setFilteredEvents] = useState([])
  const [nearbyEvents, setNearbyEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [view, setView] = useState("grid")
  const [selectedTags, setSelectedTags] = useState([])
  const [orderByProximity, setOrderByProximity] = useState(false)
  const [maxDistance, setMaxDistance] = useState(0)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  const resetLocation = () => {
    setLocation(null)
    setNearbyEvents([])
    setMaxDistance(0)
    fetchProfiles()
  }
  
  const applyFilters = async() => {
    setLoading(true)
    const filtered = await getEvents(selectedTags)

    setFilteredEvents(filtered)
    setLoading(false)
  }

  useEffect(() => {
    applyFilters()
  }, [selectedTags])

  useEffect(() => {
    orderProfilesByProximity()
  }, [location, filteredEvents])

  useEffect(() => {
    if (location && maxDistance === 0) {
      const eventsWithDistance = calculateDistanceFromLocation()
      setNearbyEvents(eventsWithDistance)
    }
    if (location && maxDistance > 0) {
      filterByMaxDistance()
    }
  }, [maxDistance, location, filteredEvents])


  const orderProfilesByProximity = () => {
    if (location) {
      const eventsWithDistance = calculateDistanceFromLocation()

      const orderedEvents = eventsWithDistance.sort((a,b) => {
        return a.distance - b.distance
      })
      setNearbyEvents(orderedEvents)
    }
  }

  const calculateDistanceFromLocation = () => {
    if (location) {
      const eventsWithDistance = [...filteredEvents].map(profile => {
        if (!profile.location) return null
        const currentLat = location.latitude * Math.PI / 180;
        const currentLng = location.longitude * Math.PI / 180;
        const profileLat = profile.location.coordinates[1] * Math.PI / 180;
        const profileLng = profile.location.coordinates[0] * Math.PI / 180;
        const distance = Math.acos(Math.sin(currentLat)*Math.sin(profileLat) + 
                                    Math.cos(currentLat)*Math.cos(profileLat) *
                                    Math.cos(profileLng - currentLng)) * 6371;
        return { ...profile, distance }
      }).filter(i => i)

      return eventsWithDistance
    }

    return filteredEvents
  }

  const filterByMaxDistance = () => {
    const eventsWithDistance = calculateDistanceFromLocation()
    const nearby = eventsWithDistance.filter(p => {
      return p.distance <= maxDistance
    })
    setNearbyEvents(nearby)
  }

  const incrementPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const decrementPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const eventsToDisplay = location ? nearbyEvents : filteredEvents
  const pageStartIndex = currentPage * PAGE_LIMIT
  const pageEndIndex = pageStartIndex + PAGE_LIMIT
  const eventsPage = eventsToDisplay.slice(pageStartIndex, pageEndIndex)

  return (
    <div className="flex-col gap-6 pt-12">
      <h1 className="font-title text-4xl md:text-6xl lg:text-7xl mb-6">{messages.explore_events}</h1>
      <div className="filters bg-white lg:py-6 mb-6 grid max-lg:divide-y lg:grid-cols-3 lg:divide-x">
        <div className="max-lg:py-6 px-6">
          <ProximityFilter 
            location={location}
            setLocation={setLocation}
            maxDistance={maxDistance}
            setMaxDistance={setMaxDistance}
            messages={messages}
          />
        </div>
        <div className="max-lg:py-6 px-6">
          <TagFilter 
            tags={tags} 
            selectedTags={selectedTags} 
            setSelectedTags={setSelectedTags} 
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

      {
        loading && 
        <div className="h-96 flex items-center justify-center">
          <Loader className="w-16 h-16" />
        </div>
      }

      { (!loading && view === 'calendar') &&
      <div className="">
        <CalendarView events={eventsToDisplay} />
      </div>
      }

      { (!loading && view === "grid") &&
        <div className="basis-3/4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            { eventsToDisplay.map(event => {
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
                      <h1 className="font-title text-xl md:text-2xl mb-4">
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
                        <p className="font-medium">{`${startDateText} - ${endDateText}`}</p>
                        <p className="">{`${locationText || "TBA"}`}</p>
                        {
                          event.distance &&
                          <p className="mb-4">{`Distance: ${Math.floor(event.distance)}km`}</p>
                        }
                        <p className="">{`Organized by: ${event.organizer}`}</p>
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