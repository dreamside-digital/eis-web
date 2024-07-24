import { getProfiles } from '@/utils/directus'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from "isomorphic-dompurify";


export default async function AllProfilesPage({params}) {
  const profiles = await getProfiles()

  return (
    <section className="bg-white text-dark p-6 py-12 pt-24 relative">
      <div className="container mx-auto grid grid-cols-3 gap-12">
      {profiles.map(profile => {
        const tagsText = profile.tags.map(t => t.name).join(", ")
        return (
          <div key={profile.id}>
            <div className="p-6 bg-light text-dark rounded-xl relative">
              <Link href={`/profiles/${profile.slug}`}>
              <h1 className="font-title text-3xl md:text-4xl mb-4 text-center">
                {profile.public_name}{profile.profile_type === "collective" ? "*" : ""}
              </h1>
              </Link>
              <p className="uppercase text-center tracking-wide mb-6">{profile.pronouns}</p>
              <div className="">
                {
                  profile.profile_picture &&
                  <Image
                    className="relative w-full h-full aspect-square object-cover rounded-xl mb-6"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                    alt={profile.profile_picture.description || profile.public_name} 
                    width={800}
                    height={800}
                  />
                }
                <div className="flex-1">
                  <p className="mb-6">{profile.short_introduction}</p>
                </div>

                <div className="flex-1 mb-6">
                  {(profile.tags.length > 0) && <p className="uppercase font-medium tracking-wide">{`Tags: ${tagsText}`}</p>}
                </div>

                <Link href={`/profiles/${profile.slug}`} className="text-lg font-medium underline">
                  Full profile
                </Link>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    </section>
  )
}