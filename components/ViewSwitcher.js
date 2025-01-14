"use client"

import { Squares2X2Icon, RectangleStackIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'
import {useTranslations} from 'next-intl';

export default function ViewSwitcher({
  options=[], 
  view,
  setView
}) {
  const t = useTranslations('shared_messages')

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

  const handleSelect = e => {
    setView(e.target.value)
  }

  return (
    <div className="">
      <fieldset>
        <legend className="uppercase text-lg mb-2 font-medium">{t('select_view')}</legend>
        {
          options.map(option => {
            return (
              <div key={option.value} className="flex items-center gap-1 nowrap">
                <input onChange={handleSelect} type="radio" id={option.value} name="view" value={option.value} checked={option.value === view} />
                <label htmlFor={option.value}>{option.label}</label><br />
              </div>
            )
          })
        }
      </fieldset>
    </div>
  )
}
