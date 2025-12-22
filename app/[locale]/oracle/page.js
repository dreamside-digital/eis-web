import { getTranslations } from 'next-intl/server';
import { sanitize } from '@/lib/sanitize';
import { getPrompts } from '@/lib/data-access';
import TarotContainer from '@/components/TarotContainer';

export default async function TarotPage({ params }) {
  const {locale} = await params;
  const t = await getTranslations('shared_messages');
  const description = sanitize(t.raw('tarot_description'))
  const prompts = await getPrompts()

  return (
    <section className="text-dark p-6 py-12 pt-20 relative min-h-screen">
      <div className="bg-[url(/backdrops/Painting_2.png)] absolute top-0 left-0 h-full w-full">
      </div>
      <div className="container max-w-screen-lg mx-auto relative pt-6">
        <div className="p-6 w-full text-dark text-center">
          <h1 className="uppercase text-4xl mb-4 md:mb-6 font-medium font-title">{t('tarot_title')}</h1>
          <div className="text-xl" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
      <div className="container max-w-screen-lg mx-auto flex flex-col justify-center items-center relative">
        <TarotContainer prompts={prompts} locale={locale} />
      </div>
    </section>
  )
} 