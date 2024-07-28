"use client"

import Carousel from "@/components/Carousel"
import Filters from "@/components/Filters"
import {useState, useEffect} from 'react'
import {getEvents} from '@/utils/directus'

export default function ExploreEvents({events, tags}) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  
  const selectedTags = tags.map(t => t.id)
  const [currentFilters, setCurrentFilters] = useState({ proximity: true, tags: selectedTags})

  useEffect(() => {
    const fetchEvents = async() => {
      const data = await getEvents(currentFilters)
      setFilteredEvents(data)
    }

    fetchEvents()

  }, [currentFilters])

  return (
    <div className="flex flex-col gap-6 md:flex-row pt-12">
      <div className="basis-1/4">
        <h1 className="font-title text-4xl mb-6">Explore events</h1>
        <Filters 
          tags={tags} 
          currentFilters={currentFilters} 
          setCurrentFilters={setCurrentFilters} 
        />
      </div>
      <div className="basis-3/4 flex justify-center">
        <div className="max-w-lg">
          <Carousel events={filteredEvents} />
        </div>
      </div>
    </div>
  )
}