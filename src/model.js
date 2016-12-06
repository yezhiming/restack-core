import _ from 'lodash'
import { combineReducers } from 'redux'
import { createUpdateReducer, createUpdateEffect } from './utils/updateReducer'

class Model {

  constructor(config) {
    if (!config.name) throw new Error('must provide a model name.')
    this.config = config
  }

  createSaga() {
    const { name, reducers, createSaga, sagas } = this.config;

    if (_.isFunction(createSaga)) return createSaga()

    _(sagas)
    .mapKeys((v, k) => `${name}/${k}`)
    .mapValues((v, k) => {
      // redux-saga effects as second parameter, plus update effect
      const enhancedEffects = {...effects, update: createUpdateEffect(name)}
      const watcher = function* () {
        console.log(`takeEvery: ${k}`)
        // yield takeEvery(k, v)
        // yield takeEvery(k, (action) => v(action, enhancedEffects))
        yield takeEvery(k, (action) => v(action, enhancedEffects))
      }

      return createAbortableSaga(watcher);
    })
    .value()
  }

  createReducer() {
    const { name, initialState, reducers, createReducer } = this.config;

    // custom create function
    if (_.isFunction(createReducer)) return createReducer()

    let modelReducer = null;

    // combine if nessasary
    if (_.isObject(reducers) && !_.isEmpty(reducers)) {
      modelReducer = combineReducers(reducers)
    }

    // update reducer
    const updateReducer = createUpdateReducer(name, initialState)

    const modelRootReducer = function(state = initialState, action) {
      if (_.isFunction(modelReducer)) {
        state = modelReducer(state, action)
      }
      return updateReducer(state, action)
    }

    return modelRootReducer
  }
}

export default function createModel(model) {
  return new Model(model)
}
