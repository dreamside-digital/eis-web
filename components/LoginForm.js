"use client"

import Image from 'next/image'
import { useState } from 'react'
import { createSession } from '@/utils/data-access'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon } from '@heroicons/react/24/solid'


export default function LoginForm({tags}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState()
  const router = useRouter()

  const updateUsername = input => {
    setUsername(input.target.value)
  }

  const updatePassword = input => {
    setPassword(input.target.value)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSubmitting(true)

    const { session, errors } = await createSession(username, password)
    if (errors) {
      console.log(errors)
      setSubmitting(false)
      setErrors(errors)
    } else {
      console.log(session)
      router.push('/profiles/new')
    }
  }
 
  return (
    <>
      <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">Login</h1>
      { errors && 
        <div className="errors">
          { errors.map(error => <p key={error.message}>{error.message}</p>)}
        </div>
      }
      <form className="" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold" htmlFor="public_name">
            Email
          </label>
          <input required onChange={updateUsername} value={username} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="public_name" type="text" />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold" htmlFor="pronouns">
            Password
          </label>
          <input required onChange={updatePassword} value={password} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="pronouns" type="password" />
        </div>

        <div className="flex items-center justify-between mt-8">
          {submitting && <div className="animate-spin"><ArrowPathIcon className="h-6 w-6 text-dark" /></div>}
          {!submitting && <input className="bg-dark hover:bg-highlight text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:shadow-outline" type="submit" />}
          <a className="hover:underline" href="https://app.editionsinspace.com/admin/register">Create your account</a>
        </div>
      </form>
    </>
  )
}