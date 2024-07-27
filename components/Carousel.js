"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


export default async function Carousel({profiles}) {

  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {profiles.map(profile => {
        const tagsText = profile.tags.map(t => t.name).join(", ")
        return (
          <SwiperSlide key={profile.id}>
          <div key={profile.id}>
            <div className="p-6 bg-light text-dark rounded-xl relative">
              <Link href={`/profiles/${profile.slug}`}>
              <h1 className="font-title text-xl md:text-2xl mb-2">
                {profile.public_name}{profile.profile_type === "collective" ? "*" : ""}
              </h1>
              </Link>
              <p className="mb-4">{profile.pronouns}</p>
              <div className="">
                {
                  profile.profile_picture &&
                  <Image
                    className="relative w-full h-full aspect-video object-cover rounded-xl mb-4"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                    alt={profile.profile_picture.description || profile.public_name} 
                    width={800}
                    height={800}
                  />
                }
                <div className="flex-1">
                  <p className="mb-4">{profile.short_introduction}</p>
                </div>

                <div className="flex-1 mb-4">
                  {(profile.tags.length > 0) && <p className="uppercase font-medium tracking-wide text-sm">{`Tags: ${tagsText}`}</p>}
                </div>

                <Link href={`/profiles/${profile.slug}`} className="font-medium underline">
                  Full profile
                </Link>
              </div>
            </div>
          </div>
          </SwiperSlide>
        )
      })}
      </Swiper>
  )
}