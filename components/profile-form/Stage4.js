import { useTranslations } from 'next-intl';
import TarotContainer from '@/components/TarotContainer';
import SlideContainer from '@/components/profile-form/SlideContainer';
import { useState } from 'react';

export default function Stage4({ prompts, locale }) {
  return (
    <div className="pb-6">
        <TarotContainer 
            prompts={prompts}
            locale={locale}
            profileFlow={true}
        />
    </div>
  );
}