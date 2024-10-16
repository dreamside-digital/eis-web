"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import MapPointSelector from '@/components/MapPointSelector'
import { useState, useEffect } from 'react'
import { createEvent, uploadImage } from '@/utils/directus'
import { userSession, currentUser } from '@/utils/data-access'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

const defaultEvent = {
  status: "draft",
  event_type: "individual",
  email_address: "",
  public_name: "",
  short_introduction: "",
  pronouns: "",
  current_projects: "",
  artistic_practice: "",
  inspirations: "",
  past_projects: "",
  tags: [],
  links: [{link_text: "", url: ""}, {link_text: "", url: ""}, {link_text: "", url: ""}],
  location: ""
}

export default function EventForm({tags, messages, locale}) {
  const [event, setEvent] = useState(defaultProfile)
  const [fileUploading, setFileUploading] = useState(false)
  const [location, setLocation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPostalCodeField, setShowPostalCodeField] = useState(false)
  const [errors, setErrors] = useState()
  const [user, setUser] = useState()
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const session = await userSession();

      if (session.accessToken) {
        const authedUser = await currentUser(session.accessToken)
        return setUser(authedUser)
      }
    })();
  }, []);

  const updateEvent = field => input => {

    setEvent({
      ...event,
      [field]: typeof(input) === "string" ? input : input.target?.value
    })
  }

  const updateTags = (tag, e) => {
    e.preventDefault()
    const tagIndex = event.tags.findIndex(t => t.tags_id === tag.id)
    if (tagIndex === -1) {
      setEvent({
        ...event,
        tags: event.tags.concat({ tags_id: tag.id })
      })
    } else {
      const newTags = [...event.tags]
      newTags.splice(tagIndex,1)
      setEvent({
        ...event,
        tags: newTags
      })
    }
  }

  const updateLinks = (index, field) => input => {
    const newLinks = [...event.links]
    newLinks[index] = {...event.links[index], [field]: input.target.value }
    setEvent({
      ...event,
      links: newLinks
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSubmitting(true)

    // filter out empty links
    const links = event.links.filter(l => (l.url.length > 0))

    const data = {
      ...event,
      user_created: user?.id,
      links: JSON.stringify(links),
      event_picture: event.event_picture?.id,
      location: location,
    }
    console.log({data})
    const result = await createEvent(data)
    if (result.errors) {
      setErrors(result.errors)
      setSubmitting(false)
    } else {
      const eventLink = `/${locale}/events/${result.slug}`
      router.push(eventLink)
    }
    setSubmitting(false)
  }

  const handleFileChange = async(e) => {

    if (e.target.files[0]) {
      setFileUploading(true)
      const formData = new FormData()
      formData.append('file', e.target.files[0], e.target?.files[0]?.name)
      const result = await uploadImage(formData)
      setEvent({
        ...event,
        event_picture: result
      })
      setFileUploading(false)
    } else {
      setEvent({
        ...event,
        event_picture: null
      })
    }
  }

  const revealPostalCodeField = (e) => {
    e.preventDefault()
    setShowPostalCodeField(true)
  }

 
  return (
    <>
      <section className="bg-white text-dark relative">
        <div className="container bg-primary sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl sm:rounded-lg p-8 lg:p-16 mx-auto my-0 md:my-8 lg:my-12">
          <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">{messages.title}</h1>
          <form className="" onSubmit={handleSubmit}>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="email_address">
                {messages.email}
              </label>
              <small className="mb-2 block">{messages.email_hint}</small>
              <input disabled={!!user} onChange={updateEvent("email_address")} value={user ? user.email : event.email_address} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email_address" type="email" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="public_name">
                {messages.public_name}
              </label>
              <small className="mb-2 block">{messages.public_name_hint}</small>
              <input required onChange={updateEvent("public_name")} value={event.public_name} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="public_name" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="pronouns">
                {messages.pronouns}
              </label>
              <small className="mb-2 block">{messages.pronouns_hint}</small>
              <input onChange={updateEvent("pronouns")} value={event.pronouns} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pronouns" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="current_projects">
                {messages.current_project}
              </label>
              <small className="mb-2 block">{messages.current_project_hint}</small>
              <RichTextEditor required onChange={updateEvent("current_projects")} value={event.current_projects} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="artistic_practice">
                {messages.artistic_practice}
              </label>
              <small className="mb-2 block">{messages.artistic_practice_hint}</small>
              <RichTextEditor required onChange={updateEvent("artistic_practice")} value={event.artistic_practice} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="inspirations">
                {messages.inspirations}
              </label>
              <small className="mb-2 block">{messages.inspirations_hint}</small>
              <RichTextEditor onChange={updateEvent("inspirations")} value={event.inspirations} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="past_projects">
                {messages.past_projects}
              </label>
              <small className="mb-2 block">{messages.past_projects_hint}</small>
              <RichTextEditor onChange={updateEvent("introduction")} value={event.introduction} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="short_introduction">
                {messages.event_preview}
              </label>
              <small className="mb-2 block">{messages.event_preview_hint}</small>
              <input required maxLength={500} onChange={updateEvent("short_introduction")} value={event.short_introduction} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="short_introduction" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                {messages.tags}
              </label>
              <div className="flex flex-wrap gap-2">
              {
                tags.map(tag => {
                  const selected = event.tags.findIndex(t => t.tags_id === tag.id)
                  return (
                    <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`rounded-full border py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-light'}`}>{tag.name}</button>
                  )
                })
              }
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {messages.links}
              </label>
              <small className="mb-2 block">{messages.links_hint}</small>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(0, 'link_text')} value={event.links[0].link_text} placeholder={messages.link} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(0, 'url')} value={event.links[0].url} placeholder={messages.url} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(1, 'link_text')} value={event.links[1].link_text} placeholder={messages.link} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.text" type="text" />
                <input onChange={updateLinks(1, 'url')} value={event.links[1].url} placeholder={messages.url} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(2, 'link_text')} value={event.links[2].link_text} placeholder={messages.link} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(2, 'url')} value={event.links[2].url} placeholder={messages.url} className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="event_picture">
                {messages.event_picture}
              </label>
              <input onChange={handleFileChange} type="file" className="" id="event_picture" />
              {
                fileUploading && 
                <div className="mt-2 w-48 h-48 bg-white animate-pulse" />
              }
              {
                event.event_picture && 
                <div className="mt-2">
                  <Image
                    className="w-48 aspect-square relative w-full h-auto object-cover bg-white"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.event_picture.id}`}
                    alt={event.event_picture.description || event.public_name} 
                    width={event.event_picture.width}
                    height={event.event_picture.height}
                  />
                </div>
              }
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                {messages.location}
              </label>
              <small className="mb-2 block">{messages.location_hint}</small>
              <MapPointSelector setLocation={setLocation} selectedLocation={location} />
            </div>

            <div className="mb-6">
              <button hidden={showPostalCodeField} className="text-sm underline" onClick={revealPostalCodeField}>I do not feel comfortable disclosing my location on a map</button>
              <div hidden={!showPostalCodeField}>
                <label className="block text-gray-700 text-sm font-bold" htmlFor="postal_code">
                  {messages.postal_code}
                </label>
                <small className="mb-2 block">{messages.postal_code_hint}</small>
                <input required onChange={updateEvent("postal_code")} value={event.postal_code} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="postal_code" type="text" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              {submitting && <div className="animate-spin"><ArrowPathIcon className="h-6 w-6 text-dark" /></div>}
              {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="submit" value={messages.submit} />}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}