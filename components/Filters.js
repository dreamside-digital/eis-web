"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'

export default function Filters({ tags, currentFilters, setCurrentFilters }) {
  const handleTagInput = id => event => {
    const checked = event.target.checked
    let selected = [...currentFilters.tags]

    if (id === 'all') {
      if (event.target.checked) {
        selected = tags.map(t => t.id).concat('all')
      } else {
        selected = []
      }
    }

    if (checked) {
      selected = selected.concat(id)
      if (selected.length == tags.length && selected.indexOf('all') === -1) {
        selected = selected.concat('all')
      }
    } else {
      const allIndex = selected.indexOf('all')
      if (allIndex >=0 ) {
        selected.splice(allIndex, 1)
      }
      selected.splice(selected.indexOf(id), 1)
    }

    return setCurrentFilters({
      ...currentFilters,
      tags: selected
    })
  }

  return (
    <div className="">
      {/*<fieldset className="mb-4">
        <legend className="uppercase text-lg mb-2 font-medium">Location</legend>
        <div>
          <input className="mr-2" type="checkbox" id={'proximity'} name={'proximity'} checked={currentFilters.proximity} />
          <label htmlFor={`proximity`}>Order by proximity to me</label>
        </div>
      </fieldset>*/}
      <fieldset>
        <legend className="uppercase text-lg mb-2 font-medium">Tags</legend>
       <div>
          <input className="mr-2" type="checkbox" id={'all'} name={'all'} checked={currentFilters.tags.includes('all')}  onChange={handleTagInput("all")}/>
          <label htmlFor={'all'}>All</label>
        </div>
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
