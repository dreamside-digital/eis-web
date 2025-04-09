import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import TarotContainer from '@/components/TarotContainer';
import TarotCards from '@/components/TarotCards';
import RichTextEditor from '@/components/RichTextEditor';
import { useEffect } from 'react';
import { useSwiper } from 'swiper/react';

export default function Stage5({ locale, profile, updateProfileData }) {
  const t = useTranslations('profile_form');
  const [selectedContextQuestion, setSelectedContextQuestion] = useState(null);
  const swiper = useSwiper();

  const contextQuestions = useMemo(() => {
    return [
        {
          id: 1,
          category: {
            id: '1',
            translations: [
              {
                languages_code: locale,
                name: t('artistic_practice')
              }
            ]
          },
          translations: [
            {
              languages_code: locale,
              prompt: t('artistic_practice_hint')
            }
          ]
        },
        {
          id: 2,
          category: {
            id: '2',
            translations: [
              {
                languages_code: locale,
                name: t('current_project')
              }
            ]
          },
          translations: [
            {
              languages_code: locale,
              prompt: t('current_project_hint')
            }
          ]
        },
        {
          id: 3,
          category: {
            id: '3',
            translations: [
              {
                languages_code: locale,
                name: t('past_projects')
              }
            ]
          },
          translations: [
            {
              languages_code: locale,
              prompt: t('past_projects_hint')
            }
          ]
        }
      ]
  }, [t]);

  const handleEditorChange = (field) => (value) => {
    updateProfileData(field)(value);
    setSelectedContextQuestion(null);
  }

  useEffect(() => {
    swiper.updateAutoHeight(100);
  }, [selectedContextQuestion]);

  return (
    <div>
          <TarotCards prompts={contextQuestions} locale={locale} setSelectedPrompt={setSelectedContextQuestion} />
          <div className={`${selectedContextQuestion ? 'min-h-[300px]' : ''}`}>
            <div className={`my-6 ${selectedContextQuestion?.id === 1 ? '' : 'hidden'}`}>
                <RichTextEditor 
                    onSave={handleEditorChange("artistic_practice")} 
                    initialValue={profile.artistic_practice} 
                    onRender={() => swiper.updateAutoHeight(100)} 
                    hintText={t('max_words')}
                />
                </div>

            <div className={`my-6 ${selectedContextQuestion?.id === 2 ? '' : 'hidden'}`}>
                <RichTextEditor 
                    onSave={handleEditorChange("current_projects")} 
                    initialValue={profile.current_projects} 
                    onRender={() => swiper.updateAutoHeight(100)} 
                    hintText={t('max_words')}
                />
                </div>

            <div className={`my-6 ${selectedContextQuestion?.id === 3 ? '' : 'hidden'}`}>
                <RichTextEditor 
                    onSave={handleEditorChange("introduction")} 
                    initialValue={profile.introduction} 
                    onRender={() => swiper.updateAutoHeight(100)} 
                    hintText={t('max_words')}
                />
            </div>
        </div>
    </div>
  )
}