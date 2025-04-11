"use client";
import Image from 'next/image';
import { useSwiper, useSwiperSlide } from 'swiper/react';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, ChevronLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const SwiperNextButton = ({ disabled, validate }) => {
  const swiper = useSwiper();
  const t = useTranslations('profile_form');

  const handleClick = () => {
    if (validate) {
        validate() && swiper.slideNext()
    } else {
        swiper.slideNext()
    }
  }

  return (
    <button 
      type="button"
      className={`btn flex items-center gap-1 ${disabled ? 'bg-grey hover:bg-grey cursor-not-allowed' : ''}`}
      onClick={handleClick}
      disabled={disabled}
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
  disableNext = false,
  handleSubmit,
  validate
}) {
  const t = useTranslations('profile_form');
  const swiperSlide = useSwiperSlide();
  const isActive = swiperSlide.isActive;

  return (
    <div className={`p-8 ${isActive ? 'appear' : ''}`}>
      <div className="mb-6">
        <label className="block text-3xl font-semibold mb-3 text-center">
          {title}
        </label>
        {description && (
            <div className="flex justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-white rounded-xl shadow-[0_0_10px_10px_#fff] p-2 mt-4 mb-8">
                    <Image src="/shapes/Shape_1.png" alt="Intro" width={40} height={50} />
                    <p className="mb-0 block text-lg text-center font-title italic">{description}</p>
                </div>
            </div>
        )}
        {children}
      </div>
        <div className={`flex mt-8 items-center w-full ${isFirstSlide ? 'justify-end' : 'justify-between'}`}>
          {!isFirstSlide && <SwiperPrevButton />}
          {!isLastSlide && <SwiperNextButton disabled={disableNext} validate={validate} />}
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
    </div>
  );
}