import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware';
import { routerReducer as routing } from 'react-router-redux'


export default function configureStore(rootReducer, initialState) {

  rootReducer = combineReducers({
    ...rootReducer,
    routing
  })

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, apiMiddleware)
  )
}
