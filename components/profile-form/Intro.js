import { useTranslations } from 'next-intl';
import DOMPurify from "isomorphic-dompurify";
import Image from 'next/image';
import { useEffect } from 'react';
import { useSwiper } from 'swiper/react';

export default function Intro({ prompts, locale }) {
  const t = useTranslations('profile_form');
  const cleanIntro = DOMPurify.sanitize(t.raw('profile_form_intro'), { USE_PROFILES: { html: true } })
  const swiper = useSwiper();

  useEffect(() => {
    swiper.updateAutoHeight(100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="oracle-text rounded-[50px] flex-col mx-4 md:mx-12 shadow-[0_0_15px_15px_#fff]">
            <Image src="/shapes/Shape_1.png" alt="Intro" width={200} height={200} />
            <div className="text-center my-4 wysiwyg-content" dangerouslySetInnerHTML={{ __html: cleanIntro }} />
        </div>
    </div>
  )
}