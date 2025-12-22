import { getCreditsContent } from '@/lib/data-access'
import { sanitize } from '@/lib/sanitize';

export default async function CreditsPage({params}) {
  const {locale} = await params;
  const content = await getCreditsContent()
  const translation = content.translations.find(tr => tr.languages_code === locale)
  const pageContent = sanitize(translation.body)

  return (
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/backdrops/Painting_1.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-[50vh] w-full" />
      <div className="container relative bg-beige max-w-md sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl p-16 mx-auto my-8 lg:my-12">
        <h1 className="uppercase text-3xl mb-4 md:mb-8 font-medium">Partners and Collaborators</h1>
        <div className="page-content wysiwyg-content" dangerouslySetInnerHTML={{ __html: pageContent }} />
      </div>
    </section>
  )
}