import { getVisionContent } from '@/utils/directus'
import Image from 'next/image'
import DOMPurify from "isomorphic-dompurify";

export default async function WorkshopPage({params: {locale}}) {
  const content = await getVisionContent()
  const translation = content.translations.find(tr => tr.languages_code === locale)
  const para1 = DOMPurify.sanitize(translation.paragraph_1, { USE_PROFILES: { html: true } })
  const para2 = DOMPurify.sanitize(translation.paragraph_2, { USE_PROFILES: { html: true } })
  const para3 = DOMPurify.sanitize(translation.paragraph_3, { USE_PROFILES: { html: true } })
  const para4 = DOMPurify.sanitize(translation.paragraph_4, { USE_PROFILES: { html: true } })
  const para5 = DOMPurify.sanitize(translation.paragraph_5, { USE_PROFILES: { html: true } })
  const  { image_1, image_2, image_3, image_4, image_5 } = translation

  return (
    <section className="bg-light text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto py-12">
        <h1 className="font-title text-4xl md:text-6xl lg:text-7xl mb-6 md:mb-12">{translation.page_title}</h1>
        <div className="md:grid grid-cols-2 gap-x-24 gap-y-12">
          <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para1 }} />
          {image_1 && 
            <Image
              className="col-span-2 w-full"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image_1.id}`}
              width={image_1.width}
              height={image_1.height}
              alt={image_1.description}
            />}
          <div className="col-span-2 page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para2 }} />
          {image_2 && 
            <Image
              className="col-span-2 w-full"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image_2.id}`}
              width={image_2.width}
              height={image_2.height}
              alt={image_2.description}
            />}
          <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para3 }} />
          {image_3 && 
            <Image
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image_3.id}`}
              width={image_3.width}
              height={image_3.height}
              alt={image_3.description}
              className="w-[200px] h-[200px]"
            />}
          {image_4 && 
            <Image
              className="mt-12 md:mt-48 lg:mt-60 w-[200px] h-[200px]"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image_4.id}`}
              width={image_4.width}
              height={image_4.height}
              alt={image_4.description}
            />}
        </div>
        <div className="page-content wysiwyg-content max-w-prose max-md:my-6 my-12 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para4 }} />
        {image_5 && 
          <Image
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${image_5.id}`}
            width={image_5.width}
            height={image_5.height}
            alt={image_5.description}
            className="w-[200px] h-[200px]"
          />}
        <div className="page-content wysiwyg-content max-w-prose max-md:my-6 my-12 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para5 }} />
      </div>
    </section>
  )
}