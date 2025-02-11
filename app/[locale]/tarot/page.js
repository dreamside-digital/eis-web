import { getTranslations } from 'next-intl/server';

export default async function TarotPage({ params: { locale } }) {
  const t = await getTranslations('tarot_page');

  return (
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/images/Explore_Culture_Vicinity_BG.png)] bg-no-repeat bg-cover absolute top-0 left-0 h-2/3 w-full">
      </div>
      <div className="container max-w-screen-lg mx-auto relative pt-6">
        <div className="p-6 w-full bg-beige text-dark">
          <h1 className="uppercase text-3xl mb-4 md:mb-6 font-medium">{t('page_title')}</h1>
          <p>{t('welcome_message')}</p>
        </div>
      </div>
    </section>
  )
} 