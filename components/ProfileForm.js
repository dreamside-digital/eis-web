"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import MapPointSelector from '@/components/MapPointSelector'
import { useState, useEffect, useRef } from 'react'
import { uploadImage, createProfile, updateProfile, userSession, currentUser } from '@/lib/data-access'
import {useRouter} from '@/i18n/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import {useTranslations} from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronRightIcon, ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import TarotContainer from '@/components/TarotContainer';
import TarotCards from '@/components/TarotCards';
import SlideContainer from '@/components/profile-form/SlideContainer';
import Stage1 from '@/components/profile-form/Stage1';
import Stage2 from '@/components/profile-form/Stage2';

export default function ProfileForm({user, defaultProfile, tags, prompts, locale}) {
  const [profile, setProfile] = useState(defaultProfile)
  const [location, setLocation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const swiperRef = useRef(null)
  const router = useRouter()
  const t = useTranslations('profile_form');
  const [visibleLinks, setVisibleLinks] = useState(1);
  const [selectedContextQuestion, setSelectedContextQuestion] = useState(null);

  const updateProfileData = field => input => {
    setProfile({
      ...profile,
      [field]: typeof(input) === "string" ? input : input.target?.value
    })
  }

  const updateTags = (tag, e) => {
    e.preventDefault()
    const tagIndex = profile.tags.findIndex(t => t.id === tag.id)
    if (tagIndex === -1) {
      setProfile({
        ...profile,
        tags: profile.tags.concat(tag)
      })
    } else {
      const newTags = [...profile.tags]
      newTags.splice(tagIndex,1)
      setProfile({
        ...profile,
        tags: newTags
      })
    }
  }

  const updateLinks = (index, field) => input => {
    const newLinks = [...profile.links]
    newLinks[index] = {...profile.links[index], [field]: input.target.value }
    setProfile({
      ...profile,
      links: newLinks
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
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
      // const profileLink = `/profiles/${result.slug}`
      // router.push(profileLink)
      setProfile(result)
      swiperRef.current?.slideNext()
    }
  }

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUploading(true);
      
      // Preview the image immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          profile_picture: {
            id: 'preview',
            width: 400,
            height: 400,
            preview: reader.result
          }
        });
      };
      reader.readAsDataURL(file);

      // Upload the image
      const formData = new FormData();
      formData.append('file', file, file.name);
      const result = await uploadImage(formData);
      
      setProfile({
        ...profile,
        profile_picture: result
      });
      setFileUploading(false);
    } else {
      setProfile({
        ...profile,
        profile_picture: null
      });
    }
  };

  const addNewLink = (e) => {
    e.preventDefault();
    if (visibleLinks < 3) {
      setVisibleLinks(prev => prev + 1);
    }
  };

  const removeLink = (indexToRemove) => {
    const newLinks = [...profile.links];
    newLinks.splice(indexToRemove, 1);
    setProfile({
      ...profile,
      links: newLinks
    });
    setVisibleLinks(prev => prev - 1);
  };

  const contextQuestions = [
    {
      id: 'artistic_practice',
      category: {
        id: '1',
        translations: [
          {
            languages_code: "en",
            name: "Bio"
          },
          {
            languages_code: "fr",
            name: "Bio"
          }
        ]
      },
      translations: [
        {
          languages_code: "en",
          prompt: "Describe your artistic practice"
        },
        {
          languages_code: "fr",
          prompt: "Describe your artistic practice"
        }
      ]
    },
    {
      id: 'current_projects',
      category: {
        id: '2',
        translations: [
          {
            languages_code: "en",
            name: "Current Project"
          },
          {
            languages_code: "fr",
            name: "Current Project"
          }
        ]
      },
      translations: [
        {
          languages_code: "en",
          prompt: "What are you working on now?"
        },
        {
          languages_code: "fr",
          prompt: "What are you working on now?"
        }
      ]
    },
    {
      id: 'introduction',
      category: {
        id: '3',
        translations: [
          {
            languages_code: "en",
            name: "Past Projects"
          },
          {
            languages_code: "fr",
            name: "Past Projects"
          }
        ]
      },
      translations: [
        {
          languages_code: "en",
          prompt: "Tell us about your past projects"
        },
        {
          languages_code: "fr",
          prompt: "Tell us about your past projects"
        }
      ]
    }
  ]

  const formSlides = [
    {
      title: t('step_1_title'),
      description: t('step_1_description'),
      content: (
        <div className="space-y-8">
          <div>
            <label className="font-semibold mb-1 block">{t('public_name')}</label>
            <input 
              required 
              onChange={updateProfileData("public_name")} 
              value={profile.public_name} 
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              type="text" 
              placeholder={t('public_name_hint')}
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block">{t('pronouns')}</label>
            <input 
              onChange={updateProfileData("pronouns")} 
              value={profile.pronouns} 
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              type="text" 
              placeholder={t('pronouns_hint')}
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block">{t('location')}</label>
            <small className="mb-2 block">{t('location_hint')}</small>
            <button hidden={showPostalCodeField} className="text-sm underline mb-4" onClick={revealPostalCodeField}>
              {t('refuse_location')}
            </button>
            {showPostalCodeField ? (
              <div>
                <label className="font-semibold mb-1 block">{t('postal_code')}</label>
                <input 
                  onChange={updateProfileData("postal_code")} 
                  value={profile.postal_code} 
                  className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                />
              </div>
            ) : (
              <MapPointSelector setLocation={setLocation} selectedLocation={location} />
            )}
          </div>
        </div>
      )
    },
    {
      title: t('step_2_title'),
      description: t('step_2_description'),
      content: (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-xl aspect-square mb-4 bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {fileUploading ? (
              <div className="absolute inset-0 bg-white animate-pulse" />
            ) : profile.profile_picture ? (
              <Image
                src={profile.profile_picture.id === 'preview' 
                  ? profile.profile_picture.preview 
                  : `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture.id}`
                }
                alt={profile.profile_picture.description || profile.public_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-center px-4">
                  {t('upload_image_placeholder')}
                </p>
                <label className="btn cursor-pointer">
                  <input 
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {profile.profile_picture ? t('change_image') : t('select_image')}
                </label>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: t('step_3_title'),
      description: t('step_3_description'),
      content: (
        <div className="space-y-4">
          <label className="font-semibold mb-1 block">{t('links')}</label>
          {[...Array(visibleLinks)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <input 
                    onChange={updateLinks(index, 'link_text')} 
                    value={profile.links[index]?.link_text || ''} 
                    placeholder={t('link')} 
                    className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  />
                  <input 
                    onChange={updateLinks(index, 'url')} 
                    value={profile.links[index]?.url || ''} 
                    placeholder={t('url')} 
                    className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  />
                </div>
                <button 
                  onClick={() => removeLink(index)}
                  type="button"
                  disabled={index === 0}
                  className={`text-gray-400 hover:text-red-500 ${index === 0 ? 'invisible' : ''}`}
                  title={t('remove_link')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {index === visibleLinks - 1 && visibleLinks < 3 && (
                <button 
                  onClick={addNewLink}
                  type="button"
                  className="text-sm text-dark hover:text-highlight underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('add_another_link')}
                </button>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: t('step_4_title'),
      description: t('step_4_description'),
      content: (
        <TarotContainer prompts={prompts} locale={locale} />
      )
    },
    {
      title: t('step_5_title'),
      description: t('step_5_description'),
      content: (
        <div>
          <TarotCards prompts={contextQuestions} locale={locale} setSelectedPrompt={setSelectedContextQuestion} />
          <div className={`mb-6 ${selectedContextQuestion?.id === 'current_projects' ? '' : 'hidden'}`}>
              <label className="block text-gray-700 text-sm font-bold" htmlFor="current_projects">
                {t('current_project')}
              </label>
              <small className="mb-2 block">{t('current_project_hint')}</small>
              <RichTextEditor required onChange={updateProfileData("current_projects")} value={profile.current_projects} />
            </div>

            <div className={`mb-6 ${selectedContextQuestion?.id === 'artistic_practice' ? '' : 'hidden'}`}>
              <label className="block text-gray-700 text-sm font-bold" htmlFor="artistic_practice">
                {t('artistic_practice')}
              </label>
              <small className="mb-2 block">{t('artistic_practice_hint')}</small>
              <RichTextEditor required onChange={updateProfileData("artistic_practice")} value={profile.artistic_practice} />
            </div>

            <div className={`mb-6 ${selectedContextQuestion?.id === 'introduction' ? '' : 'hidden'}`}>
              <label className="block text-gray-700 text-sm font-bold" htmlFor="past_projects">
                {t('past_projects')}
              </label>
              <small className="mb-2 block">{t('past_projects_hint')}</small>
              <RichTextEditor onChange={updateProfileData("introduction")} value={profile.introduction} />
            </div>
        </div>
      )
    },
    {
      title: t('step_6_title'),
      description: t('step_6_description'),
      content: (
        <div className="mb-6">
          <label className="font-semibold mb-1 block" htmlFor="tags">
            {t('tags')}
          </label>
          <div className="flex flex-wrap gap-2">
          {
            tags.map(tag => {
              const selected = profile.tags.findIndex(t => t.tags_id === tag.id)
              return (
                <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-lavendar'}`}>{tag.name}</button>
              )
            })
          }
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="text-dark p-6 py-12 pt-20 relative min-h-screen">
      <div className="bg-[url(/backdrops/Painting_2.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full" />    
        <div className="container relative sm:max-w-screen-sm md:max-w-screen-md mx-auto my-0 md:my-4 lg:my-8">
        <h1 className="font-title text-center text-4xl md:text-5xl lg:text-6xl mb-6">{t('page_title')}</h1>      
        <div className="bg-beige p-8"> 
          <form onSubmit={handleSubmit} className="relative">
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              className="relative"
              pagination={{
                el: '.swiper-pagination',
                clickable: true,
              }}
              allowTouchMove={false}
            >
              <SwiperSlide>
                <SlideContainer title={t('step_1_title')} description={t('step_1_description')}>
                  <Stage1 
                    profile={profile} 
                    updateProfileData={updateProfileData} 
                    setLocation={setLocation} 
                    location={location} 
                  />
                </SlideContainer>
                <div className="flex justify-end mt-8 items-center">
                  <button 
                    type="submit"
                    className="btn flex items-center gap-1"
                  >
                    {t('next_slide')}
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <SlideContainer title={t('step_2_title')} description={t('step_2_description')}>
                  <Stage2 profile={profile} updateProfileData={updateProfileData} />
                </SlideContainer>
              </SwiperSlide>
            </Swiper>

            {errors && errors.map(error => (
              <p className="mb-4 text-orange" key={error.message}>{error.message}</p>
            ))}
          </form>
        </div>
      </div>
    </section>
  )
}