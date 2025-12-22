import { getProfile } from '@/lib/data-access'
import Image from 'next/image'
import { sanitize } from '@/lib/sanitize'
import ImageWithCaption from '@/components/ImageWithCaption'
import { redirect } from 'next/navigation'

export default async function ProfilePage({params}) {
  const { locale,slug } = await params
  const profile = await getProfile(slug)
  console.log(profile)

  if (!profile) {
    redirect('/profiles')
  }
  
  const cleanIntroduction = sanitize(profile.introduction)
  const cleanDescription = sanitize(profile.artistic_practice)
  const cleanCurrentProjects = sanitize(profile.current_projects)
  const cleanInspirations = sanitize(profile.inspirations)
  const links = profile?.links?.filter(l => l.url && l.link_text)

  return (
    <>
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
      </div>
      <div className="container max-w-screen-lg mx-auto relative flex justify-center pt-6">
        <div className="p-6 w-full bg-beige text-dark ">
          <div className="flex flex-col md:flex-row">
            <div>
                {
                  profile.profile_picture &&
                  <Image
                    className="md:max-w-48 relative w-full h-full object-cover  aspect-square mb-6 md:mr-6"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture.id}`}
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
              <p className="leading-relaxed">{profile.short_introduction}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="text-dark relative">
      <div className="container max-w-screen-lg mx-auto px-6 mb-12 lg:mb-20">
        <div className="flex flex-col md:flex-row max-md:divide-y md:divide-x divide-beige">
          <div className="basis-3/4 md:pr-8">
            {profile.tarot_submissions?.responses.map(response => {
                return (
                  <div key={response.id} className="mb-6">
                    <p className="uppercase text-lg mb-4 font-medium">{response.prompt.translations.find(t => t.languages_code === locale).prompt}</p>
                    <p className="text-lg">{response.response}</p>
                  </div>
                )
              })}
              
            { cleanCurrentProjects && 
              <div className="mb-6">
                <p className="uppercase text-lg mb-4 font-medium">Current projects</p>
                <div className="" dangerouslySetInnerHTML={{ __html: cleanCurrentProjects }} />
              </div>
            }

            { cleanDescription && 
              <div className="mb-6">
                <p className="uppercase text-lg mb-4 font-medium">Artistic Practice</p>
                <div className="" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
              </div>
            }

            { cleanIntroduction && 
              <div className="mb-6">
                <p className="uppercase text-lg mb-4 font-medium">Past Projects</p>
                <div className="" dangerouslySetInnerHTML={{ __html: cleanIntroduction }} />
              </div>
            }

            { cleanInspirations &&
              <div className="mb-6">
                <p className="uppercase text-lg mb-4 font-medium">Inspirations</p>
                <div className="" dangerouslySetInnerHTML={{ __html: cleanInspirations }} />
              </div>
            }
          </div>

          <div className="basis-1/4 pt-6 md:pt-0 md:pl-8">
            {(profile.tags?.length > 0) &&
            <div className="mb-6">
              <p className="uppercase text-lg mb-4 font-medium">Tags</p>
              {profile.tags?.map(tag => {
                return <div key={tag.name} className="">{tag.name}</div>
              })}
            </div>
            }

            {(links?.length > 0) &&
              <div className="">
                <p className="uppercase text-lg mb-4 font-medium">Links</p>
                {links.map(link => {
                  const url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                  return <div key={link.url} className=""><a className="underline hover:text-aubergine" href={url}>{link.link_text}</a></div>
                })}
              </div>
            }

          </div>
        </div>
        
      </div>
    </section>

    {(profile.additional_images?.length > 0) &&
      <section className="bg-beige text-dark relative">
        <div className="container max-w-screen-lg mx-auto px-6 py-12 lg:py-20">
          <div className="lg:grid grid-cols-3 gap-6">
          {
            profile.additional_images?.map(img => {
              return (
                <div key={img.directus_files_id.id}>
                  <ImageWithCaption
                    image={img.directus_files_id}
                    className="relative w-full h-full object-cover mb-2"
                    width={800}
                    height={800}
                  />
                </div>
              )
            })
          }
          </div>
        </div>
      </section>
    }

    </>
  )
}