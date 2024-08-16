"use client"

import Carousel from "@/components/Carousel"
import Accordion from "@/components/Accordion"
import Filters from "@/components/Filters"
import {useState, useEffect} from 'react'
import {getProfiles} from '@/utils/directus'

const PAGE_LIMIT = 5

export default function ExploreProfiles({profiles, tags}) {
  const [filteredProfiles, setFilteredProfiles] = useState(profiles)
  const [currentPage, setCurrentPage] = useState(0)
  
  const selectedTags = tags.map(t => t.id).concat('all')
  const [currentFilters, setCurrentFilters] = useState({ proximity: true, tags: selectedTags})

  useEffect(() => {
    const fetchProfiles = async() => {
      const data = await getProfiles(currentFilters)
      setFilteredProfiles(data)
    }

    fetchProfiles()

  }, [currentFilters])

  const incrementPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const decrementPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const pageStartIndex = currentPage * PAGE_LIMIT
  const pageEndIndex = pageStartIndex + PAGE_LIMIT
  const profilesPage = filteredProfiles.slice(pageStartIndex, pageEndIndex)

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
      <div className="basis-3/4">
        <div className="flex justify-center">
          <div>
          <Accordion profiles={profilesPage} />
          </div>
        </div>
        <div className="flex justify-center gap-2 p-3">
          <button className={`btn text-sm px-4 py-2 rounded-full ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>Previous</button>
          <button className={`btn text-sm px-4 py-2 rounded-full ${(pageEndIndex >= filteredProfiles.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredProfiles.length)}>Next</button>
        </div>
      </div>
    </div>
  )
}