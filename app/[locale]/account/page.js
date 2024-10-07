"use client"

import { userSession, currentUser } from '@/utils/data-access'
import { getUserProfiles } from '@/utils/directus'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { profileFormFields } from '@/utils/profileFormFields'


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

  return (
    <>
      <section className="bg-white text-dark p-6 py-12 pt-20 relative">
        <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
        </div>
        <div className="container max-w-screen-lg mx-auto relative flex justify-center pt-6">
          <div className="p-6 w-full bg-light text-dark rounded-xl">
            <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">Account</h1>
            <p>{`${user?.first_name} ${user?.last_name}`}</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </section>
      <section className="bg-white text-dark relative">
        <div className="container max-w-screen-lg mx-auto px-6 mb-12 lg:mb-20">
          <h2 className="uppercase text-2xl mb-4 md:mb-6 font-medium">Artist profiles</h2>
          <div className="grid grid-cols-3 gap-6">
            {profiles?.map(profile => {
              const tagsText = profile.tags.map(t => t.name).join(", ")
              return (
                  <div key={profile.id} className="p-6 bg-light text-dark relative">
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
                          className="relative w-full h-auto aspect-video object-cover rounded-xl mb-4"
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

                      <Link href={`/${locale}/profiles/${profile.slug}`} className="font-medium underline">
                        {messages.full_profile}
                      </Link>
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
