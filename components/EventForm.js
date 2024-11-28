"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import MapPointSelector from '@/components/MapPointSelector'
import { useState, useEffect } from 'react'
import { createEvent, uploadImage, userSession, currentUser } from '@/lib/data-access'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

const defaultEvent = {
  status: "draft",
  title: "",
  description: "",
  starts_at: "",
  ends_at: "",
  organizer: "",
  contact: "",
  venue: "",
  address: "",
  instructions: "",
  tags: [],
  links: [{link_text: "", url: ""}, {link_text: "", url: ""}, {link_text: "", url: ""}],
}

export default function EventForm({user, tags, messages, locale}) {
  const [event, setEvent] = useState(defaultEvent)
  const [fileUploading, setFileUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const router = useRouter()

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
      main_image: event.main_image?.id,
    }
    const result = await createEvent(data)
    if (result.errors) {
      setErrors(result.errors)
      setSubmitting(false)
    } else {
      const eventLink = `/events/${result.slug}`
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
        main_image: result
      })
      setFileUploading(false)
    } else {
      setEvent({
        ...event,
        main_image: null
      })
    }
  }

 
  return (
    <>
      <section className="text-dark relative">
        <div className="container bg-primary sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl p-8 lg:p-16 mx-auto my-0 md:my-8 lg:my-12">
          <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">{messages.page_title}</h1>
          <form className="" onSubmit={handleSubmit}>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="title">
                {messages.title}
              </label>
              <small className="mb-2 block">{messages.title_hint}</small>
              <input required onChange={updateEvent("title")} value={event.title} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="event_preview">
                {messages.event_preview}
              </label>
              <small className="mb-2 block">{messages.event_preview_hint}</small>
              <input required onChange={updateEvent("event_preview")} value={event.event_preview} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="event_preview" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="description">
                {messages.description}
              </label>
              <small className="mb-2 block">{messages.description_hint}</small>
              <RichTextEditor onChange={updateEvent("description")} value={event.description} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="starts_at">
                {messages.starts_at}
              </label>
              <small className="mb-2 block">{messages.starts_at_hint}</small>
              <input required onChange={updateEvent("starts_at")} value={event.starts_at} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="starts_at" type="datetime-local" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="ends_at">
                {messages.ends_at}
              </label>
              <small className="mb-2 block">{messages.ends_at_hint}</small>
              <input required onChange={updateEvent("ends_at")} value={event.ends_at} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ends_at" type="datetime-local" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="venue">
                {messages.venue}
              </label>
              <small className="mb-2 block">{messages.venue_hint}</small>
              <input onChange={updateEvent("venue")} value={event.venue} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="venue" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="address">
                {messages.address}
              </label>
              <small className="mb-2 block">{messages.address_hint}</small>
              <input required onChange={updateEvent("address")} value={event.address} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="address" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="organizer">
                {messages.organizer}
              </label>
              <small className="mb-2 block">{messages.organizer_hint}</small>
              <input required onChange={updateEvent("organizer")} value={event.organizer} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="organizer" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="contact">
                {messages.contact}
              </label>
              <small className="mb-2 block">{messages.contact_hint}</small>
              <input required onChange={updateEvent("contact")} value={event.contact} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="contact" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="instructions">
                {messages.instructions}
              </label>
              <small className="mb-2 block">{messages.instructions_hint}</small>
              <RichTextEditor  onChange={updateEvent("instructions")} value={event.instructions} />
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
                    <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`border py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-beige'}`}>{tag.name}</button>
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
                <input onChange={updateLinks(0, 'link_text')} value={event.links[0].link_text} placeholder={messages.link} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(0, 'url')} value={event.links[0].url} placeholder={messages.url} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(1, 'link_text')} value={event.links[1].link_text} placeholder={messages.link} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.text" type="text" />
                <input onChange={updateLinks(1, 'url')} value={event.links[1].url} placeholder={messages.url} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(2, 'link_text')} value={event.links[2].link_text} placeholder={messages.link} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link3.text" type="text" />
                <input onChange={updateLinks(2, 'url')} value={event.links[2].url} placeholder={messages.url} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link3.url" type="text" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="main_image">
                {messages.main_image}
              </label>
              <input onChange={handleFileChange} type="file" className="" id="main_image" />
              {
                fileUploading && 
                <div className="mt-2 w-48 h-48 bg-white animate-pulse" />
              }
              {
                event.main_image && 
                <div className="mt-2">
                  <Image
                    className="w-48 max-w-48 aspect-square relative w-full h-auto object-cover bg-white"
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.main_image.id}`}
                    alt={event.main_image.description || event.title} 
                    width={event.main_image.width}
                    height={event.main_image.height}
                  />
                </div>
              }
            </div>

            <div className="flex items-center justify-between mt-8">
              {submitting && <div className="animate-spin"><ArrowPathIcon className="h-6 w-6 text-dark" /></div>}
              {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" value={messages.submit} />}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}