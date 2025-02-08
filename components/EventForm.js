"use client"

import Image from 'next/image'
import RichTextEditor from '@/components/RichTextEditor'
import MapWithMarker from '@/components/MapWithMarker'
import LocationSelector from '@/components/LocationSelector'
import { useState, useEffect } from 'react'
import { createEvent, uploadImage, userSession, currentUser } from '@/lib/data-access'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { geocodeAddress } from '@/services/mapbox'
import {useTranslations} from 'next-intl';


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

export default function EventForm({user, tags}) {
  const [event, setEvent] = useState(defaultEvent)
  const [fileUploading, setFileUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const [location, setLocation] = useState(null)
  const router = useRouter()
  const t = useTranslations('event_form');

  useEffect(() => {
    const getLocation = async(address) => {
      console.log({address})
      const coords = await geocodeAddress(address)
      console.log({coords})
      setLocation(coords)
    }

    if (event.address.length > 0) {
      getLocation(event.address)
    }

  }, [event.address])

  const handleLocationSelect = (feature) => {
    setLocation(feature.geometry)
  }

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
      location: location,
      status: "draft"
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
      <section className="text-dark p-6 py-12 pt-20 relative">
        <div className="bg-[url(/backdrops/Painting_3.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full" />    
        <div className="container relative bg-beige sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl p-8 lg:p-16 mx-auto my-0 md:my-8 lg:my-12">
          <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">{t('page_title')}</h1>
          <form className="" onSubmit={handleSubmit}>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="title">
                {t('title')}
              </label>
              {t.has('title_hint') &&  <small className="mb-2 block">{t('title_hint')}</small>}
              <input required onChange={updateEvent("title")} value={event.title} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="event_preview">
                {t('event_preview')}
              </label>
              {t.has('event_preview') && <small className="mb-2 block">{t('event_preview_hint')}</small>}
              <input required onChange={updateEvent("event_preview")} value={event.event_preview} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="event_preview" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="description">
                {t('description')}
              </label>
              {t.has('description_hint') && <small className="mb-2 block">{t('description_hint')}</small>}
              <RichTextEditor onChange={updateEvent("description")} value={event.description} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="starts_at">
                {t('starts_at')}
              </label>
              {t.has('starts_at_hint') && <small className="mb-2 block">{t('starts_at_hint')}</small>}
              <input required onChange={updateEvent("starts_at")} value={event.starts_at} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="starts_at" type="datetime-local" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="ends_at">
                {t('ends_at')}
              </label>
              {t.has('ends_at_hint') && <small className="mb-2 block">{t('ends_at_hint')}</small>}
              <input required onChange={updateEvent("ends_at")} value={event.ends_at} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ends_at" type="datetime-local" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="venue">
                {t('venue')}
              </label>
              {t.has('venue_hint') && <small className="mb-2 block">{t('venue_hint')}</small>}
              <input onChange={updateEvent("venue")} value={event.venue} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="venue" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="address">
                {t('address')}
              </label>
              {t.has('address_hint') && <small className="mb-2 block">{t('address_hint')}</small>}
              <LocationSelector handleSelect={handleLocationSelect} />
            </div>

            {location && 
              <div className="mb-6">
                <MapWithMarker markerLocation={location} />
              </div>
            }

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="organizer">
                {t('organizer')}
              </label>
              {t.has('organizer_hint') && <small className="mb-2 block">{t('organizer_hint')}</small>}
              <input required onChange={updateEvent("organizer")} value={event.organizer} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="organizer" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="contact">
                {t('contact')}
              </label>
              {t.has('contact_hint') && <small className="mb-2 block">{t('contact_hint')}</small>}
              <input required onChange={updateEvent("contact")} value={event.contact} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="contact" type="text" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold" htmlFor="instructions">
                {t('instructions')}
              </label>
              {t.has('instructions_hint') && <small className="mb-2 block">{t('instructions_hint')}</small>}
              <RichTextEditor  onChange={updateEvent("instructions")} value={event.instructions} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                {t('tags')}
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
                {t('links')}
              </label>
              {t.has('links_hint') && <small className="mb-2 block">{t('links_hint')}</small>}
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(0, 'link_text')} value={event.links[0] ? event.links[0].link_text : ""} placeholder={t('link')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.text" type="text" />
                <input onChange={updateLinks(0, 'url')} value={event.links[0] ? event.links[0].url : ""} placeholder={t('url')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link1.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(1, 'link_text')} value={event.links[1] ? event.links[1].link_text : ""} placeholder={t('link')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.text" type="text" />
                <input onChange={updateLinks(1, 'url')} value={event.links[1] ? event.links[1].url : ""} placeholder={t('url')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link2.url" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input onChange={updateLinks(2, 'link_text')} value={event.links[2] ? event.links[2].link_text : ""} placeholder={t('link')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link3.text" type="text" />
                <input onChange={updateLinks(2, 'url')} value={event.links[2] ? event.links[2].url : ""} placeholder={t('url')} className="mb-2 shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="link3.url" type="text" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="main_image">
                {t('main_image')}
              </label>
              {t.has('main_image_hint') && <small className="mb-2 block">{t('main_image_hint')}</small>}
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
              {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" value={t('submit')} />}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}