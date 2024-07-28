import { getProfile } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";


export default async function ProfilePage({params}) {
  const { slug } = params
  const profile = await getProfile(slug)

  const cleanIntroduction = DOMPurify.sanitize(profile.introduction, { USE_PROFILES: { html: true } })
  const cleanDescription = DOMPurify.sanitize(profile.artistic_practice, { USE_PROFILES: { html: true } })
  const cleanCurrentProjects = DOMPurify.sanitize(profile.current_projects, { USE_PROFILES: { html: true } })
  const tagsText = profile.tags.map(t => t.name).join(", ")

  return (
    <>
    <section className="bg-white text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
      </div>
      <div className="container max-w-screen-xl mx-auto relative flex justify-center pt-6">
        <div className="p-6 max-w-xl bg-light text-dark rounded-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div>
                {
                  profile.profile_picture &&
                  <Image
                    className="max-w-48 relative w-full h-full object-cover rounded-xl aspect-square"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                    alt={profile.profile_picture.description || profile.public_name} 
                    width={800}
                    height={800}
                  />
                }
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="font-title text-2xl md:text-3xl mb-4">
                {profile.public_name}{profile.profile_type === "collective" ? "*" : ""}
              </h1>
              <p className="uppercase tracking-wide mb-4">{profile.pronouns}</p>
              {(profile.tags.length > 0) && <p className="uppercase text-sm font-medium tracking-wide">{`Tags: ${tagsText}`}</p>}
            </div>
          </div>
          <div className="mt-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanCurrentProjects }} />
        </div>
      </div>
    </section>

    <section className="bg-white text-dark relative">
      <div className="container max-w-screen-xl mx-auto px-6 mb-12 lg:mb-20">
        <div className="lg:grid grid-flow-col auto-cols-fr gap-12">
          <div className="mb-6 lg:mb-0">
            <p className="uppercase text-xl mb-4 font-medium">Introduction</p>
            <div className="" dangerouslySetInnerHTML={{ __html: cleanIntroduction }} />
          </div>

          <div className="mb-6 lg:mb-0">
            <p className="uppercase text-xl mb-4 font-medium">Artistic Practice</p>
            <div className="" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
          </div>
        </div>
        
      </div>
    </section>

    {(profile.additional_images.length > 0) &&
      <section className="bg-light text-dark relative">
        <div className="container max-w-screen-xl mx-auto px-6 py-12 lg:py-20">
          <div className="lg:grid grid-cols-3 gap-6">
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
      <section className="bg-white text-dark relative">
        <div className="container max-w-screen-xl mx-auto px-6 py-12 lg:py-20">
          <div className="flex-1">
            <p className="font-title text-2xl mb-4">Links</p>
            {profile.links?.map(link => {
              return <div key={link.url} className=""><a className="text-lg underline hover:text-aubergine" href={link.url}>{link.link_text}</a></div>
            })}
          </div>
        </div>
      </section>
    }
    </>
  )
}