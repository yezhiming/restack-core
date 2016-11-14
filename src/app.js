// core frameworks
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux'
import { Provider } from 'react-redux';

import _ from 'lodash'
import u from 'updeep'

import co from 'co'

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
      middlewares: _.compact(middlewares.concat(config.middlewares)),
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

    // merge plugin reducers into app reducers
    const reducers = app.plugins.reduce( (all, plugin) => {
      return {
        ...all,
        ...plugin.reducers
      }
    }, app.reducers)

    const initialState = app.plugins.reduce( (all, plugin) => {
      return {
        ...all,
        ...plugin.initialState
      }
    }, app.initialState)

    const middlewares = app.plugins.reduce( (all, plugin) => {
      return [
        ...all,
        ...plugin.middlewares || []
      ]
    }, app.middlewares)

    const store = app.store = configureStore(reducers, initialState, middlewares)

    // create chain
    // Promise.resolve() -> plugin1.create -> plugin2.create, ... -> return Root
    return app.plugins.reduce( (chain, plugin) => {
      return chain.then( component => {
        return new Promise((resolve, reject) => {
          plugin.create(resolve, component, app)
        })
      })
    }, Promise.resolve())
    .then( component => {
      return (
        <Provider store={store}>
          {component}
        </Provider>
      )
    })

  }

  render(el) {

    const { app } = this;

    this.create().then( RootComponent => {
      console.log('got root component')

      const renderChain = app.plugins.reduce( (chain, plugin) => {
        return chain.then( result => {
          return new Promise( (resolve, reject) => {
            plugin.render(resolve)
          })
        })
      }, Promise.resolve())

      renderChain.then( () => {
        console.log('final')

        if (el) {
          ReactDOM.render(RootComponent, el);
        } else {
          return RootComponent
        }
      })

    })

  }
}

function createApp(config) {
  return new App(config);
}

export default createApp;
