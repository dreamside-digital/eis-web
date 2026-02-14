import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import {getPageTranslations} from '@/lib/data-access'

 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 

  const data = await getPageTranslations()
  const tags = data?.tags || []
  const tagTranslations = tags.reduce((obj, tag) => {
    const translation = tag?.translations?.find(t => t.languages_code === locale)
    if (translation) {
      obj[tag.slug] = translation.name
    }
    return obj
  }, {})

  const getTranslation = (collection) => {
    return data?.[collection]?.translations?.find(t => t.languages_code === locale) || {}
  }

  return {
    locale,
    messages: {
      'registration_form': getTranslation('registration_form'),
      'profile_form': getTranslation('profile_form'),
      'event_form': getTranslation('event_form'),
      'artwork_form': getTranslation('artwork_form'),
      'account_page': getTranslation('account_page'),
      'tags': tagTranslations,
      'shared_messages': getTranslation('shared_messages'),
      'artbox_discover': getTranslation('artbox_discover')
    }
  };
});