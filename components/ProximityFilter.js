"use client"

import { MapPinIcon, MapIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'
import Loader from '@/components/Loader'
import LocationSelector from '@/components/LocationSelector'
import { geocodeAddress, reverseGeocodeLocation } from '@/services/mapbox'
import {useTranslations} from 'next-intl';

export default function ProximityFilter({ 
  location,
  setLocation,
  maxDistance,
  setMaxDistance
}) {

  const [locationError, setLocationError] = useState()
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [useAddress, setUseAddress] = useState(false)
  const [address, setAddress] = useState("")
  const [loadingLocation, setLoadingLocation] = useState(false)
  const t = useTranslations('shared_messages')

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

  const handleLocationSelect = location => {
    setAddress(location.properties.context.postcode.name)
    setLocation(location.properties.coordinates)
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
      <p className="uppercase text-lg mb-2 font-medium">{t('search_by_location')}</p>
      {loadingLocation ?
        (<Loader className="w-6 h-6" text={t('getting_location')} />) : (
          <>
        { !address && 
          <>
            <div>
              <input className="mr-2" type="radio" id={'useLocation'} name={'useLocation'} checked={useCurrentLocation} onChange={handleCurrentLocationInput} />
              <label htmlFor={`useLocation`}>{t('use_location')}</label>
            </div>
            <div>
              <input className="mr-2" type="radio" id={'useAddress'} name={'useAddress'} checked={useAddress} onChange={handleUseAddressInput} />
              <label htmlFor={`useAddress`}>{t('use_address')}</label>
            </div>
            { useAddress &&
              <div className="flex flex-col mb-4">
                <LocationSelector handleSelect={handleLocationSelect} />
              </div>
            }
          </>
        }

        {address &&
          <>
            <div className="mb-2 flex gap-2">
              <MapPinIcon className="w-6 h-6" />
              <div>
                <p className="mb-0"><span className="font-medium">{`${t('your_location')}: `}</span>{address}</p>
              </div>
            </div>
            <div className="mb-4 flex gap-2">
              <div>
                <div className="flex gap-2 items-center nowrap">
                  <MapIcon className="w-6 h-6" />
                  <label htmlFor={`distance`} className="font-medium whitespace-nowrap">{t('max_distance')}</label>
                  <input 
                    className={`border border-1 flex-1 ${maxDistance === 0 ? 'distance-off' : 'distance-on'}`} 
                    type="range" 
                    id={'distance'} 
                    name={'distance'} 
                    min="0" 
                    max="100" 
                    step="5"
                    value={maxDistance}
                    onChange={handleMaxDistance}
                  />
                  {(maxDistance > 0) && <p className="uppercase w-16 mb-0">{`${maxDistance}km`}</p>}
                </div>
              </div>
            </div>
            <button onClick={resetLocationForms} className="underline text-sm">{t('reset')}</button>
          </>
        }
        </>
        )
      }


    </div>
  )
}
