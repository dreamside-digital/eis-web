'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'

export default function PaletteDisplay({ colors, label, onRemove, onColorEdit, compact }) {
  const t = useTranslations('artbox_discover')
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const colorInputRefs = useRef([])

  const handleSwatchClick = (i) => {
    if (onColorEdit && colorInputRefs.current[i]) {
      colorInputRefs.current[i].click()
    }
  }

  const handleColorChange = (i, e) => {
    if (onColorEdit) {
      onColorEdit(i, e.target.value.toUpperCase())
    }
  }

  return (
    <div className={`flex flex-col ${compact ? 'gap-1 flex-1' : 'gap-2'} opacity-0 animate-fade-in-up`}>
      <div className="flex justify-between items-center">
        <span className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>{label}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-dark text-sm transition-colors"
            aria-label={t('remove_palette')}
          >
            &times;
          </button>
        )}
      </div>
      <div className={`flex ${compact ? 'flex-1 min-h-[2rem]' : 'h-12'} rounded overflow-hidden shadow-sm`}>
        {colors.map((color, i) => (
          <div
            key={i}
            className={`flex-1 relative ${onColorEdit ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ backgroundColor: color }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleSwatchClick(i)}
          >
            {onColorEdit && (
              <input
                ref={el => colorInputRefs.current[i] = el}
                type="color"
                value={color}
                onChange={(e) => handleColorChange(i, e)}
                className="sr-only"
                aria-label={t('edit_colour', { number: i + 1 })}
              />
            )}
            {hoveredIndex === i && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono px-1 py-0.5 rounded bg-white/80 text-dark">
                  {onColorEdit ? t('edit') : color}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
