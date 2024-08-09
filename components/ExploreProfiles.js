"use client"

import Carousel from "@/components/Carousel"
import Filters from "@/components/Filters"
import {useState, useEffect} from 'react'
import {getProfiles} from '@/utils/directus'

export default function ExploreProfiles({profiles, tags}) {
  const [filteredProfiles, setFilteredProfiles] = useState(profiles)
  
  const selectedTags = tags.map(t => t.id)
  const [currentFilters, setCurrentFilters] = useState({ proximity: true, tags: selectedTags})

  useEffect(() => {
    const fetchProfiles = async() => {
      const data = await getProfiles(currentFilters)
      setFilteredProfiles(data)
    }

    fetchProfiles()

  }, [currentFilters])

  return (
    <div className="flex flex-col gap-6 md:flex-row pt-12">
      <div className="basis-1/4">
        <h1 className="font-title text-4xl mb-6">Explore profiles</h1>
        <Filters 
          tags={tags} 
          currentFilters={currentFilters} 
          setCurrentFilters={setCurrentFilters} 
        />
      </div>
      <div className="basis-3/4 flex justify-center">
        <div className="">
          <Carousel profiles={filteredProfiles} />
        </div>
      </div>
    </div>
  )
}