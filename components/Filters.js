"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'

export default function Filters({ tags, currentFilters, setCurrentFilters, messages }) {

  const handleTagInput = id => event => {
    let selected = [...currentFilters.tags]
    const clickedIndex = selected.indexOf(id)

    if (id === 'all') {
      if (clickedIndex === -1) {
        selected = tags.map(t => t.id).concat('all')
      } else {
        selected = []
      }
    }

    if (clickedIndex === -1) {
      selected = selected.concat(id)
      if (selected.length == tags.length && selected.indexOf('all') === -1) {
        selected = selected.concat('all')
      }
    } else {
      const allIndex = selected.indexOf('all')
      if (allIndex >=0 ) {
        selected.splice(allIndex, 1)
      }
      selected.splice(clickedIndex, 1)
    }

    return setCurrentFilters({
      ...currentFilters,
      tags: selected
    })
  }

  return (
    <div className="pb-6">
      {/*<fieldset className="mb-4">
        <legend className="uppercase text-lg mb-2 font-medium">Location</legend>
        <div>
          <input className="mr-2" type="checkbox" id={'proximity'} name={'proximity'} checked={currentFilters.proximity} />
          <label htmlFor={`proximity`}>Order by proximity to me</label>
        </div>
      </fieldset>*/}
        <p className="uppercase text-lg mb-2 font-medium">{messages.tags}</p>
        <div className="flex flex-wrap gap-1">
          <TagButton 
            tag={{name: messages.all, id: "all"}} 
            onClick={handleTagInput("all")} 
            isSelected={currentFilters.tags.indexOf("all") >= 0}
          />
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
