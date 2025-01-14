import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {getPageTranslations} from '@/utils/directus'

 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale)) notFound();

  const data = await getPageTranslations()
  const tags = data?.tags || []
  const tagTranslations = tags.reduce((obj, tag) => {
    const translation = tag.translations.find(t => t.languages_code === locale)
    obj[tag.slug] = translation.name
    return obj
  }, {})

  return {
    messages: {
      'registration_form': data?.registration_form?.translations?.find(t => t.languages_code === locale),
      'profile_form': data?.profile_form?.translations?.find(t => t.languages_code === locale),
      'event_form': data.event_form.translations.find(t => t.languages_code === locale),
      'account_page': data?.account_page?.translations?.find(t => t.languages_code === locale),
      'tags': tagTranslations,
      'shared_messages': data?.shared_messages?.translations?.find(t => t.languages_code === locale),
    }
  };
});