"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createArtwork, uploadImage } from '@/lib/data-access'
import {useRouter} from '@/i18n/navigation';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {useTranslations} from 'next-intl';
import ErrorAlert from '@/components/ErrorAlert';

const mediumOptions = [
  { value: 'oil', label: 'Oil' },
  { value: 'acrylic', label: 'Acrylic' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'mixed_media', label: 'Mixed Media' },
  { value: 'digital', label: 'Digital' },
  { value: 'photography', label: 'Photography' },
  { value: 'sculpture_clay', label: 'Sculpture - Clay' },
  { value: 'sculpture_metal', label: 'Sculpture - Metal' },
  { value: 'sculpture_wood', label: 'Sculpture - Wood' },
  { value: 'sculpture_stone', label: 'Sculpture - Stone' },
  { value: 'textiles_weaving', label: 'Textiles - Weaving' },
  { value: 'textiles_embroidery', label: 'Textiles - Embroidery' },
  { value: 'textiles_quilting', label: 'Textiles - Quilting' },
  { value: 'printmaking', label: 'Printmaking' },
  { value: 'drawing', label: 'Drawing' },
  { value: 'collage', label: 'Collage' },
  { value: 'other', label: 'Other' }
]

const typeOptions = [
  { value: 'painting', label: 'Painting' },
  { value: 'sculpture', label: 'Sculpture' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'other', label: 'Other' }
]

