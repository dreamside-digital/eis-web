"use client";
import { useState, useEffect } from 'react';
import TarotCards from '@/components/TarotCards';
import { useTranslations } from 'next-intl';
import SlideContainer from './SlideContainer';
import { useSwiper } from 'swiper/react';
import Image from 'next/image';
import { Typewriter } from 'react-simple-typewriter'

export default function Stage4({ 
  prompts: initialPrompts, 
  locale,
  responses,
  setResponses
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [availablePrompts, setAvailablePrompts] = useState(initialPrompts);
  const [error, setError] = useState('');
  const t = useTranslations('profile_form');
  const swiper = useSwiper();

  useEffect(() => {
      swiper.updateAutoHeight(100);
  }, [selectedPrompt]);

  useEffect(() => {
    const usedCategories = responses.map(r => r.categoryId);
    const filteredPrompts = initialPrompts.filter(
      prompt => !usedCategories.includes(prompt.category.id)
    );
    setAvailablePrompts(filteredPrompts);
  }, [responses, initialPrompts]);

  const handleResponseSave = (e) => {
    e.preventDefault();
    const currentResponse = e.target.response.value;
    
    if (!currentResponse.trim()) {
      setError(t('response_required'));
      return;
    }
    
    setError(''); // Clear any existing error
    const category = selectedPrompt.category.translations.find(t => t.languages_code === locale) 
      || selectedPrompt.category.translations[0];

    setResponses(prev => [...prev, {
      promptId: selectedPrompt.id,
      promptText: selectedPrompt.translations.find(t => t.languages_code === locale)?.prompt || '',
      categoryId: selectedPrompt.category.id,
      categoryName: category.name,
      response: currentResponse.trim()
    }]);
    
    e.target.reset();
    setSelectedPrompt(null);
  };

  return (
    <div className="mt-6">
      <TarotCards 
        prompts={availablePrompts} 
        locale={locale} 
        setSelectedPrompt={setSelectedPrompt}
      />

      {selectedPrompt && (
        <div className="w-full my-8">
          <form onSubmit={handleResponseSave} className="space-y-4">
            <div>
              <textarea
                name="response"
                className={`shadow appearance-none border w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-lavendar text-xl ${error ? 'border-red-500' : ''}`}
                placeholder={t('write_your_response')}
                onChange={() => error && setError('')} // Clear error when user starts typing
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn"
              >
                {t('save_response')}
              </button>
            </div>
          </form>
        </div>
      )}

      {responses.length === 1 && !selectedPrompt &&(
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center my-4 text-lg">
            {`Draw another card...`}
          </p>
        </div>
      )}

      {responses.length === 2 && !selectedPrompt && (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center my-4 text-lg">
            {`Last one`}
          </p>
        </div>
      )}

      {availablePrompts.length === 0 && responses.length === 3 && (
        <div className="flex flex-col items-center justify-center gap-4">
            <Image src="/shapes/Icons-09.png" alt="Intro" width={200} height={200} />
            <div className="flex justify-center mb-6 font-title text-xl">
                <Typewriter
                    words={[t('tarot_cards_done')]}
                    loop={1}
                    typeSpeed={50}
                />
            </div>
        </div>
      )}
    </div>
  );
} 