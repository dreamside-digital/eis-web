"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import { EffectCoverflow } from 'swiper/modules';
import { DATE_FORMAT } from '@/utils/constants'
import DOMPurify from "isomorphic-dompurify";

export default function Carousel({profiles, events}) {

  if (profiles) {
    return (
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        modules={[EffectCoverflow]}
        className="mySwiper"
        onSlideChange={() => console.log('slide change')}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
      >
        {profiles.map(profile => {
          const tagsText = profile.tags.map(t => t.name).join(", ")
          return (
            <SwiperSlide key={profile.id} className=" max-w-md">
              <div className="p-6 bg-light text-dark  relative">
                <Link className="text-xl no-underline hover:text-highlight" href={`/profiles/${profile.slug}`}>
                  <h1 className="font-title text-xl md:text-2xl mb-4">
                    {profile.public_name}
                  </h1>
                </Link>
                <p className="mb-4">{profile.pronouns}</p>
                <div className="">
                  {
                    profile.profile_picture &&
                    <Image
                      className="relative w-full h-full aspect-video object-cover  mb-4"
                      src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                      alt={profile.profile_picture.description || profile.public_name} 
                      width={500}
                      height={500}
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
            </SwiperSlide>
          )
        })}
        </Swiper>
    )    
  }

  if (events) {
    return (
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        modules={[EffectCoverflow]}
        className="mySwiper"
        onSlideChange={() => console.log('slide change')}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
      >
        {events.map(event => {
            const tagsText = event.tags.map(t => t.name).join(", ")
            const startDate = new Date(event.starts_at)
            const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
            const endDate = new Date(event.ends_at)
            const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
            const locationText = [event.location.name, event.location.street_address, event.location.city].filter(i=>i).join(", ")
            const cleanDescription = DOMPurify.sanitize(event.description, { USE_PROFILES: { html: true } })

            return (
              <SwiperSlide key={event.id} className=" max-w-lg">
                <div className="p-6 bg-light text-dark  relative">
                  <Link className="text-xl no-underline hover:text-highlight" href={`/events/${event.slug}`}>
                    <h1 className="font-title text-xl md:text-2xl mb-4 text-center">
                      {event.title}
                    </h1>
                  </Link>
                  <div className="">
                    {
                      (event.main_image) &&
                      <Image
                        className="relative w-full h-full object-cover  mb-4"
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.main_image}`}
                        alt={"Event image"} 
                        width={500}
                        height={500}
                      />
                    }
                    <div className="flex-1 mb-4">
                      <p className="">{`Starts at: ${startDateText}`}</p>
                      <p className="">{`Ends at: ${endDateText}`}</p>
                      <p className="">{`Location: ${locationText || "TBA"}`}</p>
                      <p className="">{`Organizer: ${event.organizer}`}</p>
                      <p className="">{`Contact: ${event.contact}`}</p>
                      <p className="">{`Tags: ${tagsText}`}</p>
                    </div>

                    <div className="">
                      <Link className="font-medium underline" href={`/events/${event.slug}`}>{`Event page`}</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
    )    
  }

}