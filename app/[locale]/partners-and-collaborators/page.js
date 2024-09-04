import { getCreditsContent } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";

export default async function CreditsPage({params: {locale}}) {
  const content = await getCreditsContent()
  const translation = content.translations.find(tr => tr.languages_code === locale)
  const pageContent = DOMPurify.sanitize(translation.body, { USE_PROFILES: { html: true } })

  return (
    <section className="bg-white text-dark relative">
      <div className="container bg-primary max-w-md sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl rounded-lg p-16 mx-auto my-8 lg:my-12">
        <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">Partners and Collaborators</h1>
        <div className="page-content wysiwyg-content" dangerouslySetInnerHTML={{ __html: pageContent }} />
      </div>
    </section>
  )
}