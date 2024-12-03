"use client"

import Image from "next/image";
import Link from "next/link";
import { geocodeAddress } from '@/utils/mapbox'
import { useState } from "react"


export default function LocationSelector({className, handleSelect}) {
  const [options, setOptions] = useState()
  const [address, setAddress] = useState("")

  const handleChange = async(e) => {
    const query = e.target.value
    setAddress(query)

    if (query.length > 2) {
      const results = await geocodeAddress(query)
      setOptions(results.features)
    }
  }

  const selectLocation = (location) => (e) => {
    e.preventDefault()
    setAddress(location.properties.full_address)
    handleSelect(location)
    setOptions()
  }
  
  return (
    <div className={`flex flex-col mb-4 mt-2 relative ${className}`}>
      <input 
        onChange={handleChange} 
        value={address} 
        className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        type="text" 
        id={'address'} 
        name={'address'} 
        placeholder="Full address or postal code" 
      />
      <div className="absolute top-10 z-10 left-0 right-0 flex flex-col bg-slate-100 shadow divide-y">
        {
          options?.map(option => {
            return <button className="p-1 focus:bg-light hover:bg-white " key={option.id} onClick={selectLocation(option)}>{option.properties.full_address}</button>
          })
        }
      </div>
    </div>
  )
}
