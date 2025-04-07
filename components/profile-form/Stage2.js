"use client";
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { uploadImage } from '@/lib/data-access';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Stage2({ profile, updateProfileData, setProfile }) {
  const t = useTranslations('profile_form');
  const [fileUploading, setFileUploading] = useState(false)

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    console.log({file})
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("The file is too large, please select a file smaller than 2MB");
        return;
      }

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

  const handleRemoveImage = () => {
    setProfile({
      ...profile,
      profile_picture: null
    });
  };

  return (
    <div className="flex flex-col items-center">
    <div className="relative w-full max-w-xl aspect-square mb-4 bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
      {fileUploading ? (
        <div className="absolute inset-0 bg-grey animate-pulse" />
      ) : profile.profile_picture ? (
        <div className="relative w-full h-full group">
          <Image
            src={profile.profile_picture.id === 'preview' 
              ? profile.profile_picture.preview 
              : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture.id}`
            }
            alt={profile.profile_picture.description || profile.public_name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-center px-4">
            {t('upload_image_placeholder')}
          </p>
          <label className="btn cursor-pointer">
            <input 
              type="file"
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
              className="hidden"
            />
            {profile.profile_picture ? t('change_image') : t('select_image')}
          </label>
        </div>
      )}
    </div>
    {profile.profile_picture && (
    <div className="flex gap-2">
         <button
            onClick={handleRemoveImage}
            className="btn bg-white text-dark"
        >
            {t('remove_image')}
        </button>
        <label className="btn cursor-pointer">
            <input 
                type="file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                className="hidden"
            />
            {t('change_image')}
        </label>
    </div>
    )}
  </div>
  )
}