import Image from "next/image";
import Link from "next/link";
import VideoModal from '@/components/VideoModal'
import { PlayCircleIcon } from '@heroicons/react/24/solid'
import { getHomePageContent, getFeatures } from '@/lib/data-access'
import RegistrationForm from "@/components/RegistrationForm"
import DOMPurify from "isomorphic-dompurify";


export default async function Home({ params: { locale } }) {
  const content = await getHomePageContent()
  const {translations} = content
  const translation = translations.find(t => t.languages_code === locale)
  const keyFeatures = await getFeatures(translation?.key_features.map(f=>f.features_id))
  const benefits = await getFeatures(translation?.benefits.map(f=>f.features_id))
  const cleanKeyFeaturesSubtitle = DOMPurify.sanitize(translation?.key_features_section_subtitle, { USE_PROFILES: { html: true } })

  const landingBgUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${content.landing_section_background_image.id}`
  const benefitsBgUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${content.benefits_section_background_image.id}`

  const landingBgStyle = {
    backgroundImage: `url(${landingBgUrl})`
  }

  const benefitsBgStyle = {
    backgroundImage: `url(${benefitsBgUrl})`
  }

  return (
    <>
      <section style={landingBgStyle} className={`pt-28 bg-beige md:h-[80vh] bg-no-repeat bg-cover bg-[left_15%_center] md:bg-center md:bg-contain`}>
        <div className="container max-w-screen-xl mx-auto px-4 py-12 lg:py-20 flex flex-col md:flex-row gap-8 lg:gap-12 h-full items-center">
          <div className="flex-1">
            <h2 className="font-title text-center text-3xl md:text-5xl text-dark">
              <div>{translation?.landing_section_title_line_1}</div>
              <div>{translation?.landing_section_title_line_2}</div></h2>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative md:translate-y-12">
              <Image
                className="md:h-[75vh] w-auto object-fit"
                src="/images/phone-mockup-2.png"
                alt="GIF of website"
                width={444}
                height={884}
                priority
              />
              <VideoModal />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark text-light">
        <div className="container max-w-screen-xl mx-auto px-4 py-12 lg:py-20">
          <h2 className="uppercase text-3xl font-medium mb-8">
            {translation?.vision_section_title}
          </h2>
          <div className="md:flex gap-12 lg:gap-16">
            <div className="flex-1">
              <p className="text-xl md:text-2xl mb-6">
                {translation?.vision_section_subtitle}
              </p>
            </div>
            <div className="flex-1">
              <p className="">
                {translation?.vision_section_body}
              </p>
            </div>
          </div>
        </div>
        
      </section>

      <section className="bg-white text-dark">
        <div className="container max-w-screen-xl mx-auto px-4 py-12 lg:py-20">
          <div className="font-title text-center text-3xl md:text-4xl max-w-[16ch] mx-auto mb-12" dangerouslySetInnerHTML={{ __html: cleanKeyFeaturesSubtitle }} />
          <div className="relative max-w-3xl mx-auto">
            <Image
              className="w-full h-auto"
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${content.laptop_mockup_image}`}
              alt="laptop"
              width={1800}
              height={1043}
            />
          </div>

        
          <div className="mt-12">
            <h2 className="uppercase text-3xl mb-12 text-center font-medium">
              {translation?.key_features_section_title}
            </h2>
            <ul className="md:flex gap-12 lg:gap-16">
              {
                keyFeatures.map(feature => {
                  const imgUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${feature.image}`
                  const translatedFeature = feature.translations.find(t => t.languages_code === locale)
                  const url = translatedFeature?.link

                  return (
                    <li key={feature.id} className="flex-1 flex flex-col items-center mb-16">
                      { url ? (
                        <Link href={url} className="cursor-pointer hover:underline underline-offset-1">
                          <span className="block uppercase text-xl text-center mb-4">{translatedFeature?.title}</span>
                          <Image
                            className="relative"
                            src={imgUrl}
                            alt=""
                            width={180}
                            height={180}
                          />
                        </Link>
                      ) : (
                        <>
                          <p className="uppercase text-xl text-center mb-4">
                            {translatedFeature?.title}
                          </p>
                          <Image
                            className="relative"
                            src={imgUrl}
                            alt=""
                            width={180}
                            height={180}
                          />
                        </>
                      )}
                    </li>
                  )
                })
              }

            </ul>
          </div>
        </div>
      </section>

      <section id="subscribe" className="bg-white text-dark">
        <div className="container max-w-screen-xl mx-auto sm:px-4 sm:pb-12 md:pb-24">
          <div className="bg-primary p-4 py-12 md:p-16 container max-w-screen-xl mx-auto">
            <h2 className="uppercase text-3xl mb-4 md:mb-8 font-medium">
              {translation?.join_section_title}
            </h2>
            <div className="md:flex gap-12 lg:gap-20">
              <div className="flex-1">
                <div className="" dangerouslySetInnerHTML={{ __html: `${translation?.join_section_body}` }} />
              </div>
              <div className="flex-1">
                <RegistrationForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige text-dark">
        <div className="container max-w-screen-xl mx-auto px-4 py-12 lg:py-20">
          <h2 className="font-title text-3xl lg:text-4xl mb-6 md:mb-10">
            {translation?.origin_section_title}
          </h2>
          <div className="md:grid grid-cols-3 gap-12">
            <div className="mb-6">
              <div>
                <Image
                  className="relative w-full aspect-square object-cover max-w-[500px]"
                  src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${content.origin_section_author_image.id}`}
                  alt={translation?.origin_section_author_name}
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <div className="col-span-2 xl:p-8">
              <p className="text-xl lg:text-2xl mb-8 lg:leading-relaxed">
                {translation?.origin_section_body}
              </p>
              <div>
                <p className="font-title text-2xl lg:text-3xl text-right mb-2">{translation?.origin_section_author_name}</p>
                <p className="text-right">{translation?.origin_section_author_title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={benefitsBgStyle} className="bg-white bg-no-repeat bg-cover md:bg-center">
        <div className="container max-w-screen-xl mx-auto px-4 py-12 lg:py-20 text-dark">
            <h2 className="font-title text-center text-3xl lg:text-4xl max-w-sm mx-auto mb-12 md:mb-20">
              {translation?.benefits_section_title}
            </h2>
            <ul className="flex flex-col md:flex-row gap-12 lg:gap-20">
                {
                  benefits.map(feature => {
                    const imgUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${feature.image}`
                    const translatedFeature = feature.translations.find(t => t.languages_code === locale)

                    return (
                      <li className="flex-1 flex flex-col items-center" key={feature.id}>
                        <Image
                          className="h-[180px] w-[180px]"
                          src={imgUrl}
                          alt="benefit icon"
                          width={180}
                          height={180}
                        />
                        <p className="text-lg mt-4 text-center">
                          {translatedFeature?.description}
                        </p>
                      </li>
                    )
                  })
                }
            </ul>
        </div>
      </section>

    </>
  );
}
