import { getProfiles } from '@/utils/directus'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from "isomorphic-dompurify";
import Carousel from "@/components/Carousel"


export default async function AllProfilesPage({params}) {
  const profiles = await getProfiles()

  return (
    <section className="bg-white text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto">
        <div className="flex pt-12">
          <div className="basis-1/4">
            <h1 className="font-title text-4xl mb-4">Explore artists</h1>
            <p className="uppercase text-xl mb-4 font-medium">Filters</p>
          </div>
          <div className="basis-3/4 flex justify-center">
            <div className="max-w-lg">
              <Carousel profiles={profiles} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}