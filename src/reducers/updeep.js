import { combineReducers } from 'redux'
import u from 'updeep'

export default function createUpdeep(reducers) {

  const compose = combineReducers(reducers)

  function updateReducer(state, action) {
    if (action.type == '@@update') {
      const { path, updates, name } = action;
      console.log(`update state: ${name}.${path} -> ${updates}`)
      if (path) {
        state = u.updateIn(`${name}.${path}`, updates, state)
      } else {
        state = u.updateIn(`${name}`, updates, state)
      }
      return state;
    } else {
      return compose(state, action)
    }
  }

  return updateReducer;
}
