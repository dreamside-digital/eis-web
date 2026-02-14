'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import PaletteDisplay from './PaletteDisplay'

export default function ImageUploader({ onPalettesChange }) {
  const t = useTranslations('artbox_discover')
  const [uploads, setUploads] = useState([]) // { id, preview, colors, loading }
  const fileInputRef = useRef(null)
  const idCounter = useRef(0)

  // Report current palettes upward whenever uploads change
  useEffect(() => {
    const palettes = uploads
      .filter(u => u.colors)
      .map(u => u.colors)
    onPalettesChange(palettes)
  }, [uploads, onPalettesChange])

  const extractPalette = async (file) => {
    const objectUrl = URL.createObjectURL(file)
    const id = ++idCounter.current

    setUploads(prev => [...prev, { id, preview: objectUrl, colors: null, loading: true }])

    const ColorThief = (await import('colorthief')).default

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = objectUrl

    img.onload = () => {
      try {
        const ct = new ColorThief()
        const palette = ct.getPalette(img, 5) || []
        const hexColors = palette.map(
          ([r, g, b]) =>
            '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
        )
        // ColorThief may return fewer than 5 for constrained palettes
        if (hexColors.length === 0) throw new Error('No colours extracted')
        setUploads(prev =>
          prev.map(u => u.id === id ? { ...u, colors: hexColors, loading: false } : u)
        )
      } catch (err) {
        console.error('Colour extraction failed:', err)
        setUploads(prev =>
          prev.map(u => u.id === id ? { ...u, loading: false } : u)
        )
      }
    }

    img.onerror = () => {
      console.error('Failed to load image')
      setUploads(prev => prev.filter(u => u.id !== id))
    }
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remaining = 3 - uploads.length
    const toProcess = files.slice(0, remaining)

    for (const file of toProcess) {
      await extractPalette(file)
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const handleColorEdit = (uploadId, colorIndex, newColor) => {
    setUploads(prev =>
      prev.map(u => {
        if (u.id !== uploadId) return u
        const updated = [...u.colors]
        updated[colorIndex] = newColor
        return { ...u, colors: updated }
      })
    )
  }

  return (
    <div className="space-y-3">
      {uploads.length < 3 && (
        <label className="block">
          <span className="sr-only">{t('upload_images_title')}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-dark file:text-white
              hover:file:bg-highlight
              file:cursor-pointer"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            {t('images_count', { count: uploads.length })}
          </span>
        </label>
      )}

      {uploads.map((upload) => (
        <div
          key={upload.id}
          className="flex flex-row gap-4 items-stretch p-3 bg-white rounded-lg shadow-sm opacity-0 animate-fade-in-up"
        >
          <div className="relative flex-shrink-0">
            <img
              src={upload.preview}
              alt={t('uploaded_preview')}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded shadow"
            />
            <button
              type="button"
              onClick={() => handleRemoveUpload(upload.id)}
              className="absolute -top-2 -right-2 bg-gray-500 hover:bg-dark text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
              aria-label={t('remove_image')}
            >
              &times;
            </button>
          </div>
          <div className="flex-1 flex flex-col w-full">
            {upload.loading && (
              <p className="text-sm text-gray-500 animate-pulse">{t('extracting_colours')}</p>
            )}
            {upload.colors && (
              <PaletteDisplay
                colors={upload.colors}
                label={t('click_to_adjust')}
                compact
                onColorEdit={(colorIndex, newColor) =>
                  handleColorEdit(upload.id, colorIndex, newColor)
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
