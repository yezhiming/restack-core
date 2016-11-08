// core frameworks
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import i18n from './i18n';

import errorMessage from './reducers/errorMessage'
import modal from './reducers/modal'

export default class App {

  constructor(config) {
    this.config = config || {}
  }

  set routes(routes) {
    this._routes = routes
  }

  set reducers(reducers) {
    this._reducers = reducers
  }

  set middlewares(middlewares) {
    this._middlewares = middlewares
  }

  fetchLocalePromise(needsI18n, userLocale, defaultLocale) {
    if (needsI18n && userLocale != defaultLocale) {
      return i18n.fetchLocaleData(userLocale)
      .then( localeData => {
        return {locale: userLocale, localeData}
      } )
    } else {
      return Promise.resolve({locale: userLocale, localeData: {}})
    }
  }

  createRootComponent({locale, localeData}) {

    const reducers = {
      errorMessage,
      modal,
      ...this._reducers
    }

    const initialState = window.__INITIAL_STATE__ || {};
    const store = configureStore(reducers, initialState, this._middlewares)
    const history = syncHistoryWithStore(browserHistory, store)
    const i18nTools = new i18n.Tools({localeData, locale});

    return (
      <Provider store={store}>
        <i18n.Provider i18n={i18nTools}>
          <Router history={history} children={this._routes} />
        </i18n.Provider>
      </Provider>
    )
  }

  async render(el) {

    const { locales, defaultLocale } = this.config;

    const userLocale = i18n.getUserLocale(defaultLocale);

    const {locale, localeData} = await this.fetchLocalePromise(locales != null, userLocale, defaultLocale)

    const RootComponent = this.createRootComponent({locale, localeData})

    if (el) {
      ReactDOM.render(RootComponent, el);
      return Promise.resolve();
    } else {
      return Promise.resolve(RootComponent);
    }

  }
}
