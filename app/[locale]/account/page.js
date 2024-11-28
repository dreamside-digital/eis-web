
import { profileFormFields } from '@/utils/profileFormFields'
import { getAuthUser, userSession, getUserProfiles, updateProfile } from "@/lib/data-access";
import ProfileCard from '@/components/ProfileCard'


export default async function AccountPage({params: {locale}}) {
  const messages = profileFormFields[locale]
  const session = await userSession()
  const user = await getAuthUser(session)
  const profiles = await getUserProfiles(session, user)

  return (
    <>
      <section className="text-dark p-6 py-12 pt-20 relative">
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
      <section className="text-dark relative p-6">
        <div className="container max-w-screen-lg mx-auto mb-12 lg:mb-20">
          <h2 className="uppercase text-2xl mb-4 md:mb-6 font-medium">Artist profiles</h2>
          <div className="grid grid-cols-3 gap-6">
            {profiles?.map(profile => {
              return <ProfileCard key={profile.id} profile={profile} />
            })}
          </div>
        </div>
      </section>
    </>
  )
}
