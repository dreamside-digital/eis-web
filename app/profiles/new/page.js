import { getProfile, getTags, createProfile } from '@/utils/directus'
import Image from 'next/image'
import ProfileForm from '@/components/ProfileForm'

export default async function NewProfilePage({params}) {
  const tags = await getTags()

  return (
    <ProfileForm tags={tags} createProfile={createProfile} />
  )
}