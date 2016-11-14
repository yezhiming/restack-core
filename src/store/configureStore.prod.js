import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// reducers
import { routerReducer, routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

export default function configureStore(rootReducer, initialState, middlewares = []) {

  rootReducer = combineReducers(rootReducer)

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )
}
