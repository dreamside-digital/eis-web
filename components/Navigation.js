"use client"

import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation'
import NavigationDropdown from '@/components/NavigationDropdown'
import MobileDropdown from '@/components/MobileDropdown'
import AccountDropdown from '@/components/AccountDropdown'
import {useTranslations} from 'next-intl';
import { SessionProvider } from 'next-auth/react';
export default function Navigation({ logo, locale, dropdowns=[] }) {
  const pathname = usePathname();
  const t = useTranslations("shared_messages")

  return (
    <SessionProvider>
    <div className="absolute top-0 left-0 right-0 w-full text-dark z-10">
      <div className="container max-w-screen-xl mx-auto py-2 max-xl:px-4 flex justify-between">
        <Link href="/">
          <Image
            id="logo"
            className="max-h-20 md:max-h-[92px] w-auto object-fit pt-2"
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
            <AccountDropdown />
            <Link href={pathname.replace(locale, 'en')} locale="en" className={locale === 'en' ? 'hidden' : 'font-medium'}>EN</Link>
            <Link href={pathname.replace(locale, 'fr')} locale="fr" className={locale === 'fr' ? 'hidden' : 'font-medium'}>FR</Link>
          </div>
          <div className="md:hidden">
              <MobileDropdown pathname={pathname} dropdowns={dropdowns} locale={locale} />
          </div>
        </div>
      </div>
    </div>
    </SessionProvider>
  )
}
