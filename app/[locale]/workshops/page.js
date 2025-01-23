import { getWorkshopContent } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";
import ImageWithCaption from '@/components/ImageWithCaption'

export default async function WorkshopPage({params: {locale}}) {
  const content = await getWorkshopContent()
  const translation = content.translations.find(tr => tr.languages_code === locale)
  const para1 = DOMPurify.sanitize(translation.paragraph_1, { USE_PROFILES: { html: true } })
  const para2 = DOMPurify.sanitize(translation.paragraph_2, { USE_PROFILES: { html: true } })
  const para3 = DOMPurify.sanitize(translation.paragraph_3, { USE_PROFILES: { html: true } })
  const para4 = DOMPurify.sanitize(translation.paragraph_4, { USE_PROFILES: { html: true } })
  const  { image_1, image_2, image_3, image_4, image_5 } = translation

  return (
    <section className="bg-light text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto py-12">
        <h1 className="font-title text-4xl md:text-6xl lg:text-7xl mb-6 md:mb-12">{translation.page_title}</h1>
        <div className="md:grid grid-cols-2 gap-x-24 gap-y-12">
          <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para1 }} />
          <div className="col-span-2 w-full">
            <ImageWithCaption image={image_1} />
          </div>
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para2 }} />
          
          <div className="max-w-screen-lg w-full">
            <ImageWithCaption image={image_2} />
          </div>
          
          <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para3 }} />
          
          <div className="">
            <ImageWithCaption image={image_3} />
          </div>

          <div className="mt-12 md:mt-48 lg:mt-60">
            <ImageWithCaption image={image_4} />
          </div>
        </div>
        <div className="page-content wysiwyg-content max-w-prose max-md:my-6 my-12 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para4 }} />
        
        <div className="">
          <ImageWithCaption image={image_5} />
        </div>
      </div>
    </section>
  )
}