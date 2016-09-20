import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// middlewares
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware';
// reducers
import { routerReducer, routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'

export default function configureStore(rootReducer, initialState) {

  rootReducer = combineReducers({
    ...rootReducer,
    routing: routerReducer
  })

  const routerMiddleware = createRouterMiddleware(browserHistory)

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, apiMiddleware, routerMiddleware)
  )
}
