import { getTranslations } from 'next-intl/server';
import DOMPurify from "isomorphic-dompurify";
import { getPrompts } from '@/lib/data-access';
import TarotCards from '@/components/TarotCards';

export default async function TarotPage({ params: { locale } }) {
  const t = await getTranslations('shared_messages');
  const description = DOMPurify.sanitize(t.raw('tarot_description'), { USE_PROFILES: { html: true } })
  const prompts = await getPrompts()

  return (
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/backdrops/Painting_2.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-full w-full">
      </div>
      <div className="container max-w-screen-lg mx-auto relative pt-6">
        <div className="p-6 w-full bg-beige text-dark">
          <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium font-title">{t('tarot_title')}</h1>
          <div className="" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
      <div className="container max-w-screen-lg mx-auto flex justify-center items-center relative">
        <TarotCards prompts={prompts} />
      </div>
    </section>
  )
} 