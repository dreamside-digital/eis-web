"use client"

import { useState, useEffect, useRef } from 'react'
import { createProfile, updateProfile, userSession, currentUser } from '@/lib/data-access'
import {useRouter} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Virtual } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/virtual';

import SlideContainer from '@/components/profile-form/SlideContainer';
import Intro from '@/components/profile-form/Intro';
import Stage1 from '@/components/profile-form/Stage1';
import Stage2 from '@/components/profile-form/Stage2';
import Stage3 from '@/components/profile-form/Stage3';
import Stage4 from '@/components/profile-form/Stage4';
import Stage5 from '@/components/profile-form/Stage5';
import Stage6 from '@/components/profile-form/Stage6';
import ErrorAlert from '@/components/ErrorAlert';

export default function ProfileForm({user, defaultProfile, tags, prompts, locale}) {
  const [profile, setProfile] = useState(defaultProfile)
  const [tarotResponses, setTarotResponses] = useState([])
  const [location, setLocation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const router = useRouter()
  const t = useTranslations('profile_form');

  const updateProfileData = field => input => {
    setErrors(null)
    setProfile({
      ...profile,
      [field]: typeof(input) === "string" ? input : input.target?.value
    })
  }

  const handleSubmit = async() => {
    setSubmitting(true)
    console.log({profile})
    console.log({tarotResponses})
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

  console.log({tarotResponses})

  const validateProfile = () => {
    console.log({profile})
    setErrors(null)
    if (!profile.public_name?.trim()) {
      setErrors([{message: "Please enter your name"}])
      return false
    }

    if (!location && !profile.postal_code?.trim()) {
      setErrors([{message: "Please enter your location or postal code"}])
      return false
    }

    return true
  }

  return (
    <section className="text-dark p-6 py-12 pt-20 relative min-h-screen">
      <ErrorAlert errors={errors} setErrors={setErrors} />
      <div className="bg-[url(/backdrops/Painting_2.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full" />    
      <div className="container relative sm:max-w-screen-sm md:max-w-screen-md mx-auto my-0 md:my-4 lg:my-8">
        <h1 className="font-title text-center text-4xl md:text-5xl lg:text-6xl mb-6 lg:mb-8">{t('page_title')}</h1>      
        <div className="bg-beige profile-form-swiper"> 
            <Swiper
              modules={[Navigation, Pagination, Virtual]}
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
              virtual
            >
              <SwiperSlide virtualIndex={0}>
                <SlideContainer   
                  isFirstSlide={true}
                >
                  <Intro  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide virtualIndex={1}>
                <SlideContainer 
                  title={t('step_1_title')} 
                  description={t('step_1_description')}
                  validate={validateProfile}
                >
                  <Stage1 
                    profile={profile} 
                    updateProfileData={updateProfileData} 
                    setLocation={setLocation} 
                    location={location} 
                  />
                </SlideContainer>
              </SwiperSlide>
              <SwiperSlide virtualIndex={2}>
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
              <SwiperSlide virtualIndex={3}>
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
              <SwiperSlide virtualIndex={4}>
                  <Stage4 
                    prompts={prompts}
                    locale={locale}
                    setResponses={setTarotResponses}
                    responses={tarotResponses}
                  />
              </SwiperSlide>
              <SwiperSlide virtualIndex={5}>
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
              <SwiperSlide virtualIndex={6}>
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
        </div>
      </div>
    </section>
  )
}