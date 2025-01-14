"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import MapPointSelector from '@/components/MapPointSelector'
import { useState, useEffect } from 'react'
import { uploadImage, createProfile, updateProfile, userSession, currentUser } from '@/lib/data-access'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import {useTranslations} from 'next-intl';


export default function ProfileForm({user, defaultProfile, tags}) {
  const [profile, setProfile] = useState(defaultProfile)
  const [fileUploading, setFileUploading] = useState(false)
  const [location, setLocation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPostalCodeField, setShowPostalCodeField] = useState(false)
  const [errors, setErrors] = useState()
  const router = useRouter()
  const t = useTranslations('profile_form');

  const updateProfileData = field => input => {

    setProfile({
      ...profile,
      [field]: typeof(input) === "string" ? input : input.target?.value
    })
  }

  const updateTags = (tag, e) => {
    e.preventDefault()
    const tagIndex = profile.tags.findIndex(t => t.tags_id === tag.id)
    if (tagIndex === -1) {
      setProfile({
        ...profile,
        tags: profile.tags.concat({ tags_id: tag.id })
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

    // filter out empty links
    const links = profile.links.filter(l => (l.url.length > 0))

    const data = {
      ...profile,
      user_created: user?.id,
      links: JSON.stringify(links),
      profile_picture: profile.profile_picture?.id,
      location: location,
      status: "draft"
    }
    const result = profile.id ? await updateProfile(profile.id, data) : await createProfile(data)
    if (result.errors) {
      setErrors(result.errors)
      setSubmitting(false)
    } else {
      const profileLink = `/profiles/${result.slug}`
      router.push(profileLink)
    }
    setSubmitting(false)
  }

  const handleFileChange = async(e) => {

    if (e.target.files[0]) {
      setFileUploading(true)
      const formData = new FormData()
      formData.append('file', e.target.files[0], event.target?.files[0]?.name)
      const result = await uploadImage(formData)
      setProfile({
        ...profile,
        profile_picture: result
      })
      setFileUploading(false)
    } else {
      setProfile({
        ...profile,
        profile_picture: null
      })
    }
  }

  const revealPostalCodeField = (e) => {
    e.preventDefault()
    setShowPostalCodeField(true)
  }

 
  return (
    <>
      <section className="text-dark p-6 py-12 pt-20 relative">
        <div className="bg-[url(/backdrops/Painting_2.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full" />    
        <div className="container relative bg-beige sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl p-8 lg:p-16 mx-auto my-0 md:my-8 lg:my-12">
          <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">{t('page_title')}</h1>
          <form className="" onSubmit={handleSubmit}>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="public_name">
                {t('public_name')}
              </label>
              <small className="mb-2 block">{t('public_name_hint')}</small>
              <input required onChange={updateProfileData("public_name")} value={profile.public_name} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="public_name" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="pronouns">
                {t('pronouns')}
              </label>
              <small className="mb-2 block">{t('pronouns_hint')}</small>
              <input onChange={updateProfileData("pronouns")} value={profile.pronouns} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pronouns" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="current_projects">
                {t('current_project')}
              </label>
              <small className="mb-2 block">{t('current_project_hint')}</small>
              <RichTextEditor required onChange={updateProfileData("current_projects")} value={profile.current_projects} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="artistic_practice">
                {t('artistic_practice')}
              </label>
              <small className="mb-2 block">{t('artistic_practice_hint')}</small>
              <RichTextEditor required onChange={updateProfileData("artistic_practice")} value={profile.artistic_practice} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="inspirations">
                {t('inspirations')}
              </label>
              <small className="mb-2 block">{t('inspirations_hint')}</small>
              <RichTextEditor onChange={updateProfileData("inspirations")} value={profile.inspirations} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="past_projects">
                {t('past_projects')}
              </label>
              <small className="mb-2 block">{t('past_projects_hint')}</small>
              <RichTextEditor onChange={updateProfileData("introduction")} value={profile.introduction} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="short_introduction">
                {t('profile_preview')}
              </label>
              <small className="mb-2 block">{t('profile_preview_hint')}</small>
              <input required maxLength={500} onChange={updateProfileData("short_introduction")} value={profile.short_introduction} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="short_introduction" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                {t('tags')}
              </label>
              <div className="flex flex-wrap gap-2">
              {
                tags.map(tag => {
                  const selected = profile.tags.findIndex(t => t.tags_id === tag.id)
                  return (
                    <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`border py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-beige'}`}>{tag.name}</button>
                  )
                })
              }
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t('links')}
              </label>
              <small className="mb-2 block">{t('links_hint')}</small>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(0, 'link_text')} value={profile.links[0].link_text} placeholder={t('link')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(0, 'url')} value={profile.links[0].url} placeholder={t('url')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(1, 'link_text')} value={profile.links[1].link_text} placeholder={t('link')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.text" type="text" />
                <input onChange={updateLinks(1, 'url')} value={profile.links[1].url} placeholder={t('url')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(2, 'link_text')} value={profile.links[2].link_text} placeholder={t('link')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link3.text" type="text" />
                <input onChange={updateLinks(2, 'url')} value={profile.links[2].url} placeholder={t('url')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link3.url" type="text" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
                {t('profile_picture')}
              </label>
              {t.has('profile_picture_hint') && <small className="mb-2 block">{t('profile_picture_hint')}</small>}
              <input onChange={handleFileChange} type="file" className="" id="profile_picture" />
              {
                fileUploading && 
                <div className="mt-2 w-48 h-48 bg-white animate-pulse" />
              }
              {
                profile.profile_picture && 
                <div className="mt-2">
                  <Image
                    className="w-48 aspect-square relative w-full h-auto object-cover bg-white"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture.id}`}
                    alt={profile.profile_picture.description || profile.public_name} 
                    width={profile.profile_picture.width}
                    height={profile.profile_picture.height}
                  />
                </div>
              }
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                {t('location')}
              </label>
              <small className="mb-2 block">{t('location_hint')}</small>
              <div className="mb-6">
                <button hidden={showPostalCodeField} className="text-sm underline" onClick={revealPostalCodeField}>{t('refuse_location')}</button>
                <div hidden={!showPostalCodeField}>
                  <label className="block text-gray-700 text-sm font-bold" htmlFor="postal_code">
                    {t('postal_code')}
                  </label>
                  <small className="mb-2 block">{t('postal_code_hint')}</small>
                  <input onChange={updateProfileData("postal_code")} value={profile.postal_code} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="postal_code" type="text" />
                </div>
              </div>
              {!showPostalCodeField && <MapPointSelector setLocation={setLocation} selectedLocation={location} />}
            </div>


            <div className="flex items-center justify-between mt-8">
              {submitting && <div className="animate-spin"><ArrowPathIcon className="h-6 w-6 text-dark" /></div>}
              {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" value={t('submit')} />}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}