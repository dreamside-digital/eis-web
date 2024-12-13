"use client"

import Link from 'next/link'
import Image from 'next/image'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from '@heroicons/react/24/solid'
import { EyeIcon } from '@heroicons/react/24/solid'
import { EyeSlashIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from "@/lib/data-access";
import TagButton from '@/components/TagButton'
import Loader from '@/components/Loader'

const statusColors = {
  'draft': 'border-slate-200',
  'review': 'border-lavendar',
  'private': 'border-beige',
  'published': 'border-medium'
}

const statusColorsBg = {
  'draft': 'bg-slate-200',
  'review': 'bg-lavendar',
  'private': 'bg-beige',
  'published': 'bg-medium'
}

const statusLabels = {
  'draft': 'Draft',
  'review': 'In Review',
  'private': 'Private',
  'published': 'Published'
}


export default function ProfileCard(props) {
  const [profile, setProfile] = useState(props.profile)
  const [loading, setLoading] = useState(false)

  const changeProfileStatus = (id, newStatus) => async () => {
    try {
      setLoading(true)
      const updated = await updateProfile(id, {status: newStatus})
      const newProfile = await getProfile(updated.slug)
      setProfile(newProfile)
      setLoading(false)
    } catch (error) {
      console.log(res)
      // alert user that profile was not updated
    }
  }

  const borderColor = statusColors[profile.status]
  const bbColor = statusColorsBg[profile.status]
  return (
      <div key={profile.id} className={`border-2 ${borderColor} bg-white text-dark relative `}>
        <div className={`${bbColor} text-dark px-6 py-2 uppercase font-medium text-sm`}>
          <span>{statusLabels[profile.status]}</span>
        </div>
        <div className="p-6">
          <Link className="text-xl no-underline hover:text-highlight" href={`/profiles/${profile.slug}`}>
            <h1 className="font-title text-xl md:text-2xl mb-4">
              {profile.public_name}
            </h1>
          </Link>
          <p className="mb-4">{profile.pronouns}</p>
          <div className="">
            {
              profile.profile_picture &&
              <Image
                className="relative w-full h-auto aspect-video object-cover  mb-4"
                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                alt={profile.public_name} 
                width={500}
                height={500}
              />
            }
            <div className="flex-1">
              <p className="mb-4">{profile.short_introduction}</p>
            </div>

            <div className="mb-2 flex gap-1 flex-wrap">
              {profile.tags.map(t => <TagButton key={t.id} tag={t} />)}
            </div>

            {
              loading ? (
                <Loader className="w-6 h-6" />
              ) : (
                <div className="flex flex-col gap-1">
                  <div>
                    <Link className="inline-flex gap-1 text-sm btn grow-0" href={`/profiles/${profile.slug}/edit`} aria-label="Edit profile">
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </Link>
                  </div>
                  {profile.status === "draft" && 
                  <div>
                    <button className="inline-flex gap-1 text-sm btn" onClick={changeProfileStatus(profile.id, "review")} aria-label="Submit for Review">
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Submit for review 
                    </button>
                  </div>}
                  {profile.status === "private" && 
                  <div>
                    <button className="inline-flex gap-1 text-sm btn" onClick={changeProfileStatus(profile.id, "published")} aria-label="Publish Profile">
                      <EyeIcon className="w-4 h-4" />
                      Publish Profile
                    </button>
                  </div>}
                  {profile.status === "published" && 
                  <div>
                    <button className="inline-flex gap-1 text-sm btn" onClick={changeProfileStatus(profile.id, "private")} aria-label="Make Profile Private">
                      <EyeSlashIcon className="w-4 h-4" />
                      Make Profile Private 
                    </button>
                  </div>}
                </div>
              )
            }

          </div>
        </div>
      </div>
  )
}
