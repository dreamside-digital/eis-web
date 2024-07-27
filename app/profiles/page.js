import { getProfiles } from '@/utils/directus'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from "isomorphic-dompurify";
import Carousel from "@/components/Carousel"


export default async function AllProfilesPage({params}) {
  const profiles = await getProfiles()

  return (
    <section className="bg-white text-dark p-6 py-12 pt-24 relative">
      <div className="container mx-auto">
       <Carousel profiles={profiles} />
      </div>
    </section>
  )
}