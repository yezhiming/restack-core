// core frameworks
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'

import _ from 'lodash'

import createModel from './model'
import {CANCEL_SAGAS} from './utils/createAbortableSaga'
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
    const { app } = this
    app.models = [...app.models, createModel(model)]
  }

  // 1. collect reducers from plugins & models (created by framework)
  // 2. collect initialState from app config & plugins
  // 3. collect middlewares from plugins
  // 4. create store
  createStore() {
    const { app } = this;

    let reducers = app.reducers;
    // merge plugin reducers into app reducers
    reducers = app.plugins.reduce( (all, plugin) => {
      return {...all, ...plugin.reducers}
    }, reducers)
    // create a default Reducer for each model
    reducers = app.models.reduce( (all, model) => {
      const modelReducer = model.createReducer()
      return {...all, [model.name]: modelReducer}
    }, reducers)

    // merge plugin initialState
    const initialState = app.plugins.reduce( (all, plugin) => {
      return {...all, ...plugin.initialState}
    }, app.initialState)

    const middlewares = app.plugins.reduce( (all, plugin) => {
      return [
        ...all,
        ...plugin.middlewares || []
      ]
    }, app.middlewares)

    return configureStore(reducers, initialState, middlewares)
  }

  createSagas() {
    const { app: { models } } = this;

    return _(models).map(m => m.createSaga()).compact().value()
  }

  //hmr for sagas modules
  replaceSagas(models) {
    const {app} = this;
    app.models = models;
    app.store.dispatch({type:CANCEL_SAGAS})
    setTimeout(()=>{
      const sagas = this.createSagas();
      _.each(sagas, app.sagaMiddleware.run)
    })
	}

  create() {

    const { app } = this;

    const store = window.store = app.store = this.createStore();

    const sagas = this.createSagas();

    // run sagas
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
          {component || (<div></div>)}
        </Provider>
      )
    })

  }

  render(el) {

    const { app } = this;

    return this.create().then( RootComponent => {
      console.log('[restack] root component created')

      const renderChain = app.plugins.reduce( (chain, plugin) => {
        return chain.then( result => {
          return new Promise( (resolve, reject) => {
            plugin.render(resolve)
          })
        })
      }, Promise.resolve())

      return renderChain.then( () => {
        console.log('[restack] render')

        if (el) {
          ReactDOM.render(RootComponent, el);
          //TODO: return something?
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
