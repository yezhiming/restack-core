import Provider from './Provider';
import Tools    from './Tools';
import fetch    from 'isomorphic-fetch';

function getUserLocale(defaultLocale) {
  return sessionStorage['locale'] || defaultLocale;
}

function fetchLocaleData(locale) {

  // format like this :
  // "": { "domain": "messages", "lang": "" }
  return fetch(`/lang/${locale}.json`).then(res => {
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    return res.json();
  });
}

export default {
  Provider,
  Tools,
  getUserLocale,
  fetchLocaleData
};
