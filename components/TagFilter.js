"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import TagButton from '@/components/TagButton'
import {useTranslations} from 'next-intl';

export default function TagFilter({ 
  tags, 
  selectedTags, 
  setSelectedTags, 
  messages 
}) {
  const t = useTranslations('shared_messages')

  const handleTagInput = id => event => {
    let selected = [...selectedTags]
    const clickedIndex = selected.indexOf(id)

    if (clickedIndex === -1) {
      selected = selected.concat(id)
    } else {
      selected.splice(clickedIndex, 1)
    }

    return setSelectedTags(selected)
  }


  return (
    <div className="">

        <p className="uppercase text-lg mb-2 font-medium">{t('filter_by_discipline')}</p>
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => {
            const isSelected = selectedTags.indexOf(tag.id) >= 0
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
