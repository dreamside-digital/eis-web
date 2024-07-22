import { getProfile } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";


export default async function ProfilePage({params}) {
  const { slug } = params
  const profile = await getProfile(slug)
  console.log(profile)

  const cleanIntroduction = DOMPurify.sanitize(profile.introduction, { USE_PROFILES: { html: true } })
  const cleanDescription = DOMPurify.sanitize(profile.artistic_practice, { USE_PROFILES: { html: true } })
  const cleanCurrentProjects = DOMPurify.sanitize(profile.current_projects, { USE_PROFILES: { html: true } })
  const tagsText = profile.tags.map(t => t.name).join(", ")

  return (
    <>
    <section className="bg-white text-navy p-6 py-12 pt-24 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-1/2 w-full">
      </div>
      <div className="container mx-auto max-w-xl p-6 bg-beige  text-navy rounded-xl relative">
        <h1 className="font-title text-4xl md:text-6xl mb-6 text-center">
          {profile.public_name}{profile.profile_type === "collective" ? "*" : ""}
        </h1>
        <p className="uppercase text-center tracking-wide mb-6">{profile.pronouns}</p>
        <div className="">
          {
            profile.profile_picture &&
            <Image
              className="relative w-full h-full object-cover rounded-xl mb-6"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
              alt={profile.profile_picture.description || profile.public_name} 
              width={800}
              height={800}
            />
          }
          <div className="flex-1">
          <div className="text-lg md:text-2xl mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanCurrentProjects }} />
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
            <p className="font-title text-4xl mb-6">Introduction</p>
            <div className="text-xl" dangerouslySetInnerHTML={{ __html: cleanIntroduction }} />
          </div>

          <div className="mb-12">
            <p className="font-title text-4xl mb-6">Artistic Practice</p>
            <div className="text-xl" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
          </div>
        </div>
        
      </div>
    </section>

    {profile.additional_images &&
      <section className="bg-beige text-navy relative">
        <div className="container mx-auto px-6 py-12 lg:py-24">
          <div className="lg:grid grid-cols-2 gap-6">
          {
            profile.additional_images?.map(img => {
              return (
                <Image
                  key={img.directus_files_id}
                  className="relative w-full h-full object-cover rounded-xl mb-6"
                  src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${img.directus_files_id}`}
                  alt={""} 
                  width={800}
                  height={800}
                />
              )
            })
          }
          </div>
        </div>
      </section>
    }

    {profile.links &&
      <section className="bg-white text-navy relative">
        <div className="container mx-auto px-6 py-12 lg:py-24">
          <div className="flex-1">
            <p className="font-title text-4xl mb-6">Links</p>
            {profile.links?.map(link => {
              return <div key={link.url} className="mb-4"><a className="text-2xl underline hover:text-aubergine" href={link.url}>{link.link_text}</a></div>
            })}
          </div>
        </div>
      </section>
    }
    </>
  )
}