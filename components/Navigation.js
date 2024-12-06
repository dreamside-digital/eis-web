"use client"

import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { userSession, currentUser, deleteSession } from '@/lib/data-access'
import { useRouter, usePathname } from 'next/navigation'
import NavigationDropdown from '@/components/NavigationDropdown'
import MobileDropdown from '@/components/MobileDropdown'

export default function Navigation({ logo, locale, dropdowns }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(false)
  const router = useRouter()
  const pathname = usePathname();

  console.log({logo})

  useEffect(() => {
    (async () => {
      const session = await userSession()
      const authedUser = await currentUser(session)
      return setUser(authedUser)
    })();
  }, [pathname]);

  
  return (
    <div className="absolute top-0 left-0 right-0 w-full text-dark z-10">
      <div className="container max-w-screen-xl mx-auto py-2 max-xl:px-4 flex justify-between">
        <Link href="/">
          <Image
            id="logo"
            className="max-h-16 md:max-h-[92px] w-auto object-fit pt-2"
            src={logo}
            alt="Editions in Space logo"
            width={360}
            height={200}
            priority
          />
        </Link>
        <div className="flex gap-6 items-center justify-end">
          <div className="gap-4 hidden md:flex">
            {dropdowns.map(dropdown => {
              return <NavigationDropdown key={dropdown.dropdown_label} dropdown={dropdown}/>
            })}
            { user ? ( 
              <NavigationDropdown dropdown={{
                dropdown_label: "Account",
                dropdown_items: [
                  {dropdown_item_text: "My Account", dropdown_item_link: "/account"},
                  {dropdown_item_text: "Log out", dropdown_item_link: "/logout"}
                ]
              }}/>
            ) : (
              <Link className="uppercase font-medium" href={'/login'}>Log in</Link>
            )}
            <Link href={pathname.replace(locale, 'en')} className={locale === 'en' ? 'hidden' : 'font-medium'}>EN</Link>
            <Link href={pathname.replace(locale, 'fr')} className={locale === 'fr' ? 'hidden' : 'font-medium'}>FR</Link>
          </div>
          <div className="md:hidden">
            <MobileDropdown pathname={pathname} dropdowns={dropdowns} user={user} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
