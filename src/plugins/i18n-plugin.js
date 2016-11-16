import React from 'react';

import Jed from 'jed';
import moment from 'moment';

function sprintf(text, ...params) {
    return Jed.sprintf(text, ...params);
}

class Tools {
    constructor({ localeData, locale }) {
        this.jed = new Jed(localeData);
        this.locale = locale;
    }

    l = (text, context) => {
        return context
            ? this.jed.pgettext(context, text)
            : this.jed.gettext(text);
    }

    nl = (singular, plural, amount, context) => {
        return context
            ? this.jed.npgettext(context, singular, plural, amount)
            : this.jed.ngettext(singular, plural, amount);
    }

    getLocale = () => {
        return this.locale.toLowerCase();
    }

    getTimeFromNow = (date) => {
        moment.locale(this.locale);

        return moment(date).fromNow();
    }

    humanizeDuration = (time, unit) => {
        moment.locale(this.locale);

        const duration = moment.duration(time, unit);

        const hours = duration.hours();
        const hoursString = hours ? sprintf(this.nl('%d hour', '%d hours', hours), hours) : '';

        const minutes = duration.minutes();
        const minutesString = minutes ? sprintf(this.nl('%d minute', '%d minutes', minutes), minutes) : '';

        return `${hoursString} ${minutesString}`;
    }
}

class Provider extends React.Component {
    static propTypes = {
        i18n     : React.PropTypes.object.isRequired,
        children : React.PropTypes.object.isRequired
    };

    static childContextTypes = { i18n: React.PropTypes.object };

    getChildContext() {
        return { i18n: this.props.i18n };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}


export default function i18n({universal = false, defaultLocale, getUserLocale, setUserLocale}) {

  let userLocale = defaultLocale;

  getUserLocale = getUserLocale || function() {
    return userLocale || defaultLocale;
  }

  setUserLocale = setUserLocale || function(locale) {
    userLocale = locale;
  }

  function fetchLocaleData(locale, defaultLocale) {

    if (locale != defaultLocale) {
      return fetch(`/static/lang/${locale}.json`).then(res => {
        if (res.status >= 400) {
          throw new Error('Bad response from server');
        }

        return {locale: locale, localeData: res.json()}
      });
    } else {
      return Promise.resolve({locale: locale, localeData: {}})
    }
  }

  return {

    name: "i18n",

    create: function(next, pre) {
      fetchLocaleData( getUserLocale(), defaultLocale ).then( ({locale, localeData}) => {
        console.log('[i18n-plugin.create] fetch locale data success')
        const tools = new Tools({locale, localeData})
        next((
          <Provider i18n={tools}>
            {pre}
          </Provider>
        ));
      })
    },

    render: function(next) {
      next();
    }
  }
}
