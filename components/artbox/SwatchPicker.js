'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CURATED_SWATCHES } from '@/lib/color-utils'

export default function SwatchPicker({ onPaletteCreated }) {
  const t = useTranslations('artbox_discover')
  const [selected, setSelected] = useState(new Set())

  const toggleSwatch = (hex) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(hex)) {
        next.delete(hex)
      } else if (next.size < 5) {
        next.add(hex)
      }
      return next
    })
  }

  const handleCreate = () => {
    onPaletteCreated([...selected])
    setSelected(new Set())
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4">
        {CURATED_SWATCHES.map(({ name, hex }, index) => {
          const isSelected = selected.has(hex)
          return (
            <button
              key={hex}
              onClick={() => toggleSwatch(hex)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 hover:scale-110 transition-transform duration-200 opacity-0 animate-fade-in-up ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-dark border-dark scale-110'
                  : 'border-transparent hover:border-gray-300'
              }`}
              style={{
                backgroundColor: hex,
                animationDelay: `${index * 0.03}s`,
              }}
              title={name}
              aria-label={`${name} (${hex})`}
              aria-pressed={isSelected}
            />
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{t('swatch_count', { count: selected.size })}</span>
        {selected.size >= 2 && (
          <button
            onClick={handleCreate}
            className="bg-dark text-white px-4 py-2 rounded hover:bg-highlight text-sm font-medium transition-colors"
          >
            {t('create_palette')}
          </button>
        )}
      </div>
    </div>
  )
}
