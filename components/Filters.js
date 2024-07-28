"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'

export default function Filters({ tags, currentFilters, setCurrentFilters }) {
  const handleTagInput = id => event => {
    const checked = event.target.checked
    let selected = [...currentFilters.tags]

    if (checked) {
      selected = selected.concat(id)
    } else {
      selected.splice(selected.indexOf(id), 1)
    }

    return setCurrentFilters({
      ...currentFilters,
      tags: selected
    })
  }

  return (
    <div className="">
      <fieldset className="mb-4">
        <legend className="uppercase text-lg mb-2 font-medium">Location</legend>
        <div>
          <input className="mr-2" type="checkbox" id={'proximity'} name={'proximity'} checked={currentFilters.proximity} />
          <label htmlFor={`proximity`}>Order by proximity to me</label>
        </div>
      </fieldset>
      <fieldset>
        <legend className="uppercase text-lg mb-2 font-medium">Tags</legend>
       {/*<div>
          <input className="mr-2" type="checkbox" id={'allTags'} name={'allTags'} checked={currentFilters.tags.all}  onChange={handleTagInput("allTags")}/>
          <label htmlFor={'allTags'}>All</label>
        </div>*/}
        {tags.map(tag => {
          return (
            <div key={tag.slug}>
              <input 
                className="mr-2" 
                type="checkbox" 
                id={tag.slug} 
                name={tag.slug} 
                checked={currentFilters.tags.includes(tag.id)} 
                onChange={handleTagInput(tag.id)} 
              />
              <label htmlFor={tag.slug}>{tag.name}</label>
            </div>
          )
        })}
      </fieldset>
    </div>
  )
}
