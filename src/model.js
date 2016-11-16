import { combineReducers } from 'redux'
import u from 'updeep'
import { put } from 'redux-saga/effects'

export const UPDATE = '@@restack/update'

export function createModelReducer(namespace, initialState) {

  return function modelReducer(state = initialState, action) {

    const { path, updates } = action;

    if (action.type == UPDATE && action.namespace == namespace) {
      console.log(`[restack] model update state: ${namespace}.${path} -> ${updates}`)
      if (path) {
        state = u.updateIn(path, updates, state)
      } else {
        state = u(updates, state)
      }
      return state;
    } else {
      return state;
    }
  }
}

export function createUpdateEffect(namespace) {
  return function update(path, updates) {
    if (arguments.length === 1) {
      updates = path
      path = null
    }
    return put({type: UPDATE, namespace, update: true, updates, path})
  }
}
