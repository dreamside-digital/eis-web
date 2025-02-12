"use client"

import Link from 'next/link'
import { useSearchParams } from "next/navigation";
import { useState } from 'react'
import { createUserAccount } from '@/lib/data-access'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import {useTranslations} from 'next-intl';

const formFields = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmedPassword: "",
    subscribe: true,
    language: "en"
  }

export default function LoginForm({locale}) {
  const [userData, setUserData] = useState(formFields)

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState()
  const searchParams = useSearchParams()
  const verification = searchParams.get('verification')
  const t = useTranslations('registration_form');

  const updateUserData = field => input => {
    setUserData({
      ...userData,
      [field]: input.target.value
    })
  }

  const updateSubscribe = e => {
    setUserData({
      ...userData,
      subscribe: e.target.checked
    })
  }

  const updateLanguage = e => {
    setUserData({
      ...userData,
      language: e.target.value
    })
  }

  const validateForm = async () => {
    setErrors([])
    const formErrors = []

    Object.keys(formFields).forEach(field => {
      if (userData[field].length < 1) {
        formErrors.push({message: `${field} is required.`})
      }
    })

    if (userData.password !== userData.confirmedPassword) {
      formErrors.push({message: "Please make sure your passwords match."})
    }

    if (formErrors.length > 0) {
      setErrors(formErrors)
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      validateForm()

      if (errors.length > 0) return

      const result = await createUserAccount(userData)

      if (result.status === 204) {
        setSuccess(true)
      } else {
        setErrors(result.errors)
      }
    } catch(err) {
      setErrors([err])
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <>
        <p className="text-xl mb-4 md:mb-6 font-medium">{t("success_title")}</p>
        <p>{t("success_message")}</p>
      </>
    )
  }
 
  return (
    <>
      { verification === "failed" &&
        <p>{t("verification_failed")}</p>
      }
      { (errors.length > 0) && 
        <div className="errors">
          { errors.map(error => <p key={error.message}>{error.message}</p>)}
        </div>
      }
      <form className="" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="first_name">
              {t("first_name")}
            </label>
            <input required onChange={updateUserData("first_name")} value={userData.first_name} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="first_name" type="text" />
          </div>

          <div className="">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="last_name">
              {t("last_name")}
            </label>
            <input required onChange={updateUserData("last_name")} value={userData.last_name} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="last_name" type="text" />
          </div>
       
          <div className=" col-span-2">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="email">
              {t("email")}
            </label>
            <input required onChange={updateUserData("email")} value={userData.email} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" />
          </div>

          <div className="">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
              {t("password")}
            </label>
            <input required onChange={updateUserData("password")} value={userData.password} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" />
          </div>

          <div className="">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="confirmed_password">
              {t("confirm_password")}
            </label>
            <input required onChange={updateUserData("confirmedPassword")} value={userData.confirmedPassword} className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirmed_password" type="password" />
          </div>

          <div className="max-sm:col-span-2">
            <fieldset>
            <legend className="block text-gray-700 text-sm font-medium flex items-center mb-1" htmlFor="language">
              {t("preferred_language")}
            </legend>
              <div className="inline-flex gap-6">
                <label className="block text-gray-700 text-sm flex items-center" htmlFor="en">
                  <input onChange={updateLanguage} className="mr-1 h-4 w-4" type="radio" id="en" value="en" checked={userData.language === "en"} name="language" />
                  {t("french")}
                </label>
                <label className="block text-gray-700 text-sm flex items-center" htmlFor="fr">
                  <input onChange={updateLanguage} className="mr-1 h-4 w-4" type="radio" id="fr" value="fr" checked={userData.language === "fr"} name="language" />
                  {t("english")}
                </label>
              </div>
            </fieldset>
          </div>

          <div className="max-sm:col-span-2">
            <label className="block text-gray-700 text-sm font-medium flex items-center" htmlFor="subscribe">
              <input required onChange={updateSubscribe} checked={userData.subscribe} className="mr-2 h-4 w-4" id="subscribe" type="checkbox" />
              {t("subscribe_to_mailing_list")}
            </label>
          </div>

        </div>

        <div className="flex items-center justify-between mt-6">
          {submitting && <div className="animate-spin"><ArrowPathIcon className="h-6 w-6 text-dark" /></div>}
          {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 focus:outline-none focus:shadow-outline" type="submit" value={t("join")} />}
        </div>
        <Link className="hover:underline pt-2 block text-sm" href={`/login`}>{t("have_an_account")}</Link>
      </form>
    </>
  )
}