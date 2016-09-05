import Provider from './Provider';
import Tools    from './Tools';
import fetch    from 'isomorphic-fetch';
import cookie   from 'cookie';

function setLocale(locale) {
  // trigger fetchLocale() ?
}

function fetchLocaleData({defaultLocale}) {

  const locale = cookie.parse(document.cookie).locale || defaultLocale;

  if(locale === defaultLocale) {
    // No need to load as UI already in default locale
    return Promise.resolve({locale: locale, localeData: {}});
  }

  // format like this :
  // "": { "domain": "messages", "lang": "" }
  return fetch(`/lang/${localeToLoad}.json`).then(res => {
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    return {locale: locale, localeData: res.json()};
  });
}

export default {
  Provider,
  Tools,
  setLocale,
  fetchLocaleData
};
