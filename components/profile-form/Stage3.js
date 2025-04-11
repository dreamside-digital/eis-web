import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSwiper } from 'swiper/react';


export default function Stage3({ profile, updateProfileData, setProfile }) {
  const t = useTranslations('profile_form');
  const [visibleLinks, setVisibleLinks] = useState(1);
  const swiper = useSwiper();

  useEffect(() => {
    swiper.updateAutoHeight(100)
  }, [swiper, visibleLinks])

  const addNewLink = (e) => {
    e.preventDefault();
    if (visibleLinks < 3) {
      setVisibleLinks(prev => prev + 1);
    }
  };

  const removeLink = (indexToRemove) => {
    const newLinks = [...profile.links];
    newLinks.splice(indexToRemove, 1);
    setProfile({
      ...profile,
      links: newLinks
    });
    setVisibleLinks(prev => prev - 1);
  };

  const updateLinks = (index, field) => input => {
    const newLinks = [...profile.links]
    newLinks[index] = {...profile.links[index], [field]: input.target.value }

    setProfile({
      ...profile,
      links: newLinks
    })
  }

  return (
    <div className="space-y-4">
        <div>
            <label className="font-semibold block text-xl">{t('links')}</label>
            {t.has('links_hint') && <p className="my-2 block text-sm">{t('links_hint')}</p>}
        </div>
        {[...Array(visibleLinks)].map((_, index) => (
        <div key={index} className="space-y-2">
            <div className="flex gap-2">
            <div className="grid md:grid-cols-2 gap-2 flex-1">
                <input 
                onChange={updateLinks(index, 'url')} 
                value={profile.links[index]?.url || ''} 
                placeholder={t('url')} 
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl" 
                />
                <input 
                onChange={updateLinks(index, 'link_text')} 
                value={profile.links[index]?.link_text || ''} 
                placeholder={t('link')} 
                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl" 
                />
            </div>
            <button 
                onClick={() => removeLink(index)}
                type="button"
                disabled={index === 0}
                className={`text-gray-400 hover:text-red-500 ${index === 0 ? 'invisible' : ''}`}
                title={t('remove_link')}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            </div>
            {index === visibleLinks - 1 && visibleLinks < 3 && (
            <button 
                onClick={addNewLink}
                type="button"
                className="text-sm text-dark hover:text-highlight underline flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('add_another_link')}
            </button>
            )}
        </div>
        ))}
    </div>
    )
}