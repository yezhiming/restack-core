import _ from 'lodash'
import { combineReducers } from 'redux'
import { takeEvery, effects } from 'redux-saga'
import { fork } from 'redux-saga/effects'
import { createUpdateReducer, createUpdateEffect } from './utils/updateReducer'
import createAbortableSaga from './utils/createAbortableSaga'

class Model {

  constructor(config) {
    if (!config.name) throw new Error('must provide a model name.')
    this.config = config
  }

  get name() {
    return this.config.name
  }

  createSaga() {
    const { name, reducers, createSaga, sagas } = this.config;

    if (_.isFunction(createSaga)) return createSaga()

    const sagaGenerators = _(sagas)
    .mapValues((v, k) => {
      // redux-saga effects as second parameter, plus update effect
      const enhancedEffects = {...effects, update: createUpdateEffect(name)}
      const watcher = function* () {
        console.log(`takeEvery: ${name}/${k}`)
        // yield takeEvery(k, v)
        // yield takeEvery(k, (action) => v(action, enhancedEffects))
        yield takeEvery(`${name}/${k}`, (action) => v(action, enhancedEffects))
      }

      return createAbortableSaga(watcher);
    })
    .values()
    .value()

    // return a new generator forks all sagas above
    //
    // yield [
    //   fork(g1),
    //   fork(g2)
    // ]
    function* modelRootSaga() {
      yield sagaGenerators.map(s => fork(s))
    }

    return modelRootSaga
  }

  createReducer() {
    const { name, initialState, reducers, createReducer } = this.config;

    // custom create function
    if (_.isFunction(createReducer)) return createReducer()

    let modelReducer = null;

    if (_.isFunction(reducers))
    {
      modelReducer = reducers
    }
    else if (_.isObject(reducers) && !_.isEmpty(reducers))
    {
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

    if (modelRootReducer(undefined, {}) === undefined) {
      throw new Error(`Reducer of Model:[${name}] returned undefined during initialization. initialState should define in either model.initialState or model.reducers`)
    }

    return modelRootReducer
  }
}

export default function createModel(model) {
  return new Model(model)
}
