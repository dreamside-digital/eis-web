"use client";
import { useSwiper } from 'swiper/react';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, ChevronLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const SwiperNextButton = () => {
  const swiper = useSwiper();
  const t = useTranslations('profile_form');
  return (
    <button 
      type="button"
      className="btn flex items-center gap-1"
      onClick={() => swiper.slideNext()}
    >
      {t('next_slide')}
      <ChevronRightIcon className="w-4 h-4" />
    </button>
  );
};

const SwiperPrevButton = () => {
  const swiper = useSwiper();
  const t = useTranslations('profile_form');
  return (
    <button 
      type="button"
      className="btn bg-transparent text-dark flex items-center gap-1"
      onClick={() => swiper.slidePrev()}
    >
      <ChevronLeftIcon className="w-4 h-4" />
      {t('previous_slide')}
    </button>
  );
};

export default function SlideContainer({ 
  title, 
  description, 
  children, 
  isFirstSlide, 
  isLastSlide,
  hideNavigation = false,
  handleSubmit
}) {
  const t = useTranslations('profile_form');
  return (
    <div className="p-8">
      <div className="mb-6">
        <label className="block text-3xl font-semibold mb-3 text-center">
          {title}
        </label>
        {description && (
          <p className="mb-6 block text-lg text-center italic">{description}</p>
        )}
        {children}
      </div>
      {!hideNavigation && (
        <div className={`flex mt-8 items-center w-full ${isFirstSlide ? 'justify-end' : 'justify-between'}`}>
          {!isFirstSlide && <SwiperPrevButton />}
          {!isLastSlide && <SwiperNextButton />}
          {isLastSlide && (
            <button 
                className="btn flex items-center gap-1" 
                onClick={handleSubmit}
            >
                {`See my Profile`}
                <ArrowRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}