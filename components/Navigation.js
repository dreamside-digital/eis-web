"use client"

import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'


export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  
  return (
    <div className="bg-beige ">
      <nav className="container mx-auto p-6 flex justify-between">
        <div><h1 className="font-title text-navy text-2xl max-w-sm">éditions in space</h1></div>
        <div className="flex gap-6 items-center justify-end relative">
          <button className="h-8 w-8 text-navy" onClick={toggleMenu}>
            { menuOpen ? <XMarkIcon /> :<Bars2Icon /> }
          </button>
          <div className={`menu ${menuOpen ? 'flex flex-col gap-2 absolute top-10 w-60 bg-white p-4 z-10' : 'hidden'}`}>
            <a href="#subscribe" onClick={toggleMenu} className="text-navy text-lg uppercase hover:text-aubergine">Join our artist network</a>
            <a href="https://www.instagram.com" onClick={toggleMenu} className="text-navy text-lg uppercase hover:text-aubergine">Instagram</a>
          </div>
        </div>
      </nav>
    </div>
  )
}
