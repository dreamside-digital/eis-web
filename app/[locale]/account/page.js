"use client"

import { getEvents, getTags, getProfiles } from '@/utils/directus'
import { userSession, currentUser } from '@/utils/data-access'
import { useState, useEffect } from 'react'


export default function AccountPage({params: {locale}}) {
  const [user, setUser] = useState()

  useEffect(() => {
    (async () => {
      const session = await userSession();

      if (session.accessToken) {
        const authedUser = await currentUser(session.accessToken)
        return setUser(authedUser)
      }
    })();
  }, []);

  console.log({user})

  return (
    <section className="bg-white text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
      </div>
      <div className="container max-w-screen-xl mx-auto relative flex justify-center pt-6">
        <div className="p-6 w-full max-w-xl bg-light text-dark rounded-xl">
          <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">Account</h1>
        </div>
      </div>
    </section>
  )
}