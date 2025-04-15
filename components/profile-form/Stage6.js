"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { generateProfilePreview } from '@/lib/openai';
import Loader from '@/components/Loader';
import { useSwiperSlide } from 'swiper/react';
import { SparklesIcon } from '@heroicons/react/24/outline';


export default function Stage6({ profile, setProfile, tags }) {
  const t = useTranslations('profile_form');
  const [selectedTags, setSelectedTags] = useState(profile.tags || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const swiperSlide = useSwiperSlide();

  useEffect(() => {
    setProfile({
      ...profile,
      tags: selectedTags
    })
  }, [selectedTags]);

  useEffect(() => {
    if (swiperSlide.isActive && !profile.short_introduction) {
      generatePreview();
    }
  }, [swiperSlide.isActive]);

  const generatePreview = async () => {
    if (!profile.introduction && !profile.artistic_practice && !profile.current_projects) {
      return;
    }
    
    setIsGenerating(true);
    console.log('generating preview');
    const preview = await generateProfilePreview(profile);
    if (preview) {
      setProfile({
        ...profile,
        short_introduction: preview
      });
    }
    setIsGenerating(false);
  };

  const handleTagClick = (tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="font-semibold text-xl">{t('profile_preview')}</label>
          <button 
            onClick={generatePreview}
            className="btn bg-white text-dark text-sm flex items-center gap-2"
            disabled={isGenerating}
          >
            <SparklesIcon className="w-5 h-5" />
            {t('regenerate')}
          </button>
        </div>
        {isGenerating ? (
          <div className="flex justify-center py-4">
            <Loader className="w-8 h-8" />
          </div>
        ) : (
          <textarea
            value={profile.short_introduction || ''}
            onChange={(e) => setProfile({
              ...profile,
              short_introduction: e.target.value
            })}
            className="shadow appearance-none border w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-lavendar text-xl"
          />
        )}
      </div>

      <div>
        <label className="font-semibold mb-4 block text-xl">{t('tags')}</label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedTags.some(t => t.id === tag.id)
                  ? 'bg-lavendar text-white'
                  : 'bg-white text-dark hover:bg-gray-100'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}