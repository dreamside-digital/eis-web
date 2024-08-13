"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import { useState } from 'react'

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
  links: [],
  profile_picture: ""
}

export default function ProfileForm({tags, createProfile}) {
  const [profile, setProfile] = useState(defaultProfile)

  const updateProfile = field => input => {
    setProfile({
      ...profile,
      [field]: input.currentTarget?.value || input
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log(e)
    console.log(profile)
  }
 
  return (
    <>
      <section className="bg-white text-dark relative">
        <div className="container bg-primary max-w-screen-xl rounded-lg p-16 mx-auto my-8 lg:my-12">
          <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">Create your profile</h1>
          <form className="" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="public_name">
                Public name
              </label>
              <small className="mb-2 block">How would you like to be known publicly?</small>
              <input onChange={updateProfile("public_name")} value={profile.public_name} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="public_name" type="text" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="pronouns">
                Pronouns
              </label>
              <small className="mb-2 block">What are your preferred pronouns?</small>
              <input onChange={updateProfile("pronouns")} value={profile.pronouns} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pronouns" type="text" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="current_projects">
                Current project
              </label>
              <small className="mb-2 block">What are you working on now?</small>
              <RichTextEditor onChange={updateProfile("current_projects")} value={profile.current_projects} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="artistic_practice">
                Artist bio
              </label>
              <small className="mb-2 block">Describe your artistic practice</small>
              <RichTextEditor onChange={updateProfile("artistic_practice")} value={profile.artistic_practice} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="inspirations">
                Inspirations
              </label>
              <small className="mb-2 block">What has inspired you?</small>
              <RichTextEditor onChange={updateProfile("inspirations")} value={profile.inspirations} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="past_projects">
                Past projects
              </label>
              <small className="mb-2 block">Tell us about your past projects</small>
              <RichTextEditor onChange={updateProfile("past_projects")} value={profile.past_projects} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="short_introduction">
                Profile preview
              </label>
              <small className="mb-2 block">Write a short intro that will appear on your profile preview card</small>
              <input onChange={updateProfile("short_introduction")} value={profile.short_introduction} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="short_introduction" type="text" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                Tags
              </label>
              <div className="flex gap-2">
              {
                tags.map(tag => {
                  return (
                    <button key={tag.id} className="rounded-full border py-1 px-3 shadow text-sm bg-white">{tag.name}</button>
                  )
                })
              }
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="links">
                Links
              </label>
              <small className="mb-2 block">Add up to three links to your website, portfolio, or other socials</small>
              <input className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="links" type="text" />
              <input className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="links" type="text" />
              <input className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="links" type="text" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profile_picture">
                Profile picture
              </label>
              <input type="file" className="" id="profile_picture" />
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