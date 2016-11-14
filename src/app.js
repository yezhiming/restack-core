// core frameworks
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux'
import { Provider } from 'react-redux';
import createSagaMiddleware, { effects, takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import _ from 'lodash'
import u from 'updeep'

import co from 'co'

import configureStore from './store/configureStore'
import errorMessage from './reducers/errorMessage'
import modal from './reducers/modal'

class App {

  constructor(config) {

    const sagaMiddleware = createSagaMiddleware()

    const initialApp = {

      initialState: {},

      middlewares: [sagaMiddleware],

      reducers: {
        errorMessage,
        modal
      },

      plugins: [],

      configureStore: configureStore,

      models: []
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

    this.app.sagaMiddleware = sagaMiddleware;
  }

  model(model) {
    const { app } = this;
    app.models = [...app.models, model];
  }

  create() {

    const { app } = this;

    // merge plugin reducers into app reducers
    const reducers = app.plugins.reduce( (all, plugin) => {
      return {...all, ...plugin.reducers}
    }, app.reducers)

    const initialState = app.plugins.reduce( (all, plugin) => {
      return {...all, ...plugin.initialState}
    }, app.initialState)

    const middlewares = app.plugins.reduce( (all, plugin) => {
      return [
        ...all,
        ...plugin.middlewares || []
      ]
    }, app.middlewares)

    const store = window.store = app.store = configureStore(reducers, initialState, middlewares)



    const sagas = _(app.models)
    .filter(m => m.sagas)
    .reduce( (all, m) => {

      const sagas = _(m.sagas)
      .mapKeys((v, k) => `${m.name}/${k}`)
      .mapValues((v, k) => {
        // update effect creator
        function updateFor(name) {
          return function update(path, updates) {
            if (arguments.length === 1) {
              updates = path
              path = null
            }
            return put({type: "@@update", name, update: true, updates, path})
          }
        }
        // redux-saga effects as second parameter, plus update effect
        const enhancedEffects = {...effects, update: updateFor(m.name)}
        return function* () {
          console.log(`takeEvery: ${k}`)
          // yield takeEvery(k, v)
          yield takeEvery(k, (action) => v(action, enhancedEffects))
        }
      })
      .value()

      return {...all, ...sagas}
    }, {})

    _.each(sagas, app.sagaMiddleware.run)

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
          // return something?
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
