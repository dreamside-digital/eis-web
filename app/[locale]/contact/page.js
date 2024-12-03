import { getContactContent } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";

export default async function ContactPage({params: {locale}}) {
  const content = await getContactContent()
  console.log({content})
  const translation = content.translations.find(tr => tr.languages_code === locale)
  const col1Content = DOMPurify.sanitize(translation.column_1, { USE_PROFILES: { html: true } })
  const col2Content = DOMPurify.sanitize(translation.column_2, { USE_PROFILES: { html: true } })

  return (
    <section className="text-dark relative">
      <div className="container bg-primary max-w-md sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl p-16 mx-auto my-8 lg:my-12">
        <h1 className="uppercase text-3xl mb-4 md:mb-12 font-medium">{translation.page_title}</h1>
        <div className="grid grid-cols-2 gap-12">
          <div className="page-content wysiwyg-content" dangerouslySetInnerHTML={{ __html: col1Content }} />
          <div className="page-content wysiwyg-content" dangerouslySetInnerHTML={{ __html: col2Content }} />
        </div>
      </div>
    </section>
  )
}