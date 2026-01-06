import { getArtboxContent } from '@/lib/data-access'
import { sanitize } from '@/lib/sanitize';
import ImageWithCaption from '@/components/ImageWithCaption'

// Revalidate this page every 60 seconds to fetch fresh data from Directus
export const revalidate = 60

export default async function ArtboxPage({params}) {
  const {locale} = await params;
  const content = await getArtboxContent()

  // Find translation for current locale, fallback to English, then first available
  let translation = content.translations?.find(tr => tr.languages_code === locale)
  if (!translation) {
    translation = content.translations?.find(tr => tr.languages_code === 'en')
  }
  if (!translation) {
    translation = content.translations?.[0]
  }

  const intro1 = sanitize(translation?.Intro1 || '')
  const howItWorks = sanitize(translation?.How_it_Works || '')
  const table = sanitize(translation?.Table || '')
  const whatsIncluded = sanitize(translation?.Whats_Included || '')
  const ctaForArtists = sanitize(translation?.CTA_for_Artists || '')
  const ctaForSubscribers = sanitize(translation?.CTA_for_Subscribers || '')
  const joinUs = sanitize(translation?.Join_Us || '')

  const { Mission, Image_for_Artists, Image_for_Subscribers } = translation || {}

  return (
    <section className="bg-light text-dark p-6 py-12">
      <div className="container max-w-screen-xl mx-auto py-12">
        <h1 className="font-title text-4xl md:text-6xl lg:text-7xl mb-6 md:mb-12">Artbox</h1>

        <div className="">
          {/* Intro */}
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: intro1 }} />

          {/* Mission - Full Width Image */}
          {Mission && <ImageWithCaption image={Mission} className="w-full mb-12" />}

          {/* How it Works */}
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: howItWorks }} />

          {/* Table */}
          <div className="page-content wysiwyg-content max-md:my-6 text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: table }} />

          {/* What's Included */}
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: whatsIncluded }} />

          {/* CTA for Artists with Image */}
          <div className="md:grid grid-cols-3 gap-8 mb-12">
            {Image_for_Artists &&
              <div className="flex justify-center items-center">
                <ImageWithCaption image={Image_for_Artists} className="w-[200px] h-[200px]" />
              </div>
            }
            <div className="page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: ctaForArtists }} />
          </div>

          {/* CTA for Subscribers with Image */}
          <div className="md:grid grid-cols-3 gap-8 mb-12">
            {Image_for_Subscribers &&
              <div className="flex justify-center md:order-2 items-center">
                <ImageWithCaption image={Image_for_Subscribers} className="w-[200px] h-[200px]" />
              </div>
            }
            <div className="md:order-1 page-content wysiwyg-content max-w-prose col-span-2 max-md:my-6 text-xl xl:text-2xl" dangerouslySetInnerHTML={{ __html: ctaForSubscribers }} />
          </div>

          {/* Join Us */}
          <div className="page-content wysiwyg-content max-w-prose max-md:my-6 text-xl xl:text-2xl mb-12" dangerouslySetInnerHTML={{ __html: joinUs }} />
        </div>
      </div>
    </section>
  )
}
