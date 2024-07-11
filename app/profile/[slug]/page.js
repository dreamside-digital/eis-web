import { getProfile } from '@/utils/directus'
import Image from 'next/image'


export default async function ProfilePage({slug}) {
  const profile = await getProfile(slug)

  const tagsText = profile.tags.map(t => t.name).join(", ")

  return (
    <>
    <section className="bg-white text-navy p-6 py-12 pt-24 relative">
      <div className="bg-[url(/images/Asset-12.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-1/2 w-full">
      </div>
      <div className="container mx-auto max-w-xl p-6 bg-beige  text-navy rounded-xl relative">
        <h1 className="font-title text-4xl md:text-6xl mb-6 text-center">
          {profile.public_name}{profile.profile_type === "collective" ? "*" : ""}
        </h1>
        <p className="uppercase text-center tracking-wide mb-6">{profile.pronouns}</p>
        <div className="">
          <Image
            className="relative w-full h-full object-cover rounded-xl mb-6"
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture.id}`}
            alt={profile.profile_picture.description || profile.public_name} 
            width={800}
            height={800}
          />
          <div className="flex-1">
            <p className="text-lg md:text-2xl mb-8 leading-relaxed">{profile.intro_text}</p>
          </div>

          <div className="flex-1">
            {(profile.tags.length > 0) && <p className="uppercase font-medium tracking-wide">{`Tags: ${tagsText}`}</p>}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white text-navy relative">
      <div className="container mx-auto px-6 pb-12 lg:pb-24">
        <div className="lg:grid grid-flow-col auto-cols-fr gap-6">
          <div className="mb-12">
            <p className="font-title text-4xl mb-6">Bio</p>
            <p className="text-xl">{profile.description}</p>
          </div>

          <div className="mb-12">
            <p className="font-title text-4xl mb-6">Current projects</p>
            <p id="currentProject" className="text-xl">{profile.current_project}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-title text-4xl mb-6">Links</p>
            {profile.links.map(link => {
              return <div key={link.url} className="mb-4"><a className="text-2xl underline hover:text-aubergine" href={link.url}>{link.link_text}</a></div>
            })}
          </div>
      </div>
    </section>
    </>
  )
}