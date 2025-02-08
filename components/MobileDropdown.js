'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Link from "next/link";
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'
import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function MobileDropdown({pathname, locale, dropdowns}) {
  const { data: session, status } = useSession()
  const user = session?.user

  useEffect(() => {
    console.log({pathname})
  }, [pathname])

  return (
    <Popover className="">
      {({ open }) => (
        <>
        <PopoverButton className="inline-flex items-center gap-x-1">
          <span>{open ? <XMarkIcon className="h-6 w-6" /> : <Bars2Icon className="h-6 w-6" />}</span>
        </PopoverButton>

        <PopoverPanel
          transition
          className="absolute w-screen left-0 right-0 z-10 mt-2 flex px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="flex-auto overflow-hidden bg-white shadow-lg ring-1 ring-gray-900/5 pb-2">
            <div className="">
                {dropdowns.map(dropdown => {
                  return (
                    <div key={dropdown.dropdown_label}>
                      <p className="font-semibold mb-0 p-4 pb-2">{dropdown.dropdown_label}</p>
                        {dropdown.dropdown_items.map((item) => (
                          <div key={item.dropdown_item_link} className="group relative flex gap-x-6 p-2 pl-6 hover:bg-primary">
                            <div>
                              <a href={item.dropdown_item_link} className="">
                                {item.dropdown_item_text}
                                <span className="absolute inset-0" />
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )
                })}
                { user ? ( 
                  <div>
                    <p className="font-semibold uppercase mb-0 p-4 pb-2">{"Account"}</p>
                    <div className="group relative flex gap-x-6 p-2 pl-6 hover:bg-primary">
                      <PopoverButton as={Link} href={'/account'} className="">
                        {'My Account'}
                        <span className="absolute inset-0" />
                      </PopoverButton>
                    </div>
                    <div className="group relative flex gap-x-6 p-2 pl-6 hover:bg-primary">
                      <PopoverButton as={Link} href={'/logout'} className="">
                        {'Log out'}
                        <span className="absolute inset-0" />
                      </PopoverButton>
                    </div>
                  </div>
                ) : (
                  <PopoverButton as={Link} className="font-semibold uppercase mb-0 p-4 pb-2" href={'/login'}>Log in</PopoverButton>
                )}
              <div className="font-semibold uppercase mb-0 p-4 pb-2">
                <PopoverButton as={Link} href={pathname.replace(locale, 'en')} className={locale === 'en' ? 'hidden' : ''}>EN</PopoverButton>
                <PopoverButton as={Link} href={pathname.replace(locale, 'fr')} className={locale === 'fr' ? 'hidden' : ''}>FR</PopoverButton>
              </div>
            </div>
          </div>
        </PopoverPanel>
        </>
      )}
    </Popover>
  )
}