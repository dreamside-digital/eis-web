"use client"

import Link from "next/link";
import {useTranslations} from 'next-intl';
import { useSession } from "next-auth/react"
import NavigationDropdown from '@/components/NavigationDropdown'

export default function AccountDropdown() {
  const t = useTranslations("shared_messages")
  const { data: session } = useSession()

  if (session?.error) {
    return <Link className="uppercase font-medium" href={'/login'}>{t('login')}</Link>
  }

  if (session?.user) {
    return (
        <NavigationDropdown dropdown={{
          dropdown_label: t('account'),
          dropdown_items: [
            {dropdown_item_text: t('my_account'), dropdown_item_link: "/account"},
            {dropdown_item_text: t('logout'), dropdown_item_link: "/logout"}
          ]
        }}/>
    )
  }

  return <Link className="uppercase font-medium" href={'/login'}>{t('login')}</Link>
}
