"use client"

import { useState, useRef, useCallback } from 'react'
import { createNewsletterSubscriber } from '@/lib/data-access'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import { Turnstile } from 'react-turnstile'

const formFields = {
  first_name: "",
  last_name: "",
  email: "",
  language: "en",
  _hp: "",
}

export default function NewsletterSignupForm({ locale }) {
  const [formData, setFormData] = useState(formFields)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const loadedAt = useRef(Date.now())
  const t = useTranslations('registration_form')

  // Newsletter-specific success messages
  const successMessages = {
    en: {
      title: "Thank you for subscribing!",
      message: "You'll have the arts in your inbox soon!"
    },
    fr: {
      title: "Merci de vous être abonné!",
      message: "Vous recevrez bientôt les arts dans votre boîte de réception!"
    }
  }

  const updateFormData = field => input => {
    setFormData({
      ...formData,
      [field]: input.target.value
    })
  }

  const updateLanguage = e => {
    setFormData({
      ...formData,
      language: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors([])

    // Basic validation
    const validationErrors = []

    if (!formData.first_name.trim()) {
      validationErrors.push({ message: "First name is required." })
    }
    if (!formData.last_name.trim()) {
      validationErrors.push({ message: "Last name is required." })
    }
    if (!formData.email.trim()) {
      validationErrors.push({ message: "Email is required." })
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setSubmitting(false)
      return
    }

    try {
      const result = await createNewsletterSubscriber({
        ...formData,
        _hp: formData._hp,
        _t: loadedAt.current,
        turnstileToken,
      })

      if (result.success) {
        setSuccess(true)
        setFormData(formFields) // Reset form
      } else {
        setErrors(result.errors || [{ message: "An error occurred. Please try again." }])
      }
    } catch (err) {
      setErrors([{ message: "An error occurred. Please try again." }])
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    const messages = successMessages[locale] || successMessages.en
    return (
      <>
        <p className="text-xl mb-4 md:mb-6 font-medium">{messages.title}</p>
        <p>{messages.message}</p>
      </>
    )
  }

  return (
    <>
      {errors.length > 0 && (
        <div className="errors mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
      <form className="" onSubmit={handleSubmit}>
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            value={formData._hp}
            onChange={updateFormData("_hp")}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="first_name">
              {t("first_name")}
            </label>
            <input
              required
              onChange={updateFormData("first_name")}
              value={formData.first_name}
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="first_name"
              type="text"
            />
          </div>

          <div className="">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="last_name">
              {t("last_name")}
            </label>
            <input
              required
              onChange={updateFormData("last_name")}
              value={formData.last_name}
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="last_name"
              type="text"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-medium" htmlFor="email">
              {t("email")}
            </label>
            <input
              required
              onChange={updateFormData("email")}
              value={formData.email}
              className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
            />
          </div>

          <div className="max-sm:col-span-2">
            <fieldset>
              <legend className="block text-gray-700 text-sm font-medium mb-1">
                {t("preferred_language")}
              </legend>
              <div className="inline-flex gap-6">
                <label className="block text-gray-700 text-sm flex items-center" htmlFor="en">
                  <input
                    onChange={updateLanguage}
                    className="mr-1 h-4 w-4"
                    type="radio"
                    id="en"
                    value="en"
                    checked={formData.language === "en"}
                    name="language"
                  />
                  {t("english")}
                </label>
                <label className="block text-gray-700 text-sm flex items-center" htmlFor="fr">
                  <input
                    onChange={updateLanguage}
                    className="mr-1 h-4 w-4"
                    type="radio"
                    id="fr"
                    value="fr"
                    checked={formData.language === "fr"}
                    name="language"
                  />
                  {t("french")}
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-6">
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onVerify={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          {submitting && (
            <div className="animate-spin">
              <ArrowPathIcon className="h-6 w-6 text-dark" />
            </div>
          )}
          {!submitting && (
            <input
              className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer"
              type="submit"
              value={t("join")}
            />
          )}
        </div>
      </form>
    </>
  )
}
