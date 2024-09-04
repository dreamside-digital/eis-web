"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { userSession, currentUser, deleteSession } from '@/utils/data-access'
import { useRouter, usePathname } from 'next/navigation'


export default function Navigation({ logo, locale }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(false)
  const router = useRouter()
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const session = await userSession();

      if (session.accessToken) {
        setUser(true)
      }
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
      <div className="container max-w-screen-xl mx-auto p-2 md:px-0 flex justify-between">
        <Link href="/">
          <Image
            id="logo"
            className="max-h-16 md:max-h-[92px] w-auto object-fit"
            src={logo}
            alt="Editions in Space logo"
            width={360}
            height={200}
            priority
          />
        </Link>
        <div className="flex gap-6 items-center justify-end relative">
          <div className="flex gap-2">
            <Link href={`/en`} className={locale === 'en' ? 'hidden' : ''}>EN</Link>
            <Link href={`/fr`} className={locale === 'fr' ? 'hidden' : ''}>FR</Link>
          </div>
          <button className="h-8 w-8 text-dark" onClick={toggleMenu}>
            { menuOpen ? <XMarkIcon /> :<Bars2Icon /> }
          </button>
          <div className={`menu ${menuOpen ? 'shadow flex flex-col divide-y absolute top-16 w-60 bg-white z-10' : 'hidden'}`}>
            <Link href={`/${locale}/profiles/new`} onClick={toggleMenu} className="px-4 py-2 text-dark text-lg uppercase hover:bg-lavendar">Join our artist network</Link>
            <Link href={`/${locale}/profiles`} onClick={toggleMenu} className="px-4 py-2 text-dark text-lg uppercase hover:bg-lavendar">Discover artists</Link>
            <Link href={`/${locale}/partners-and-collaborators`} onClick={toggleMenu} className="px-4 py-2 text-dark text-lg uppercase hover:bg-lavendar">Partners and Collaborators</Link>
            <a href="https://www.instagram.com/editionsinspace/" onClick={toggleMenu} className="px-4 py-2 text-dark text-lg uppercase hover:bg-lavendar">Follow us</a>
            {!user && <Link href={`/${locale}/login`} onClick={toggleMenu} className="px-4 py-2 text-dark text-lg uppercase hover:bg-lavendar">Login</Link>}
            {user && <button onClick={handleLogout} className="inline-flex px-4 py-2 text-dark text-lg uppercase hover:bg-lavendar">Logout</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
