"use client"

import { useState, useEffect, useRef } from 'react'
import { createProfile, updateProfile, userSession, currentUser } from '@/lib/data-access'
import {useRouter} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation, EffectFade, Pagination } from 'swiper/modules';
import { ChevronRightIcon, ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import 'swiper/css';
import 'swiper/css/pagination';

import SlideContainer from '@/components/profile-form/SlideContainer';
import Intro from '@/components/profile-form/Intro';
import Stage1 from '@/components/profile-form/Stage1';
import Stage2 from '@/components/profile-form/Stage2';
import Stage3 from '@/components/profile-form/Stage3';
import Stage4 from '@/components/profile-form/Stage4';
import Stage5 from '@/components/profile-form/Stage5';
import Stage6 from '@/components/profile-form/Stage6';

export default function ProfileForm({user, defaultProfile, tags, prompts, locale}) {
  const [profile, setProfile] = useState(defaultProfile)
  const [location, setLocation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const router = useRouter()
  const t = useTranslations('profile_form');

  const updateProfileData = field => input => {
    setProfile({
      ...profile,
      [field]: typeof(input) === "string" ? input : input.target?.value
    })
  }

  const handleSubmit = async() => {
    setSubmitting(true)
    console.log({profile})
    // filter out empty links
    const links = profile.links.filter(l => (l.url.length > 0))
    const tagData = profile.tags.map(t => ({tags_id: t.id}))

    const profileData = {
      ...profile,
      user_created: user?.id,
      links: JSON.stringify(links),
      profile_picture: profile.profile_picture?.id,
      location: location,
      status: "draft",
      tags: tagData
    }
    const result = profile.id ? await updateProfile(profile.id, profileData) : await createProfile(profileData)
    console.log({result})
    if (result.errors) {
      setErrors(result.errors)
      setSubmitting(false)
    } else {
      setProfile(result)
      const profileLink = `/profiles/${result.slug}`
      router.push(profileLink)
  
      // swiper.slideNext()
    }
  }

  const swiper = useSwiper()

  return (
    <section className="text-dark p-6 py-12 pt-20 relative min-h-screen">
      <div className="bg-[url(/backdrops/Painting_2.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full" />    
        <div className="container relative sm:max-w-screen-sm md:max-w-screen-md mx-auto my-0 md:my-4 lg:my-8">
        <h1 className="font-title text-center text-4xl md:text-5xl lg:text-6xl mb-6 lg:mb-8">{t('page_title')}</h1>      
        <div className="bg-beige profile-form-swiper"> 
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              className="relative"
              pagination={{
                clickable: true,
                type: 'progressbar',
              }}
              allowTouchMove={false}
              autoHeight={true}
            >
              <SwiperSlide>
                <SlideContainer   
                  isFirstSlide={true}
                >
                  <Intro  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer 
                  title={t('step_1_title')} 
                  description={t('step_1_description')}
                >
                  <Stage1 
                    profile={profile} 
                    updateProfileData={updateProfileData} 
                    setLocation={setLocation} 
                    location={location} 
                  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer 
                  title={t('step_2_title')} 
                  description={t('step_2_description')}
                >
                  <Stage2 
                    profile={profile} 
                    updateProfileData={updateProfileData}
                    setProfile={setProfile}
                  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer 
                  title={t('step_3_title')} 
                  description={t('step_3_description')}
                >
                  <Stage3 
                    profile={profile} 
                    updateProfileData={updateProfileData}
                    setProfile={setProfile}
                  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer 
                  title={t('step_4_title')} 
                  description={t('step_4_description')}
                >
                  <Stage4 
                    prompts={prompts}
                    locale={locale}
                  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer 
                  title={t('step_5_title')} 
                  description={t('step_5_description')}
                >
                  <Stage5 
                    profile={profile} 
                    updateProfileData={updateProfileData}
                    setProfile={setProfile}
                    locale={locale}
                  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer 
                  title={t('step_6_title')} 
                  description={t('step_6_description')}
                  isLastSlide={true}
                  handleSubmit={handleSubmit}
                >
                  <Stage6 
                    profile={profile} 
                    setProfile={setProfile}
                    tags={tags}
                  />
                </SlideContainer>
              </SwiperSlide>
            </Swiper>

            {errors && errors.map(error => (
              <p className="mb-4 text-orange" key={error.message}>{error.message}</p>
            ))}
        </div>
      </div>
    </section>
  )
}