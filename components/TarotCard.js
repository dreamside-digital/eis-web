"use client";
import Image from 'next/image';

const imageDict = {
  1: '/shapes/Icons-08.png', // moodboard
  2: '/shapes/Icons-10.png', // big think
  3: '/shapes/Icons-01.png', // process
}

const shapeDict = {
  1: '/shapes/pentagon.svg',  // lavender pentagon
  2: '/shapes/hexagon.svg',   // light blue hexagon
  3: '/shapes/blob.svg',      // green blob
}

export default function TarotCard({ prompt, locale, isFlipped, onClick }) {
  console.log({prompt})
  const translation = prompt.translations.find(t => t.languages_code === locale) || prompt.translations[0];
  const promptText = translation?.prompt || '';
  const category = prompt.category?.translations.find(t => t.languages_code === locale)?.name || '';
  const label = prompt.label?.translations.find(t => t.languages_code === locale)?.name || '';
  const imageSrc = imageDict[prompt.category.id];
  const shapeSrc = shapeDict[prompt.category.id];

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer perspective-1000 transition-transform duration-700 transform-style-preserve-3d relative w-64 h-96 ${isFlipped ? 'rotate-y-180' : ''}`}
    >
      {/* Front of card */}
      <div className={`absolute w-full h-full backface-hidden bg-white shadow-lg border border-gray-200 flex flex-col items-center justify-center ${isFlipped ? 'hidden' : ''}`}>
        <div className="text-md uppercase text-dark">{category}</div>
        <Image
          src={imageSrc}
          alt="Tarot card back"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Back of card */}
      <div className={`absolute w-full h-full backface-hidden bg-white shadow-lg p-6 rotate-y-180 ${isFlipped ? '' : 'hidden'}`}>
        <div className="h-full flex flex-col justify-between">
          <div className="relative">
            <Image
              src={shapeSrc}
              alt="Shape background"
              width={120}
              height={120}
              className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 rotate-[30deg]"
            />
            <div className="flex justify-between items-center gap-6">
              <div className="text-sm uppercase text-dark text-left pt-2 pr-4 relative z-10">{label}</div>
              <div className="text-lg text-dark text-right pt-2 pr-4 relative z-10">{prompt.id}</div>
            </div>
          </div>
          <div className="text-lg text-center font-medium my-4 uppercase text-dark">{promptText}</div>
        </div>
      </div>
    </div>
  );
} 