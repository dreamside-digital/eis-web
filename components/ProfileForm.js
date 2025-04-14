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
import Loader from '@/components/Loader';

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

  useEffect(() => {
    setErrors(null)
  }, [profile])

  const handleSubmit = async() => {
    setSubmitting(true)

    // Submit tarot responses if there are any
    if (tarotResponses.length > 0) {
      try {
        const tarotResponse = await fetch('/api/submit-tarot-responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            responses: tarotResponses,
            source: 'profile_form'
          }),
        });

        const tarotData = await tarotResponse.json();
        
        if (!tarotResponse.ok) {
          throw new Error(tarotData.error || 'Failed to submit tarot responses');
        }

        // Add the tarot submission ID to the profile data
        profile.tarot_submissions = tarotData.submission.id
      } catch (error) {
        console.error('Error submitting tarot responses:', error);
        setErrors([{message: 'Failed to submit tarot responses. Please try again.'}]);
        setSubmitting(false);
        return;
      }
    }
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

    if (result.errors) {
      setErrors(result.errors)
      setSubmitting(false)
    } else {
      setProfile(result)
      const profileLink = `/profiles/${result.slug}`
      router.push(profileLink)
    }
  }

  const validateStage1 = () => {
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

  const validateStage2 = () => {
    setErrors(null)
    if (!profile.profile_picture?.id) {
        setErrors([{message: "Please add a profile picture."}])
      return false
    }
    return true
  }

  const validateStage3 = () => {
    setErrors(null)
    const links = profile.links.filter(l => (l.url.length > 0))
    if (links.length < 1) {
        setErrors([{message: "Please add at least one link."}])
      return false
    }
    return true
  }

  const validateStage4 = () => {
    setErrors(null)
    if (tarotResponses.length !== 3) {
        setErrors([{message: "Please answer all three prompts."}])
      return false
    }
    return true
  }

  const validateStage5 = () => {
    setErrors(null)
    if (!profile.introduction?.trim() && !profile.artistic_practice?.trim() && !profile.current_projects?.trim()) {
      setErrors([{message: "Please answer at least one of the prompts."}])
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
        <div className="bg-beige profile-form-swiper relative"> 
          {submitting && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader className="w-24 h-24" />
            </div>
          )}
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
                validate={validateStage1}
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
                validate={validateStage2} 
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
                validate={validateStage3}
              >
                <Stage3 
                  profile={profile} 
                  updateProfileData={updateProfileData}
                  setProfile={setProfile}
                />
              </SlideContainer>
            </SwiperSlide>
            <SwiperSlide virtualIndex={4}>
              <SlideContainer 
                title={t('step_4_title')} 
                description={tarotResponses.length < 3 ? t('step_4_description') : null}
                validate={validateStage4}
                disableNext={tarotResponses.length < 3}
              >
                <Stage4 
                  prompts={prompts}
                  locale={locale}
                  setResponses={setTarotResponses}
                  responses={tarotResponses}
                />
              </SlideContainer>
            </SwiperSlide>
            <SwiperSlide virtualIndex={5}>
              <SlideContainer 
                title={t('step_5_title')} 
                description={t('step_5_description')}
                validate={validateStage5}
                disableNext={!profile.introduction?.trim() && !profile.artistic_practice?.trim() && !profile.current_projects?.trim()}
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