"use client"


import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { userSession, currentUser, deleteSession } from '@/utils/auth'
import { useRouter, usePathname } from 'next/navigation'
import NavigationDropdown from '@/components/NavigationDropdown'
import MobileDropdown from '@/components/MobileDropdown'

export default function Navigation({ logo, locale, dropdowns }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(false)
  const router = useRouter()
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const session = await userSession()
      const authedUser = await currentUser(session.accessToken)
      return setUser(authedUser)
    })();
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleLogout = async() => {
    await deleteSession()
    toggleMenu()
    setUser(false)
    router.push('/')
  }
  
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
            <Link href={pathname.replace(locale, 'en')} className={locale === 'en' ? 'hidden' : ''}>EN</Link>
            <Link href={pathname.replace(locale, 'fr')} className={locale === 'fr' ? 'hidden' : ''}>FR</Link>
          </div>
          <div className="md:hidden">
            <MobileDropdown dropdowns={dropdowns} />
          </div>
        </div>
      </div>
    </div>
  )
}
