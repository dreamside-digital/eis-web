import { useTranslations } from 'next-intl';
import DOMPurify from "isomorphic-dompurify";
import Image from 'next/image';

export default function Intro({ prompts, locale }) {
  const t = useTranslations('profile_form');
  const cleanIntro = DOMPurify.sanitize(t.raw('profile_form_intro'), { USE_PROFILES: { html: true } })

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/shapes/Shape_1.png" alt="Intro" width={200} height={200} />
        <div className="text-center my-4 wysiwyg-content" dangerouslySetInnerHTML={{ __html: cleanIntro }} />
    </div>
  )
}