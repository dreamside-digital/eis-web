"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'

export default function TagFilter({ 
  tags, 
  currentFilters, 
  setCurrentFilters, 
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
    <div className="">

        <p className="uppercase text-lg mb-2 font-medium">Filter by discipline</p>
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