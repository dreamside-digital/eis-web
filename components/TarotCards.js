"use client"

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import TarotCard from './TarotCard';

export default function TarotCards({ prompts, locale }) {
    const [shuffledPrompts, setShuffledPrompts] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [flippedIndex, setFlippedIndex] = useState(null);

    useEffect(() => {
        shufflePrompts();
    }, [prompts]);

    const shufflePrompts = () => {
        const shuffled = [...prompts]
            .sort(() => Math.random() - 0.5);
        setShuffledPrompts(shuffled);
        setActiveIndex(0);
        setFlippedIndex(null);
    };

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
        setFlippedIndex(null);
    };

    const handleCardClick = (index) => {
        if (index === activeIndex) {
            setFlippedIndex(index);
        }
    };

    return (
        <>
          <Swiper
              effect={'cards'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              modules={[EffectCards]}
              className="tarot-cards w-64"
              onSlideChange={handleSlideChange}
          >
              {shuffledPrompts.map((prompt, index) => (
                  <SwiperSlide key={prompt.id} className="max-w-md">
                      <TarotCard 
                          prompt={prompt}
                          locale={locale}
                          isFlipped={index === flippedIndex}
                          onClick={() => handleCardClick(index)}
                      />
                  </SwiperSlide>
              ))}
          </Swiper>
        </>
    );
}