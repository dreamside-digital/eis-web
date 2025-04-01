import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { uploadImage } from '@/lib/data-access';
import Image from 'next/image';

export default function Stage2({ profile, updateProfileData, setProfile }) {
  const t = useTranslations('profile_form');
  const [fileUploading, setFileUploading] = useState(false)

  const handleFileChange = async(e) => {
    if (e.target.files[0]) {
      setFileUploading(true)
      const formData = new FormData()
      formData.append('file', e.target.files[0], e.target?.files[0]?.name)
      const result = await uploadImage(formData)
      setProfile({
        ...profile,
        profile_picture: result
      })
      setFileUploading(false)
    } else {
      setProfile({
        ...profile,
        profile_picture: null
      })
    }
  }

  return (
    <div className="flex flex-col items-center">
    <div className="relative w-full max-w-xl aspect-square mb-4 bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
      {fileUploading ? (
        <div className="absolute inset-0 bg-white animate-pulse" />
      ) : profile.profile_picture ? (
        <Image
          src={profile.profile_picture.id === 'preview' 
            ? profile.profile_picture.preview 
            : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture.id}`
          }
          alt={profile.profile_picture.description || profile.public_name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-center px-4">
            {t('upload_image_placeholder')}
          </p>
          <label className="btn cursor-pointer">
            <input 
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {profile.profile_picture ? t('change_image') : t('select_image')}
          </label>
        </div>
      )}
    </div>
  </div>
  )
}