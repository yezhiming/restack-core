import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {api} from '../middlewares/api/index'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'


export default function configureStore(rootReducer, initialState) {

  rootReducer = combineReducers({
    ...rootReducer,
    routing
  })

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk,api)
  )
}
