
import { useTranslations } from 'next-intl';
import DOMPurify from "isomorphic-dompurify";
import Image from 'next/image';
import { useEffect } from 'react';
import { useSwiper } from 'swiper/react';
import { Typewriter } from 'react-simple-typewriter'
export default function Intro({ prompts, locale }) {

  const t = useTranslations('profile_form');
  const cleanIntro = DOMPurify.sanitize(t.raw('profile_form_intro'), { USE_PROFILES: { html: true } })
  const swiper = useSwiper();

  useEffect(() => {
    swiper.updateAutoHeight(100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/shapes/Shape_1.png" alt="Intro" width={200} height={200} />
        <h2 className="text-center my-4 font-title font-semibold text-2xl">
            <Typewriter
                words={[t('form_intro')]}
                loop={1}
                typeSpeed={50}
            />
        </h2>
        <div className="text-center my-4 wysiwyg-content font-title text-xl" dangerouslySetInnerHTML={{ __html: cleanIntro }} />
    </div>
  )
}