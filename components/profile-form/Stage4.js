import { useTranslations } from 'next-intl';
import TarotContainer from '@/components/TarotContainer';

export default function Stage4({ prompts, locale }) {
  const t = useTranslations('profile_form');

  return (
    <TarotContainer prompts={prompts} locale={locale} profileFlow={true} />
  )
}