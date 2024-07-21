"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Image from "next/image";
import Link from "next/link";


export default function Navigation({ logo }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  
  return (
    <div className="bg-beige ">
      <nav className="container mx-auto pt-4 flex justify-between">
        <Link href="/">
          <Image
            id="logo"
            className="max-h-24 w-auto object-fit"
            src={logo}
            alt="Editions in Space logo"
            width={360}
            height={200}
            priority
          />
        </Link>
        <div className="flex gap-6 items-center justify-end relative">
          <button className="h-8 w-8 text-navy" onClick={toggleMenu}>
            { menuOpen ? <XMarkIcon /> :<Bars2Icon /> }
          </button>
          <div className={`menu ${menuOpen ? 'flex flex-col gap-2 absolute top-16 w-60 bg-white p-4 z-10' : 'hidden'}`}>
            <a href="#subscribe" onClick={toggleMenu} className="text-navy text-lg uppercase hover:text-aubergine">Join our artist network</a>
            <a href="https://www.instagram.com/editionsinspace/" onClick={toggleMenu} className="text-navy text-lg uppercase hover:text-aubergine">Instagram</a>
          </div>
        </div>
      </nav>
    </div>
  )
}
