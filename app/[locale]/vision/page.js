import { getVisionContent } from '@/lib/data-access'
import DOMPurify from "isomorphic-dompurify";
import ImageWithCaption from '@/components/ImageWithCaption'

export default async function VisionPage({params: {locale}}) {
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
        <div className="">
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: para1 }} />
          {image_1 && <ImageWithCaption image={image_1} />}
          <div className="page-content wysiwyg-content max-w-prose text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: para2 }} />
          {image_2 && <ImageWithCaption image={image_2} />}
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 pb-12">
            <h2 className="!text-2xl md:!text-4xl">{translation.section_2_title}</h2>
          </div>
          <div className="md:grid grid-cols-3 mb-12">
            {image_3 && <ImageWithCaption image={image_3} className="w-[200px] h-[200px]" />}
            <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para3 }} />
          </div>
          <div className="md:grid grid-cols-3 mb-12">
          {image_4 && 
            <div className="flex justify-center md:order-2 items-center">
              <ImageWithCaption image={image_4} className="w-[200px] h-[200px]" />
            </div>
          }
          <div className="md:order-1 page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para4 }} />
        </div>
        <div className="md:grid grid-cols-3 mb-12">
          {image_5 && 
            <div className="flex justify-center items-center">
              <ImageWithCaption image={image_5} className="w-[200px] h-[200px]" />
            </div>
          }
          <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 my-12 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: para5 }} />
        </div>
        </div>
      </div>
    </section>
  )
}