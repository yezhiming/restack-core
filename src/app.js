// core frameworks
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import i18n from './i18n';

export default class App {

  constructor(config) {
    this.config = config
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

  run() {

    const { locales, defaultLocale } = this.config;

    const userLocale = i18n.getUserLocale(defaultLocale);

    if (locales && userLocale != defaultLocale) {

      i18n.fetchLocaleData(userLocale)
      .then( localeData => {
        this.render({userLocale, localeData})
      } )
      .catch(error => {
        console.error(error);
      })
    } else {
      this.render({locale: userLocale, localeData: {}})
    }
  }

  render({locale, localeData}) {

    const initialState = window.__INITIAL_STATE__ || {};
    const store = configureStore(this._reducers, initialState)
    const history = syncHistoryWithStore(browserHistory, store)
    const i18nTools = new i18n.Tools({localeData, locale});

    ReactDOM.render(
      <Provider store={store}>
        <i18n.Provider i18n={i18nTools}>
          <Router history={history} children={this._routes} />
        </i18n.Provider>
      </Provider>,

      document.getElementById('react-view')
    );
  }

}
