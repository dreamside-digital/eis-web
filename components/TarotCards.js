"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

export default function TarotCards({prompts}) {
    const [prompt, setPrompt] = useState()

    return (
        <Swiper
          effect={'cards'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          modules={[EffectCards]}
          className="tarot-cards"
          onSlideChange={() => console.log('slide change')}
        >
          {prompts.map(prompt => {
            console.log({prompt})
            return (
              <SwiperSlide key={prompt.id} className=" max-w-md">
                <div className="aspect-[2/3] w-96 bg-white">
                    {prompt.id}
                </div>
              </SwiperSlide>
            )
          })}
          </Swiper>
      )        
    
}