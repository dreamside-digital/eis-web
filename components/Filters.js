"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'

export default function Filters({ 
  tags, 
  currentFilters, 
  setCurrentFilters, 
  orderByProximity, 
  setOrderByProximity, 
  messages 
}) {

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

  return (
    <div className="pb-6">
      <fieldset className="mb-4">
        <legend className="uppercase text-lg mb-2 font-medium">Location</legend>
        <div>
          <input className="mr-2" type="checkbox" id={'proximity'} name={'proximity'} checked={orderByProximity} onChange={handleProximityInput} />
          <label htmlFor={`proximity`}>Order by proximity to me</label>
        </div>
      </fieldset>
        <p className="uppercase text-lg mb-2 font-medium">{messages.tags}</p>
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => {
            const isSelected = currentFilters.tags.indexOf(tag.id) >= 0
            return (
              <div key={tag.slug}>
                <TagButton tag={tag} onClick={handleTagInput(tag.id)} isSelected={isSelected} />
              </div>
            )
          })}
        </div>
    </div>
  )
}
