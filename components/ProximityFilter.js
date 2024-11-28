"use client"

import { MapPinIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'

export default function ProximityFilter({ 
  orderByProximity, 
  setOrderByProximity, 
  location,
  setLocation,
  messages 
}) {

  const [locationError, setLocationError] = useState()
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [useAddress, setUseAddress] = useState(false)
  const [address, setAddress] = useState("")
  const [maxDistance, setMaxDistance] = useState(0)
  const [loadingLocation, setLoadingLocation] = useState(false)

  const getCurrentLocation = () => {
    setLoadingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async(position) => {
        setLocation(position.coords)
        const {features} = await reverseGeocodeLocation(position.coords)
        if (features?.length > 0) {
          const topResult = features[0]
          const fullAddress = topResult.properties.full_address
          setAddress(fullAddress)
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

  const handleTagInput = id => event => {
    let selected = [...currentFilters.tags]
    const clickedIndex = selected.indexOf(id)

    if (clickedIndex === -1) {
      selected = selected.concat(id)
    } else {
      selected.splice(clickedIndex, 1)
    }

    return setCurrentFilters({
      ...currentFilters,
      tags: selected
    })
  }

  const handleProximityInput = e => {
    return setOrderByProximity(e.target.checked)
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
    const distance = e.target.value
    setMaxDistance(distance)
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
      {loadingLocation &&
        <p>Getting your location...</p>
      }

      {address &&
        <div className="mb-4 flex gap-2">
          <MapPinIcon className="w-6 h-6" />
          <div>
            <p className="mb-0">{address}</p>
            <button onClick={resetLocationForms} className="underline text-sm">Clear location</button>
          </div>
        </div>
      }

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
          <div>
            <input className="mr-2" type="checkbox" id={'orderByProximity'} name={'orderByProximity'} checked={orderByProximity} onChange={handleProximityInput} />
            <label htmlFor={`orderByProximity`}>Order by proximity</label>
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor={`distance`}>
              <span>Limit by Distance</span>
              {(maxDistance > 0) && <span>{`: ${maxDistance}km`}</span>}
            </label>
            <input 
              className="border border-1" 
              type="range" 
              id={'distance'} 
              name={'distance'} 
              min="0" 
              max="100" 
              step="5"
              value={maxDistance}
              onChange={handleMaxDistance}
            />
          </div>
        </>
      }

    </div>
  )
}