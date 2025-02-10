import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {getPageTranslations} from '@/lib/data-access'

 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

// Ensure that the incoming locale is valid
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const data = await getPageTranslations()
  const tags = data?.tags || []
  const tagTranslations = tags.reduce((obj, tag) => {
    const translation = tag.translations.find(t => t.languages_code === locale)
    obj[tag.slug] = translation.name
    return obj
  }, {})

  return {
    locale,
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