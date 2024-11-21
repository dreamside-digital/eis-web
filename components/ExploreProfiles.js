"use client"

import Carousel from "@/components/Carousel"
import Accordion from "@/components/Accordion"
import Filters from "@/components/Filters"
import {useState, useEffect} from 'react'
import {getProfiles} from '@/utils/directus'
import { ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, RectangleStackIcon } from '@heroicons/react/24/solid'
import TagButton from '@/components/TagButton'

import Image from 'next/image'
import Link from 'next/link'

const PAGE_LIMIT = 5

export default function ExploreProfiles({profiles, tags, locale, messages }) {
  const [filteredProfiles, setFilteredProfiles] = useState(profiles)
  const [currentPage, setCurrentPage] = useState(0)
  const [showAccordion, setShowAccordion] = useState(false)
  
  const [currentFilters, setCurrentFilters] = useState({tags: []})
  const [orderByProximity, setOrderByProximity] = useState(false)
  const [currentLocation, setCurrentLocation] = useState()

  const fetchProfiles = async() => {
    const data = await getProfiles(currentFilters)
    setFilteredProfiles(data)
  }

  useEffect(() => {
    fetchProfiles()

  }, [currentFilters])

  useEffect(() => {

    if (orderByProximity) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurrentLocation(position.coords)
        });
      } else {
        console.log("geolocation is not available")
      }
    } else {
      fetchProfiles()
    }
  }, [orderByProximity])

  const orderProfilesByProximity = (currentLocation) => {
    const profilesWithDistance = [...filteredProfiles].map(profile => {
      if (!profile.location) return null
      const currentLat = currentLocation.latitude * Math.PI / 180;
      const currentLng = currentLocation.longitude * Math.PI / 180;
      const profileLat = profile.location.coordinates[1] * Math.PI / 180;
      const profileLng = profile.location.coordinates[0] * Math.PI / 180;
      const distance = Math.acos(Math.sin(currentLat)*Math.sin(profileLat) + 
                                  Math.cos(currentLat)*Math.cos(profileLat) *
                                  Math.cos(profileLng - currentLng)) * 6371;
      return { ...profile, distance }
    }).filter(i => i)

    const orderedProfiles = profilesWithDistance.sort((a,b) => {
      return a.distance - b.distance
    })

    return orderedProfiles
  }

  useEffect(() => {
    if (orderByProximity && currentLocation) {
      const orderedProfiles = orderProfilesByProximity(currentLocation)
      setFilteredProfiles(orderedProfiles)
    }
  }, [currentLocation])

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
  const profilesPage = filteredProfiles.slice(pageStartIndex, pageEndIndex)

  return (
    <div className="flex-col gap-6 md:flex-row pt-12">
      <div className="basis-1/4">
        <h1 className="font-title text-4xl mb-6">{messages.explore_profiles}</h1>
        <button onClick={toggleDisplayMode} className="bg-dark hover:bg-highlight px-3 py-1 text-white mb-6">
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
          orderByProximity={orderByProximity}
          setOrderByProximity={setOrderByProximity}
          messages={messages}
        />
      </div>
      { showAccordion &&
      <div className="basis-3/4">
        <div className="flex justify-between">
          <div className="hidden md:flex items-center p-2">
            <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>
              <ChevronLeftIcon />
            </button>
          </div>
          <div>
            <Accordion profiles={profilesPage} locale={locale} messages={messages} />
          </div>
          <div className="hidden md:flex items-center p-2">
            <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(pageEndIndex >= filteredProfiles.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredProfiles.length)}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
        <div className="flex md:hidden gap-2 mt-2 justify-center">
          <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(currentPage <= 0) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={decrementPage} disabled={(currentPage <= 0)}>
              <ChevronLeftIcon />
            </button>
            <button className={`btn text-sm px-4 py-2 w-12 h-12 ${(pageEndIndex >= filteredProfiles.length) ? 'bg-slate-200 text-slate-400' : 'bg-dark text-white hover:bg-highlight'}`} onClick={incrementPage} disabled={(pageEndIndex >= filteredProfiles.length)}>
              <ChevronRightIcon />
            </button>
        </div>
      </div>
      }

      { !showAccordion &&
        <div className="basis-3/4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            { filteredProfiles.map(profile => {
              const tagsText = profile.tags.map(t => t.name).join(", ")
              return (
                <div className="max-w-lg h-full" key={profile.id}>
                  <Link className="hover:no-underline" href={`/${locale}/profiles/${profile.slug}`}>
                    <div className="h-full p-6 bg-light text-dark relative">
                      <h1 className="font-title text-xl md:text-2xl mb-4">
                        {profile.public_name}
                      </h1>
                    
                      <p className="mb-4">{profile.pronouns}</p>
                      <div className="">
                        {
                          profile.profile_picture &&
                          <Image
                            className="relative w-full h-auto aspect-video object-cover  mb-4"
                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                            alt={profile.public_name} 
                            width={500}
                            height={500}
                          />
                        }
                        <div className="flex-1">
                          <p className="mb-4">{profile.short_introduction}</p>
                          {
                            profile.distance &&
                            <p className="mb-4">{`Distance: ${Math.floor(profile.distance)}km`}</p>
                          }
                        </div>

                        <div className="inline-flex gap-1">
                          {profile.tags.map(t => <TagButton tag={t} key={t.id} />)}
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