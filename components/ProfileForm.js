"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import { useState } from 'react'
import { createProfile, uploadImage } from '@/utils/directus'
import { useRouter } from 'next/navigation'

const defaultProfile = {
  status: "published",
  profile_type: "individual",
  public_name: "",
  short_introduction: "",
  pronouns: "",
  current_projects: "",
  artistic_practice: "",
  inspirations: "",
  past_projects: "",
  tags: [],
  links: [{link_text: "", url: ""}, {link_text: "", url: ""}, {link_text: "", url: ""}]
}

export default function ProfileForm({tags}) {
  const [profile, setProfile] = useState(defaultProfile)
  const [fileUploading, setFileUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const router = useRouter()

  const updateProfile = field => input => {

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
    const data = {
      ...profile,
      links: JSON.stringify(profile.links),
      profile_picture: profile.profile_picture?.id,
    }
    console.log({data})
    const result = await createProfile(data)
    if (result.errors) {
      setErrors(result.errors)
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

 
  return (
    <>
      <section className="bg-white text-dark relative">
        <div className="container bg-primary max-w-md sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl rounded-lg p-16 mx-auto my-8 lg:my-12">
          <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">Create your profile</h1>
          <form className="" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="public_name">
                Public name*
              </label>
              <small className="mb-2 block">How would you like to be known publicly?</small>
              <input required onChange={updateProfile("public_name")} value={profile.public_name} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="public_name" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="pronouns">
                Pronouns
              </label>
              <small className="mb-2 block">What are your preferred pronouns?</small>
              <input onChange={updateProfile("pronouns")} value={profile.pronouns} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pronouns" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="current_projects">
                Current project*
              </label>
              <small className="mb-2 block">What are you working on now?</small>
              <RichTextEditor required onChange={updateProfile("current_projects")} value={profile.current_projects} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="artistic_practice">
                Artist bio*
              </label>
              <small className="mb-2 block">Describe your artistic practice</small>
              <RichTextEditor required onChange={updateProfile("artistic_practice")} value={profile.artistic_practice} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="inspirations">
                Inspirations*
              </label>
              <small className="mb-2 block">What has inspired you?</small>
              <RichTextEditor required onChange={updateProfile("inspirations")} value={profile.inspirations} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="past_projects">
                Past projects*
              </label>
              <small className="mb-2 block">Tell us about your past projects</small>
              <RichTextEditor required onChange={updateProfile("introduction")} value={profile.introduction} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="short_introduction">
                Profile preview*
              </label>
              <small className="mb-2 block">Write a short intro that will appear on your profile preview card</small>
              <input required onChange={updateProfile("short_introduction")} value={profile.short_introduction} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="short_introduction" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                Tags
              </label>
              <div className="flex gap-2">
              {
                tags.map(tag => {
                  const selected = profile.tags.findIndex(t => t.tags_id === tag.id)
                  return (
                    <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`rounded-full border py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-light'}`}>{tag.name}</button>
                  )
                })
              }
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Links
              </label>
              <small className="mb-2 block">Add up to three links to your website, portfolio, or other socials</small>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(0, 'link_text')} value={profile.links[0].link_text} placeholder="Link text" className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(0, 'url')} value={profile.links[0].url} placeholder="URL" className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(1, 'link_text')} value={profile.links[1].link_text} placeholder="Link text" className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.text" type="text" />
                <input onChange={updateLinks(1, 'url')} value={profile.links[1].url} placeholder="URL" className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(2, 'link_text')} value={profile.links[2].link_text} placeholder="Link text" className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(2, 'url')} value={profile.links[2].url} placeholder="URL" className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
                Profile picture
              </label>
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

            <div className="flex items-center justify-between mt-8">
              <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="submit" />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}