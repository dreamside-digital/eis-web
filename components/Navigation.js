"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { userSession, currentUser, deleteSession } from '@/utils/data-access'
import { useRouter, usePathname } from 'next/navigation'


export default function Navigation({ logo }) {
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
          <button className="h-8 w-8 text-dark" onClick={toggleMenu}>
            { menuOpen ? <XMarkIcon /> :<Bars2Icon /> }
          </button>
          <div className={`menu ${menuOpen ? 'flex flex-col gap-2 absolute top-16 w-60 bg-white p-4 z-10' : 'hidden'}`}>
            {/*<Link href="/profiles" onClick={toggleMenu} className="text-dark text-lg uppercase">Discover artists</Link>*/}
            {/*<Link href="/events" onClick={toggleMenu} className="text-dark text-lg uppercase">Discover events</Link>*/}
            {!user && <Link href="/login" onClick={toggleMenu} className="text-dark text-lg uppercase">Login</Link>}
            {user && <button onClick={handleLogout} className="inline-flex text-dark text-lg uppercase">Logout</button>}
            <a href="#subscribe" onClick={toggleMenu} className="text-dark text-lg uppercase">Join our artist network</a>
            <a href="https://www.instagram.com/editionsinspace/" onClick={toggleMenu} className="text-dark text-lg uppercase">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  )
}
