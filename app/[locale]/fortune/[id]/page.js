import { getTranslations } from 'next-intl/server';
import { getFortune } from '@/lib/data-access';
import Image from 'next/image';
import Link from 'next/link';

export default async function TarotPage({ params }) {
  const {locale, id} = await params;
  const t = await getTranslations('shared_messages');
  const fortune = await getFortune(id)

  return (
    <>
    <section className="text-dark p-6 py-12 pt-20 relative">
      <div className="bg-[url(/backdrops/Painting_2.png)] absolute top-0 left-0 h-full w-full">
      </div>
      <div className="container max-w-screen-lg mx-auto relative pt-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/shapes/Shape_1.png" alt="Intro" width={200} height={200} />
          </div>
          <div className="p-6 w-full text-dark text-center">
            <h1 className="uppercase text-4xl mb-4 font-medium font-title">{t('fortune_title')}</h1>
            <p className="text-xl">{t('fortune_subtitle')}</p>
          </div>
      </div>
    </section>
    <section className="text-dark relative">
      <div className="container max-w-screen-lg mx-auto px-6 my-8 md:my-12">
        <p className="text-xl leading-relaxed mb-6">{fortune.oracle_reading}</p>
        <div className="w-full flex justify-center">
          <Link href="/oracle" className="text-center text-dark font-title font-semibold text-2xl">
            {t('oracle_button')}
          </Link>
        </div>
      </div>
    </section>
    </>
  )
} 