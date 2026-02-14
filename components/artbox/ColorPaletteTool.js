'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import ImageUploader from './ImageUploader'
import SwatchPicker from './SwatchPicker'
import PaletteDisplay from './PaletteDisplay'
import MatchingLoader from './MatchingLoader'
import MatchResults from './MatchResults'

function StepWrapper({ visible, children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) {
      // Small delay to trigger CSS transition after mount
      const id = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(id)
    }
    setMounted(false)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        mounted
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
      }`}
    >
      {children}
    </div>
  )
}

export default function ColorPaletteTool() {
  const t = useTranslations('artbox_discover')
  const [step, setStep] = useState(1)
  const [visibleStep, setVisibleStep] = useState(1)
  const [mode, setMode] = useState(null) // 'image' or 'swatch'
  const [swatchPalettes, setSwatchPalettes] = useState([])
  const [imagePalettes, setImagePalettes] = useState([])
  const [matchResults, setMatchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const activePalettes = mode === 'image' ? imagePalettes : swatchPalettes

  const transitionTo = useCallback((nextStep) => {
    setVisibleStep(null) // fade out current
    setTimeout(() => {
      setStep(nextStep)
      setVisibleStep(nextStep) // fade in next
    }, 300)
  }, [])

  const handleSwatchPaletteCreated = (colors) => {
    if (swatchPalettes.length >= 3) return
    setSwatchPalettes(prev => [...prev, colors])
    setMatchResults(null)
    setError(null)
  }

  const removeSwatchPalette = (index) => {
    setSwatchPalettes(prev => prev.filter((_, i) => i !== index))
    setMatchResults(null)
  }

  const editSwatchPaletteColor = (paletteIndex, colorIndex, newColor) => {
    setSwatchPalettes(prev =>
      prev.map((colors, i) => {
        if (i !== paletteIndex) return colors
        const updated = [...colors]
        updated[colorIndex] = newColor
        return updated
      })
    )
  }

  const handleFindArtwork = async () => {
    const palettesToMatch = activePalettes
    transitionTo(3)
    setLoading(true)
    setError(null)
    setMatchResults(null)

    const startTime = Date.now()

    try {
      const res = await fetch('/api/artbox/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ palettes: palettesToMatch }),
      })

      if (!res.ok) {
        throw new Error('Failed to find matches')
      }

      const data = await res.json()

      // Enforce 2-second minimum loading time
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 2000 - elapsed)

      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }

      setMatchResults(data.matches)
      setLoading(false)
      transitionTo(4)
    } catch (err) {
      console.error('Match error:', err)
      setError(t('error_message'))
      setLoading(false)
      transitionTo(2)
    }
  }

  const handleStartOver = () => {
    setSwatchPalettes([])
    setImagePalettes([])
    setMatchResults(null)
    setError(null)
    setMode(null)
    transitionTo(1)
  }

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode)
    transitionTo(2)
  }

  const handleBack = () => {
    transitionTo(1)
  }

  return (
    <div className="flex flex-col">
      {/* Step 1 — Welcome */}
      <StepWrapper visible={step === 1 && visibleStep === 1}>
        <div className="text-center py-6 md:py-10">
          <h1 className="font-title text-4xl md:text-5xl lg:text-6xl mb-4">
            {t('welcome_title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            {t('welcome_subtitle')}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => handleSelectMode('image')}
              className="group p-8 md:p-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-left opacity-0 animate-fade-in-up"
            >
              <div className="text-3xl mb-3">&#x1f5bc;</div>
              <h3 className="font-title text-xl md:text-2xl mb-2">{t('upload_image')}</h3>
              <p className="text-gray-500 text-sm">
                {t('upload_image_desc')}
              </p>
            </button>

            <button
              onClick={() => handleSelectMode('swatch')}
              className="group p-8 md:p-10 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-left opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="text-3xl mb-3">&#x1f3a8;</div>
              <h3 className="font-title text-xl md:text-2xl mb-2">{t('pick_colours')}</h3>
              <p className="text-gray-500 text-sm">
                {t('pick_colours_desc')}
              </p>
            </button>
          </div>
        </div>
      </StepWrapper>

      {/* Step 2 — Create palette */}
      <StepWrapper visible={step === 2 && visibleStep === 2}>
        <div className="py-4">
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-dark text-sm mb-4 inline-flex items-center gap-1 transition-colors"
          >
            &larr; {t('back')}
          </button>

          <h2 className="font-title text-3xl md:text-4xl mb-2">
            {mode === 'image' ? t('upload_images_title') : t('pick_colours')}
          </h2>
          <p className="text-gray-600 mb-6">
            {mode === 'image'
              ? t('upload_images_subtitle')
              : t('pick_colours_subtitle')}
          </p>

          {/* Input area */}
          <div className="mb-6">
            {mode === 'image' ? (
              <ImageUploader onPalettesChange={setImagePalettes} />
            ) : (
              <SwatchPicker onPaletteCreated={handleSwatchPaletteCreated} />
            )}
          </div>

          {/* Created swatch palettes (only in swatch mode) */}
          {mode === 'swatch' && swatchPalettes.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">
                {t('your_palettes', { count: swatchPalettes.length })}
              </h3>
              {swatchPalettes.map((colors, i) => (
                <PaletteDisplay
                  key={i}
                  colors={colors}
                  label={t('palette_label', { number: i + 1 })}
                  onRemove={() => removeSwatchPalette(i)}
                  onColorEdit={(colorIndex, newColor) =>
                    editSwatchPaletteColor(i, colorIndex, newColor)
                  }
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center py-4 mb-4">{error}</p>
          )}

          {/* Find artwork button */}
          {activePalettes.length > 0 && (
            <button
              onClick={handleFindArtwork}
              className="bg-dark text-white px-8 py-3 rounded hover:bg-highlight font-medium text-lg transition-colors"
            >
              {t('find_artwork')}
            </button>
          )}
        </div>
      </StepWrapper>

      {/* Step 3 — Loading */}
      <StepWrapper visible={step === 3 && visibleStep === 3}>
        <MatchingLoader />
      </StepWrapper>

      {/* Step 4 — Results */}
      <StepWrapper visible={step === 4 && visibleStep === 4}>
        <div className="py-4">
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-6">
            <MatchResults matches={matchResults} />
          </div>
          <div className="text-center mt-10">
            <button
              onClick={handleStartOver}
              className="bg-dark text-white px-8 py-3 rounded hover:bg-highlight font-medium text-lg transition-colors"
            >
              {t('start_over')}
            </button>
          </div>
        </div>
      </StepWrapper>
    </div>
  )
}
