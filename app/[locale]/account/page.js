"use client"

import { userSession, currentUser } from '@/utils/auth'
import { getUserProfiles } from '@/utils/directus'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { profileFormFields } from '@/utils/profileFormFields'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from '@heroicons/react/24/solid'
import { EyeIcon } from '@heroicons/react/24/solid'
import { EyeSlashIcon } from '@heroicons/react/24/solid'

const statusColors = {
  'draft': 'border-slate-100',
  'review': 'border-lavendar',
  'private': 'border-light',
  'published': 'border-medium'
}

const statusColorsBg = {
  'draft': 'bg-slate-100',
  'review': 'bg-lavendar',
  'private': 'bg-light',
  'published': 'bg-medium'
}


export default function AccountPage({params: {locale}}) {
  const [user, setUser] = useState()
  const [profiles, setProfiles] = useState()
  const messages = profileFormFields[locale]

  useEffect(() => {
    (async () => {
      const session = await userSession();

      if (session.accessToken) {
        const authedUser = await currentUser(session.accessToken)
        return setUser(authedUser)
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (user) {
        const profiles = await getUserProfiles(user);
        return setProfiles(profiles)
      }
    })();
  }, [user]);

  const submitDraft = () => {
    return null
  }

  return (
    <>
      <section className="bg-white text-dark p-6 py-12 pt-20 relative">
        <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
        </div>
        <div className="container max-w-screen-lg mx-auto relative flex justify-center pt-6">
          <div className="p-6 w-full bg-lavendar text-dark ">
            <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">Account</h1>
            { user && <p>{`${user.first_name} ${user.last_name}`}</p>}
            { user && <p>{user.email}</p>}
          </div>
        </div>
      </section>
      <section className="bg-white text-dark relative p-6">
        <div className="container max-w-screen-lg mx-auto mb-12 lg:mb-20">
          <h2 className="uppercase text-2xl mb-4 md:mb-6 font-medium">Artist profiles</h2>
          <div className="grid grid-cols-3 gap-6">
            {profiles?.map(profile => {
              const tagsText = profile.tags.map(t => t.name).join(", ")
              const borderColor = statusColors[profile.status]
              const bbColor = statusColorsBg[profile.status]
              return (
                  <div key={profile.id} className={`border-2 ${borderColor} text-dark relative `}>
                    <div className={`${bbColor} text-dark px-6 py-2 uppercase font-medium text-sm`}>
                      <span>{profile.status}</span>
                    </div>
                    <div className="p-6">
                      <Link className="text-xl no-underline hover:text-highlight" href={`/${locale}/profiles/${profile.slug}`}>
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

                        <div className="flex-1 mb-4">
                          {(profile.tags.length > 0) && <p className="uppercase font-medium tracking-wide text-sm">{`${messages.tags}: ${tagsText}`}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <div>
                            <button className="inline-flex gap-1 text-sm btn grow-0" onClick={submitDraft} aria-label="Edit profile">
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                          {profile.status === "draft" && 
                          <div>
                            <button className="inline-flex gap-1 text-sm btn" onClick={submitDraft} aria-label="Submit for Review">
                              <PaperAirplaneIcon className="w-4 h-4" />
                              Submit for review 
                            </button>
                          </div>}
                          {profile.status === "private" && <button onClick={submitDraft} aria-label="Approve and Publish"><EyeIcon className="w-4 h-4" /></button>}
                          {profile.status === "published" && <button onClick={submitDraft} aria-label="Make profile private"><EyeSlashIcon className="w-4 h-4" /></button>}
                        </div>
                      </div>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
