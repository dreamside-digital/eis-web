"use client"

import {Link} from '@/i18n/navigation';
import Image from 'next/image'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from '@heroicons/react/24/solid'
import { EyeIcon } from '@heroicons/react/24/solid'
import { EyeSlashIcon } from '@heroicons/react/24/solid'
import { GlobeAltIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from "@/lib/data-access";
import TagButton from '@/components/TagButton'
import Loader from '@/components/Loader'
import {useTranslations} from 'next-intl';

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


export default function ProfileCard(props) {
  const [profile, setProfile] = useState(props.profile)
  const [loading, setLoading] = useState(false)
  const t = useTranslations('account_page');

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
  console.log(profile)

  return (
      <div key={profile.id} className={`border-2 ${borderColor} bg-white text-dark relative flex flex-col`}>
        <div className={`${bbColor} text-dark px-6 py-2 uppercase font-medium text-sm`}>
          <span>{t(profile.status)}</span>
        </div>
        {
          profile.profile_picture &&
          <Image
            className="relative w-full h-auto aspect-video object-cover"
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
            alt={profile.public_name} 
            width={500}
            height={500}
          />
        }
        <div className="p-6 flex flex-col flex-auto justify-between">
          <div>
            <Link className="no-underline hover:text-highlight" href={`/profiles/${profile.slug}`}>
              <h1 className="font-title text-xl mb-4">
                {profile.public_name}{profile.pronouns ? ` (${profile.pronouns})` : ""}
              </h1>
            </Link>
            <div className="mb-4 flex gap-1 flex-wrap">
              {profile.tags.map(t => <TagButton key={t.id} tag={t} />)}
            </div>
            <div className="">
              <div className="flex-1">
                <p className="mb-2">{profile.short_introduction}</p>
              </div>

            </div>
          </div>

          <div>

            {
              loading ? (
                <Loader className="w-6 h-6" />
              ) : (
                <div className="flex flex-wrap gap-1 border pt-4 border-l-0 border-r-0 border-b-0">
                  <div>
                    <Link className="inline-flex gap-1 text-sm btn grow-0" href={`/profiles/${profile.slug}`} aria-label="Preview profile">
                      <EyeIcon className="w-4 h-4" />
                      {t("preview")}
                    </Link>
                  </div>
                  <div>
                    <Link className="inline-flex gap-1 text-sm btn grow-0" href={`/profiles/${profile.slug}/edit`} aria-label="Edit profile">
                      <PencilIcon className="w-4 h-4" />
                      {t("edit")}
                    </Link>
                  </div>
                  {profile.status === "draft" && 
                  <div>
                    <button className="inline-flex gap-1 text-sm btn" onClick={changeProfileStatus(profile.id, "review")} aria-label="Submit for Review">
                      <PaperAirplaneIcon className="w-4 h-4" />
                      {t("submit_for_review")}
                    </button>
                  </div>}
                  {profile.status === "private" && 
                  <div>
                    <button className="inline-flex gap-1 text-sm btn" onClick={changeProfileStatus(profile.id, "published")} aria-label="Publish Profile">
                      <GlobeAltIcon className="w-4 h-4" />
                      {t("publish_profile")}
                    </button>
                  </div>}
                  {profile.status === "published" && 
                  <div>
                    <button className="inline-flex gap-1 text-sm btn" onClick={changeProfileStatus(profile.id, "private")} aria-label="Make Profile Private">
                      <EyeSlashIcon className="w-4 h-4" />
                      {t("make_profile_private")}
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
