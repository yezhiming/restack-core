// core frameworks
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
// extention point below
import configureStore from '../store/configureStore'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import i18n from '../i18n'

export default class Root extends Component {

  static propTypes = {
    localeData: React.PropTypes.object.isRequired,
    locale: React.PropTypes.string.isRequired
  }

  static defaultProps = {
    localeData: {domain: "messages", locale_data: {messages: {}}}
  }

  render() {
    let { store, history, routes, reducers, localeData, locale } = this.props

    const initialState = window.__INITIAL_STATE__ || {};
    store = configureStore(reducers, initialState)
    history = syncHistoryWithStore(browserHistory, store)

    const i18nTools = new i18n.Tools({localeData, locale});

    /*if(process.env.BROWSER){
     window.l = i18nTools;
     }*/

    return (
      <Provider store={store}>
        <i18n.Provider i18n={i18nTools}>
          <Router history={history} children={routes} />
        </i18n.Provider>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object,
  routes: PropTypes.object.isRequired,
  reducers: PropTypes.object
}
