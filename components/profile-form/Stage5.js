import { useTranslations } from 'next-intl';
import { useState } from 'react';
import TarotContainer from '@/components/TarotContainer';
import TarotCards from '@/components/TarotCards';
import RichTextEditor from '@/components/RichTextEditor';
import { useEffect } from 'react';

const contextQuestions = [
    {
      id: 1,
      category: {
        id: '1',
        translations: [
          {
            languages_code: "en",
            name: "Bio"
          },
          {
            languages_code: "fr",
            name: "Bio"
          }
        ]
      },
      translations: [
        {
          languages_code: "en",
          prompt: "Describe your artistic practice"
        },
        {
          languages_code: "fr",
          prompt: "Describe your artistic practice"
        }
      ]
    },
    {
      id: 2,
      category: {
        id: '2',
        translations: [
          {
            languages_code: "en",
            name: "Current Project"
          },
          {
            languages_code: "fr",
            name: "Current Project"
          }
        ]
      },
      translations: [
        {
          languages_code: "en",
          prompt: "What are you working on now?"
        },
        {
          languages_code: "fr",
          prompt: "What are you working on now?"
        }
      ]
    },
    {
      id: 3,
      category: {
        id: '3',
        translations: [
          {
            languages_code: "en",
            name: "Past Projects"
          },
          {
            languages_code: "fr",
            name: "Past Projects"
          }
        ]
      },
      translations: [
        {
          languages_code: "en",
          prompt: "Tell us about your past projects"
        },
        {
          languages_code: "fr",
          prompt: "Tell us about your past projects"
        }
      ]
    }
  ]

export default function Stage5({ locale, profile, updateProfileData }) {
  const t = useTranslations('profile_form');
  const [selectedContextQuestion, setSelectedContextQuestion] = useState(null);
  return (
    <div>
          <TarotCards prompts={contextQuestions} locale={locale} setSelectedPrompt={setSelectedContextQuestion} />
          <div className={`${selectedContextQuestion ? 'min-h-[300px]' : ''}`}>
            <div className={`my-6 ${selectedContextQuestion?.id === 1 ? '' : 'hidden'}`}>
                <RichTextEditor onChange={updateProfileData("artistic_practice")} value={profile.artistic_practice} />
                <small className="my-2 block">{t('max_words')}</small>
                </div>

            <div className={`my-6 ${selectedContextQuestion?.id === 2 ? '' : 'hidden'}`}>
                <RichTextEditor onChange={updateProfileData("current_projects")} value={profile.current_projects} />
                <small className="my-2 block">{t('max_words')}</small>
                </div>

            <div className={`my-6 ${selectedContextQuestion?.id === 3 ? '' : 'hidden'}`}>
                <RichTextEditor onChange={updateProfileData("introduction")} value={profile.introduction} />
                <small className="my-2 block">{t('max_words')}</small>
            </div>
        </div>
    </div>
  )
}