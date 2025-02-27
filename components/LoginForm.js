"use client"

import Image from 'next/image'
import {Link} from '@/i18n/navigation';
import { useSearchParams } from "next/navigation";
import { useState } from 'react'
import {useRouter} from '@/i18n/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import {useTranslations} from 'next-intl';
import { signIn } from "next-auth/react"


export default function LoginForm({locale}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState()
  const router = useRouter()
  const searchParams = useSearchParams()
  const verification = searchParams.get('verification')
  const t = useTranslations('shared_messages');

  const updateUsername = input => {
    setUsername(input.target.value)
  }

  const updatePassword = input => {
    setPassword(input.target.value)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSubmitting(true)

    const res = await signIn("credentials", {
      email: username,
      password: password,
      callbackUrl: `/`,
      redirect: false,
    })

    if (res?.error) {
      setError(res?.error)
      setSubmitting(false)
    } else {
      router.push("/account")
    }
  }
 
  return (
    <>
      <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">{t("login")}</h1>
      { verification === "success" &&
        <p>{t("email_verification_success")}</p>
      }
      { error && 
        <div className="errors">
          <p>{error}</p>
        </div>
      }
      <form className="" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold" htmlFor="email">
            {t("email")}
          </label>
          <input required onChange={updateUsername} value={username} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold" htmlFor="password">
            {t("password")}
          </label>
          <input required onChange={updatePassword} value={password} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" />
        </div>

        <div className="flex items-center justify-between mt-6">
          {submitting && <div className="animate-spin"><ArrowPathIcon className="h-6 w-6 text-dark" /></div>}
          {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" value={t("login")} />}
          <Link className="hover:underline" href={`/register`}>{t("create_account")}</Link>
        </div>
      </form>
    </>
  )
}