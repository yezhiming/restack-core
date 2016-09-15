import { createStore, applyMiddleware, combineReducers } from 'redux'
// middlewares
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware';
// reducers
import { routerReducer as routing, routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

export default function configureStore(rootReducer, initialState) {

  rootReducer = combineReducers({
    ...rootReducer,
    routing
  })

  const rMiddleware = routerMiddleware(browserHistory)

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, apiMiddleware, rMiddleware)
  )
}