export default function ArtworkForm({user, defaultArtwork, tags, profiles, locale}) {
  const [artwork, setArtwork] = useState(defaultArtwork)
  const [fileUploading, setFileUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const router = useRouter()
  const t = useTranslations('artwork_form');

  // Set default profile if user only has one
  useEffect(() => {
    if (profiles && profiles.length === 1 && !artwork.profile_id) {
      setArtwork(prev => ({
        ...prev,
        profile_id: profiles[0].id.toString()
      }))
    }
  }, [profiles, artwork.profile_id])

  const updateArtwork = field => input => {
    setErrors(null)
    const value = typeof(input) === "string" ? input : input.target?.value
    
    setArtwork({
      ...artwork,
      [field]: value
    })
  }

  const updateCheckbox = field => input => {
    setErrors(null)
    setArtwork({
      ...artwork,
      [field]: input.target.checked
    })
  }

  const updateThemes = (tag, e) => {
    e.preventDefault()
    const tagIndex = artwork.themes.findIndex(t => t.tags_id === tag.id)
    if (tagIndex === -1) {
      setArtwork({
        ...artwork,
        themes: artwork.themes.concat({ tags_id: tag.id })
      })
    } else {
      const newThemes = [...artwork.themes]
      newThemes.splice(tagIndex,1)
      setArtwork({
        ...artwork,
        themes: newThemes
      })
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (selectedFiles.length + files.length > 6) {
      setErrors(['Maximum 6 images allowed'])
      return
    }

    // Just add files to selectedFiles for preview, don't upload yet
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors(null)

    // Validate required fields
    const requiredErrors = []
    if (!artwork.title.trim()) requiredErrors.push('Title is required')
    if (!artwork.medium) requiredErrors.push('Medium is required')
    if (!artwork.type) requiredErrors.push('Type is required')
    if (!artwork.profile_id) requiredErrors.push('Profile selection is required')
    if (!selectedFiles || selectedFiles.length === 0) requiredErrors.push('Please upload at least one image of your artwork')
    if (!artwork.themes || artwork.themes.length === 0) requiredErrors.push('At least one theme is required')
    if (!artwork.inspiration.trim()) requiredErrors.push('Inspiration is required')
    if (!artwork.width || !artwork.height || !artwork.depth) requiredErrors.push('All dimensions (width, height, depth) are required')
    if (!artwork.care_instructions.trim()) requiredErrors.push('Care instructions are required')
    if (!artwork.year_created) requiredErrors.push('Year of creation is required')

    if (requiredErrors.length > 0) {
      setErrors(requiredErrors)
      setSubmitting(false)
      return
    }

    // Upload images first
    setFileUploading(true)
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const result = await uploadImage(formData)
        return result.id
      } catch (error) {
        console.error('Upload failed:', error)
        return null
      }
    })

    let uploadedImageIds = []
    try {
      uploadedImageIds = await Promise.all(uploadPromises)
      uploadedImageIds = uploadedImageIds.filter(id => id !== null)
      
      if (uploadedImageIds.length === 0) {
        setErrors(['Failed to upload images'])
        setSubmitting(false)
        setFileUploading(false)
        return
      }
    } catch (error) {
      setErrors(['Failed to upload images'])
      setSubmitting(false)
      setFileUploading(false)
      return
    }
    setFileUploading(false)

    // Convert string values to proper types for database
    const data = {
      status: artwork.status,
      title: artwork.title,
      medium: artwork.medium,
      type: artwork.type,
      inspiration: artwork.inspiration || null,
      care_instructions: artwork.care_instructions || null,
      is_framed: artwork.is_framed,
      profile_id: artwork.profile_id ? parseInt(artwork.profile_id) : null,
      width: artwork.width || null,
      height: artwork.height || null,
      depth: artwork.depth || null,
      year_created: artwork.year_created ? parseInt(artwork.year_created) : null,
    }

    // Add uploaded images - format for M2M relationship
    if (uploadedImageIds.length > 0) {
      data.images = uploadedImageIds.map(id => ({ directus_files_id: id }))
    }
    
    if (artwork.themes && artwork.themes.length > 0) {
      data.themes = artwork.themes.map(theme => ({ tags_id: parseInt(theme.tags_id) }))
    }

    console.log('Submitting artwork data:', JSON.stringify(data, null, 2))

    try {
      const result = await createArtwork(data)
      console.log('Create artwork result:', result)
      
      if (result.errors) {
        // Handle both string errors and object errors
        const errorMessages = result.errors.map(error => 
          typeof error === 'string' ? error : (error.message || 'Unknown error')
        )
        setErrors(errorMessages)
      } else {
        router.push('/account')
      }
    } catch (error) {
      console.error('Artwork creation error:', error)
      setErrors(['Failed to create artwork entry'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full"></div>
      <div className="container max-w-screen-lg mx-auto relative">
        <div className="p-6 bg-beige text-dark">
          <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">{t('page_title')}</h1>
          
          {errors && <ErrorAlert errors={errors} setErrors={setErrors} />}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profile Selection (if multiple profiles) */}
            {profiles && profiles.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('select_profile')}
                </label>
                <select 
                  value={artwork.profile_id || ''} 
                  onChange={updateArtwork('profile_id')}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">{t('select_profile_placeholder')}</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.public_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Photos Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('photos_label')} <span className="text-red-500">*</span> <span className="text-gray-500">({t('max_6_photos')})</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={fileUploading || selectedFiles.length >= 6}
              />
              {fileUploading && (
                <div className="flex items-center mt-2">
                  <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                  {t('uploading')}
                </div>
              )}
              
              {/* Image Previews */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={120}
                        height={120}
                        className="object-cover rounded"
                        style={{ width: '120px', height: '120px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('title_label')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={artwork.title}
                onChange={updateArtwork('title')}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Medium */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('medium_label')} <span className="text-red-500">*</span>
              </label>
              <select
                value={artwork.medium}
                onChange={updateArtwork('medium')}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">{t('select_medium_placeholder')}</option>
                {mediumOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('type_label')} <span className="text-red-500">*</span>
              </label>
              <select
                value={artwork.type}
                onChange={updateArtwork('type')}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">{t('select_type_placeholder')}</option>
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Themes/Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('themes_label')} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const isSelected = artwork.themes.some(t => t.tags_id === tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={(e) => updateThemes(tag, e)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        isSelected 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Inspiration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('inspiration_label')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={artwork.inspiration}
                onChange={updateArtwork('inspiration')}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('dimensions_label')} <span className="text-red-500">*</span> <span className="text-gray-500">({t('inches')})</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('width')}</label>
                  <input
                    type="number"
                    value={artwork.width}
                    onChange={updateArtwork('width')}
                    className="w-full p-2 border border-gray-300 rounded"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('height')}</label>
                  <input
                    type="number"
                    value={artwork.height}
                    onChange={updateArtwork('height')}
                    className="w-full p-2 border border-gray-300 rounded"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t('depth')}</label>
                  <input
                    type="number"
                    value={artwork.depth}
                    onChange={updateArtwork('depth')}
                    className="w-full p-2 border border-gray-300 rounded"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="is_framed"
                  checked={artwork.is_framed}
                  onChange={updateCheckbox('is_framed')}
                  className="mr-2"
                />
                <label htmlFor="is_framed" className="text-sm">
                  {t('framed_checkbox')} <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* Care Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('care_instructions_label')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={artwork.care_instructions}
                onChange={updateArtwork('care_instructions')}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Year Created */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('year_created_label')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={artwork.year_created}
                onChange={updateArtwork('year_created')}
                className="w-full p-2 border border-gray-300 rounded"
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || fileUploading}
                className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                    {t('uploading')}
                  </div>
                ) : (
                  t('submit_artwork')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}