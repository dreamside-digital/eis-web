"use client"

import { MapPinIcon, MapIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'
import Loader from '@/components/Loader'

export default function ProximityFilter({ 
  location,
  setLocation,
  messages,
  maxDistance,
  setMaxDistance
}) {

  const [locationError, setLocationError] = useState()
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [useAddress, setUseAddress] = useState(false)
  const [address, setAddress] = useState("")
  const [loadingLocation, setLoadingLocation] = useState(false)

  const getCurrentLocation = () => {
    setLoadingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async(position) => {
        setLocation(position.coords)
        const {features} = await reverseGeocodeLocation(position.coords)
        if (features?.length > 0) {
          const topResult = features[0]
          console.log({topResult})
          const approxAddress = topResult.properties.context.postcode.name
          setAddress(approxAddress)
        }
        setLoadingLocation(false)
      });
    } else {
      console.log("geolocation is not available")
      setLocationError("Geolocation is not available on your device")
      setLoadingLocation(false)
    }
  }

  const geocodeAddress = async(searchTerm) => {
    const mapboxUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURI(searchTerm)}&country=ca&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    const result = await fetch(mapboxUrl)
    const data = await result.json()
    return data
  }

  const reverseGeocodeLocation = async(coords) => {
    const mapboxUrl = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${coords.longitude}&latitude=${coords.latitude}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    const result = await fetch(mapboxUrl)
    const data = await result.json()
    return data
  }

  const handleDistanceInput = e => {
    return setCurrentFilters({
      ...currentFilters,
      limitByDistance: e.target.checked
    })
  }

  const handleCurrentLocationInput = e => {
    if (e.target.checked) {
      getCurrentLocation()
      setUseCurrentLocation(true)
      setUseAddress(false)
    }
  }

  const handleUseAddressInput = e => {
    if (e.target.checked) {
      setUseAddress(true)
      setUseCurrentLocation(false)
    }
  }

  const handleAddressForm = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const searchTerm = formData.get('address')
    const { features } = await geocodeAddress(searchTerm)

    if (features?.length > 0) {
      const topResult = features[0]
      const location = {
        latitude: topResult.geometry.coordinates[1],
        longitude: topResult.geometry.coordinates[0]
      }
      setAddress(topResult.properties.full_address)
      setLocation(location)
    } else {
      setLocationError("Unable to find location, please try again")
    }
    
  }

  const handleMaxDistance = e => {
    const distance = parseInt(e.target.value)
    return setMaxDistance(distance)
  }

  const resetLocationForms = () => {
    setAddress("")
    setLocation(null)
    setLocationError(null)
    setUseAddress(false)
    setUseCurrentLocation(false)
  }

  return (
    <div className="">
      <p className="uppercase text-lg mb-2 font-medium">Search by location</p>
      {loadingLocation ?
        (<Loader className="w-6 h-6" text="Getting your location..." />) : (
          <>
        { !address && 
          <>
            <div>
              <input className="mr-2" type="radio" id={'useLocation'} name={'useLocation'} checked={useCurrentLocation} onChange={handleCurrentLocationInput} />
              <label htmlFor={`useLocation`}>Use my location</label>
            </div>
            <div>
              <input className="mr-2" type="radio" id={'useAddress'} name={'useAddress'} checked={useAddress} onChange={handleUseAddressInput} />
              <label htmlFor={`useAddress`}>Use an address</label>
            </div>
            { useAddress &&
              <div className="flex flex-col mb-4">
                <form onSubmit={handleAddressForm}>
                  <input className="border border-1" type="text" id={'address'} name={'address'} placeholder="" />
                  <input className="btn" type="submit" value="Go" />
                </form>
              </div>
            }
          </>
        }

        {address &&
          <>
            <div className="mb-2 flex gap-2">
              <MapPinIcon className="w-6 h-6" />
              <div>
                <p className="mb-0"><span className="font-medium">Your Location: </span>{address}</p>
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <MapIcon className="w-6 h-6" />
              <div>
                <div className="flex gap-2 items-center nowrap">
                  <label htmlFor={`distance`} className="font-medium">Max Distance</label>
                  <input 
                    className="border border-1 flex-1" 
                    type="range" 
                    id={'distance'} 
                    name={'distance'} 
                    min="0" 
                    max="100" 
                    step="5"
                    value={maxDistance}
                    onChange={handleMaxDistance}
                  />
                  <p className="uppercase w-16 mb-0">{`${maxDistance}km`}</p>
                </div>
              </div>
            </div>
            <button onClick={resetLocationForms} className="underline text-sm">Reset</button>
          </>
        }
        </>
        )
      }


    </div>
  )
}
