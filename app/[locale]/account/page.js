import { currentUser, userSession, getUserProfiles, updateProfile } from "@/lib/data-access";
import ProfileCard from '@/components/ProfileCard'
import { redirect } from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link'


export default async function AccountPage({params: {locale}}) {
  const session = await userSession()
  const user = await currentUser(session)
  if (!user) {
    redirect('/login')
  }
  const profiles = await getUserProfiles(session, user)
  const t = await getTranslations('account_page');

  return (
    <>
      <section className="text-dark p-6 py-12 pt-20 relative">
        <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
        </div>
        <div className="container max-w-screen-lg mx-auto relative flex justify-center pt-6">
          <div className="p-6 w-full bg-beige text-dark ">
            <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">{t('page_title')}</h1>
            { user && <p>{`${user.first_name} ${user.last_name}`}</p>}
            { user && <p>{user.email}</p>}
          </div>
          <div className="p-6 w-full bg-beige text-dark flex flex-col items-end gap-2">
            <Link href="/profiles/new" className="btn">{t('create_profile')}</Link>
            <Link href="/events/new" className="btn">{t('create_event')}</Link>
          </div>
        </div>
      </section>
      <section className="text-dark relative p-6">
        <div className="container max-w-screen-lg mx-auto mb-12 lg:mb-20">
          <h2 className="uppercase text-2xl mb-4 md:mb-6 font-medium">{t('artist_profiles')}</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {profiles?.map(profile => {
              return <ProfileCard key={profile.id} profile={profile} />
            })}
          </div>
        </div>
      </section>
    </>
  )
}
