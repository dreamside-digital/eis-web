"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { generateProfilePreview } from '@/lib/openai';
import Loader from '@/components/Loader';
import { useSwiperSlide } from 'swiper/react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const MAX_CHARS = 255;

export default function Stage6({ profile, setProfile, tags }) {
  const t = useTranslations('profile_form');
  const [selectedTags, setSelectedTags] = useState(profile.tags || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    const preview = await generateProfilePreview(profile);
    if (preview) {
      setProfile({
        ...profile,
        short_introduction: preview
      });
    }
    setIsGenerating(false);
  };

  const updateTags = (tag, e) => {
    e.preventDefault()
    const tagIndex = profile.tags.findIndex(t => t.id === tag.id)
    if (tagIndex === -1) {
      setProfile({
        ...profile,
        tags: profile.tags.concat(tag)
      })
    } else {
      const newTags = [...profile.tags]
      newTags.splice(tagIndex,1)
      setProfile({
        ...profile,
        tags: newTags
      })
    }
  }

  const handlePreviewChange = (e) => {
    const text = e.target.value;
    if (text.length > MAX_CHARS) {
      setError("The maximum length of your profile preview is 255 characters");
    } else {
      setError('');
    }
    setProfile({
      ...profile,
      short_introduction: text
    });
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
          <div>
            <textarea
              value={profile.short_introduction || ''}
              onChange={handlePreviewChange}
              className={`shadow appearance-none border w-full h-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-lavendar text-xl ${error ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="text-sm text-gray-500">
                {profile.short_introduction?.length || 0}/{MAX_CHARS}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="font-semibold mb-4 block text-xl">{t('tags')}</label>
        <div className="flex flex-wrap gap-2">
        {
            tags.map(tag => {
                const selected = profile.tags.findIndex(t => t.id === tag.id)  
                return (
                <button key={tag.id} onClick={(e) => updateTags(tag, e)} className={`border py-1 px-3 shadow text-sm ${selected >= 0 ? 'bg-highlight text-white' : 'bg-white hover:bg-beige'}`}>{tag.name}</button>
                )
            })
        }
        </div>
      </div>
    </div>
  );
}