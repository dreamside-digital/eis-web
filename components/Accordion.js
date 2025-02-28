"use client"

import Image from 'next/image'
import {Link} from '@/i18n/navigation';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { useState, useEffect } from "react"
import { DATE_FORMAT } from '@/utils/constants'
import TagButton from '@/components/TagButton'
import DOMPurify from "isomorphic-dompurify";

const CustomAccordionItem = ({ uuid, currentItemUid, title, children }) => {
  const selected = currentItemUid.includes(uuid)

  return(
    <AccordionItem uuid={uuid} className={`tab flex flex-col sm:flex-row ${selected ? "tab-selected flex-grow overflow-hidden sm:border-l border-white" : "bg-beige"}`} dangerouslySetExpanded={selected}>
      <AccordionItemHeading className={`bg-latte tab-heading flex sm:flex-grow relative px-5 py-3 sm:p-8 border-0 border-b sm:border-t-0 sm:border-l border-white ${selected ? "hidden" : ""}`}>
        <AccordionItemButton className={`tab-title sm:p-4 flex flex-grow rotate-tab-title ${selected ? "sm:hidden" : "block"}`}>
          <div className="text-xl flex items-center">
            <span>{title}</span>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="flex-grow fade-in overflow-auto border-b border-white">
        {children}
      </AccordionItemPanel>
    </AccordionItem>
  )
}

export default function ProfileDrawers({profiles, events}) {
  const [currentItemUid, setCurrentItemUid] = useState(profiles ? [profiles[0]?.id] : [events[0]?.id])

  const handleChange = uid => {
    console.log({ uid })
    if (uid !== currentItemUid) {
      setCurrentItemUid(uid)
    }
  }

  useEffect(() => {
    setCurrentItemUid(profiles ? [profiles[0]?.id] : [events[0]?.id] )
  }, [profiles, events])

  if (profiles) {
    return (
      <Accordion className="flex flex-col sm:flex-row flex-grow min-h-[70vh]" onChange={handleChange} preExpanded={[profiles[0]?.id]}>

        {profiles.map(profile => {
          const tagsText = profile.tags.map(t => t.name).join(", ")
          return (
            <CustomAccordionItem key={profile.id} uuid={profile.id} currentItemUid={currentItemUid} title={profile.public_name}>
            <Link className="no-underline hover:no-underline" href={`/profiles/${profile.slug}`}>
            <div className="max-w-lg h-full">
              <div className="h-full p-6 bg-beige text-dark relative">
                <h1 className="font-title text-xl md:text-2xl mb-4">
                  {profile.public_name}
                </h1>
                <p className="mb-4">{profile.pronouns}</p>
                <div className="">
                  {
                    profile.profile_picture &&
                    <Image
                      className="relative w-full h-auto aspect-video object-cover  mb-4"
                      src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${profile.profile_picture}`}
                      alt={profile.public_name} 
                      width={500}
                      height={500}
                    />
                  }
                  <div className="flex-1">
                    <p className="mb-4">{profile.short_introduction}</p>
                  </div>
                </div>
                <div className="inline-flex gap-1">
                  {profile.tags.map(t => <TagButton tag={t} key={t.id} />)}
                </div>
              </div>
            </div>
            </Link>
            </CustomAccordionItem>
        )})}
      </Accordion>
    )    
  }

  if (events) {
    return (
      <Accordion className="flex flex-col sm:flex-row flex-grow min-h-[70vh]" onChange={handleChange} preExpanded={[events[0]?.id]}>

        {events.map(event => {
            const tagsText = event.tags.map(t => t.name).join(", ")
            const startDate = new Date(event.starts_at)
            const startDateText = startDate.toLocaleString('en-CA', DATE_FORMAT)
            const endDate = new Date(event.ends_at)
            const endDateText = endDate.toLocaleString('en-CA', DATE_FORMAT)
            const locationText = [event.title, event.address].filter(i=>i).join(", ")
            const cleanDescription = DOMPurify.sanitize(event.description, { USE_PROFILES: { html: true } })

            return (
              <CustomAccordionItem key={event.id} uuid={event.id} currentItemUid={currentItemUid} title={event.title}>
                <Link className="no-underline hover:no-underline" href={`/events/${event.slug}`}>
                  <div className="p-6 bg-beige text-dark relative">
                    <h1 className="font-title text-xl md:text-2xl mb-4 text-center">
                      {event.title}
                    </h1>
                  <div className="">
                    {
                      (event.main_image) &&
                      <Image
                        className="relative w-full h-full object-cover  mb-4"
                        src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${event.main_image}`}
                        alt={"Event image"} 
                        width={500}
                        height={500}
                      />
                    }
                    <div className="flex-1 mb-4">
                      <p className="">{`Starts at: ${startDateText}`}</p>
                      <p className="">{`Ends at: ${endDateText}`}</p>
                      <p className="">{`Location: ${locationText || "TBA"}`}</p>
                      <p className="">{`Organizer: ${event.organizer}`}</p>
                      <p className="">{`Contact: ${event.contact}`}</p>
                    </div>
                    <div className="inline-flex gap-1">
                      {event.tags.map(t => <TagButton tag={t} key={t.id} />)}
                    </div>
                  </div>
                </div>
                </Link>
              </CustomAccordionItem>
            )
          })}
      </Accordion>
    )    
  }

}