// core frameworks
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux'
import { Provider } from 'react-redux';

import _ from 'lodash'
import u from 'updeep'

import configureStore from './store/configureStore'
import errorMessage from './reducers/errorMessage'
import modal from './reducers/modal'

class App {

  constructor(config) {

    const initialApp = {

      initialState: {},

      middlewares: [],

      reducers: {
        errorMessage,
        modal
      },

      plugins: [],

      configureStore: configureStore
    }

    const overrides = _.pick(config, ['initialState', 'configureStore', 'plugins'])

    this.app = {...initialApp, ...overrides}

    const { middlewares, reducers } = this.app;

    this.app = {
      ...this.app,
      middlewares: middlewares.concat(config.middlewares),
      reducers: {
        ...reducers,
        ...config.reducers
      }
    }
  }

  module({name, initialState, reducers = {}, sagas}) {

    // reducers = _.mapKeys(reducers, (v, k) => name + '/' + k)

    const moduleReducer = combineReducers(reducers)

    const finalReducer = function(state = initialState, action) {

    }

    this.app = {
      ...this.app,
      sagas: {
        ...this.app.sagas,
        ...sagas
      }
    }
  }

  create() {

    const { app } = this;

    const middlewares = _.compact(app.middlewares)

    const store = app.store = configureStore(app.reducers, app.initialState, middlewares)

    const component = app.plugins.reduce( (pre, p) => {
      return p.create(pre, app)
    }, null)

    return (
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  render(el) {

    const { app } = this;

    const RootComponent = this.create();

    // convert to promises
    const promises = app.plugins.map( plugin => {
      return function() {
        return new Promise((resolve, reject) => {
          plugin.render(app, resolve, reject)
        })
      }
    })

    // execute plugin.render in order
    promises.reduce( (chain, p) => {
      return chain = chain.then(p)
    }, Promise.resolve()).then( () => {
      console.log('final')

      if (el) {
        ReactDOM.render(RootComponent, el);
      } else {
        return RootComponent
      }
    })

  }
}

function createApp(config) {

  return new App(config);
}

export default createApp;

// define action handler (saga in fact...)
export function action(actionType, effect, saga) {

}

// update effect
export function update() {

}
