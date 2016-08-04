import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import DevTools from '../containers/DevTools'
import {api} from '../middlewares/api/index'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

export default function configureStore(rootReducer, initialState) {
  rootReducer = combineReducers({
    ...rootReducer,
    routing
  })

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, createLogger(),api),
      DevTools.instrument()
    )
  )

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers', () => {
  //     const nextRootReducer = require('../reducers').default
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }

  return store
}
