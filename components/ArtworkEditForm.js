"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { updateArtwork, uploadImage } from '@/lib/data-access'
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

export default function ArtworkEditForm({user, artwork, tags, profiles, locale}) {
  const [formData, setFormData] = useState({
    ...artwork,
    profile_id: artwork.profile_id?.id?.toString() || artwork.profile_id?.toString() || "",
    themes: artwork.themes?.map(theme => ({ tags_id: theme.id })) || [],
    width: artwork.width?.toString() || "",
    height: artwork.height?.toString() || "",
    depth: artwork.depth?.toString() || "",
    year_created: artwork.year_created?.toString() || "",
  })
  const [fileUploading, setFileUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [existingImages, setExistingImages] = useState(artwork.images || [])
  const router = useRouter()
  const t = useTranslations('artwork_form');

  const updateFormData = field => input => {
    setErrors(null)
    const value = typeof(input) === "string" ? input : input.target?.value
    
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const updateCheckbox = field => input => {
    setErrors(null)
    setFormData({
      ...formData,
      [field]: input.target.checked
    })
  }

  const updateThemes = (tag, e) => {
    e.preventDefault()
    const tagIndex = formData.themes.findIndex(t => t.tags_id === tag.id)
    if (tagIndex === -1) {
      setFormData({
        ...formData,
        themes: formData.themes.concat({ tags_id: tag.id })
      })
    } else {
      const newThemes = [...formData.themes]
      newThemes.splice(tagIndex,1)
      setFormData({
        ...formData,
        themes: newThemes
      })
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (existingImages.length + selectedFiles.length + files.length > 6) {
      setErrors(['Maximum 6 images allowed'])
      return
    }

    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeExistingImage = (index) => {
    const newImages = [...existingImages]
    newImages.splice(index, 1)
    setExistingImages(newImages)
  }

  const removeNewImage = (index) => {
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
    if (!formData.title.trim()) requiredErrors.push('Title is required')
    if (!formData.medium) requiredErrors.push('Medium is required')
    if (!formData.type) requiredErrors.push('Type is required')
    if (!formData.profile_id) requiredErrors.push('Profile selection is required')
    if (existingImages.length === 0 && selectedFiles.length === 0) requiredErrors.push('Please upload at least one image of your artwork')
    if (!formData.themes || formData.themes.length === 0) requiredErrors.push('At least one theme is required')
    if (!formData.inspiration.trim()) requiredErrors.push('Inspiration is required')
    if (!formData.width || !formData.height || !formData.depth) requiredErrors.push('All dimensions (width, height, depth) are required')
    if (!formData.care_instructions.trim()) requiredErrors.push('Care instructions are required')
    if (!formData.year_created) requiredErrors.push('Year of creation is required')

    if (requiredErrors.length > 0) {
      setErrors(requiredErrors)
      setSubmitting(false)
      return
    }

    // Upload new images if any
    let uploadedImageIds = []
    if (selectedFiles.length > 0) {
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

      try {
        uploadedImageIds = await Promise.all(uploadPromises)
        uploadedImageIds = uploadedImageIds.filter(id => id !== null)
        
        if (uploadedImageIds.length !== selectedFiles.length) {
          setErrors(['Some images failed to upload'])
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
    }

    // Combine existing and new images
    const allImageIds = [
      ...existingImages.map(img => img.id),
      ...uploadedImageIds
    ]

    // Prepare update data
    const updateData = {
      status: formData.status,
      title: formData.title,
      medium: formData.medium,
      type: formData.type,
      inspiration: formData.inspiration || null,
      care_instructions: formData.care_instructions || null,
      is_framed: formData.is_framed,
      profile_id: formData.profile_id ? parseInt(formData.profile_id) : null,
      width: formData.width || null,
      height: formData.height || null,
      depth: formData.depth || null,
      year_created: formData.year_created ? parseInt(formData.year_created) : null,
    }

    // Add images if we have any
    if (allImageIds.length > 0) {
      updateData.images = allImageIds.map(id => ({ directus_files_id: id }))
    }
    
    // Add themes
    if (formData.themes && formData.themes.length > 0) {
      updateData.themes = formData.themes.map(theme => ({ tags_id: parseInt(theme.tags_id) }))
    }

    console.log('Updating artwork with data:', JSON.stringify(updateData, null, 2))

    try {
      const result = await updateArtwork(artwork.id, updateData)
      console.log('Update artwork result:', result)
      
      if (result.errors) {
        const errorMessages = result.errors.map(error => 
          typeof error === 'string' ? error : (error.message || 'Unknown error')
        )
        setErrors(errorMessages)
      } else {
        router.push('/artwork')
      }
    } catch (error) {
      console.error('Artwork update error:', error)
      setErrors(['Failed to update artwork'])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full"></div>
      <div className="container max-w-screen-lg mx-auto relative">
        <div className="p-6 bg-beige text-dark">
          <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">Edit Artwork</h1>
          
          {errors && <ErrorAlert errors={errors} setErrors={setErrors} />}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profile Selection (if multiple profiles) */}
            {profiles && profiles.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Profile <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.profile_id || ''} 
                  onChange={updateFormData('profile_id')}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Choose a profile...</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.public_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Images
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image.id}`}
                        alt={`Current image ${index + 1}`}
                        width={120}
                        height={120}
                        className="object-cover rounded"
                        style={{ width: '120px', height: '120px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {existingImages.length > 0 ? 'Add More Images' : 'Photos of the work'} <span className="text-red-500">*</span> <span className="text-gray-500">(Maximum 6 total)</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={fileUploading || (existingImages.length + selectedFiles.length) >= 6}
              />
              {fileUploading && (
                <div className="flex items-center mt-2">
                  <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </div>
              )}
              
              {/* New Image Previews */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`New preview ${index + 1}`}
                        width={120}
                        height={120}
                        className="object-cover rounded"
                        style={{ width: '120px', height: '120px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
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
                Title of Work <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={updateFormData('title')}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Medium */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Medium <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.medium}
                onChange={updateFormData('medium')}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select medium...</option>
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
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={updateFormData('type')}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select type...</option>
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
                Themes Depicted / Artist Tags <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const isSelected = formData.themes.some(t => t.tags_id === tag.id)
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
                What inspired you to make this piece? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.inspiration}
                onChange={updateFormData('inspiration')}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Dimensions <span className="text-red-500">*</span> <span className="text-gray-500">(inches)</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={updateFormData('width')}
                    className="w-full p-2 border border-gray-300 rounded"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={updateFormData('height')}
                    className="w-full p-2 border border-gray-300 rounded"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Depth <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.depth}
                    onChange={updateFormData('depth')}
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
                  checked={formData.is_framed}
                  onChange={updateCheckbox('is_framed')}
                  className="mr-2"
                />
                <label htmlFor="is_framed" className="text-sm">
                  Framed <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* Care Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Care Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.care_instructions}
                onChange={updateFormData('care_instructions')}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Year Created */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Year of Creation <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.year_created}
                onChange={updateFormData('year_created')}
                className="w-full p-2 border border-gray-300 rounded"
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/artwork')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || fileUploading}
                className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </div>
                ) : (
                  'Update Artwork'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}