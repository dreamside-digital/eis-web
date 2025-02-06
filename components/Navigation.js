"use client"

import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation'
import NavigationDropdown from '@/components/NavigationDropdown'
import MobileDropdown from '@/components/MobileDropdown'
import {useTranslations} from 'next-intl';
import { useSession } from "next-auth/react"

export default function Navigation({ session, logo, locale, dropdowns=[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname();
  const t = useTranslations("shared_messages")

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
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
            { session?.user ? ( 
              <NavigationDropdown dropdown={{
                dropdown_label: t('account'),
                dropdown_items: [
                  {dropdown_item_text: t('my_account'), dropdown_item_link: "/account"},
                  {dropdown_item_text: t('logout'), dropdown_item_link: "/logout"}
                ]
              }}/>
            ) : (
              <Link className="uppercase font-medium" href={'/login'}>{t('login')}</Link>
            )}
            <Link href={pathname.replace(locale, 'en')} locale="en" className={locale === 'en' ? 'hidden' : 'font-medium'}>EN</Link>
            <Link href={pathname.replace(locale, 'fr')} locale="fr" className={locale === 'fr' ? 'hidden' : 'font-medium'}>FR</Link>
          </div>
          <div className="md:hidden">
            <MobileDropdown pathname={pathname} dropdowns={dropdowns} user={session?.user} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
