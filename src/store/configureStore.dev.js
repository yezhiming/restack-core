import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// middlewares
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { apiMiddleware } from 'redux-api-middleware';
import DevTools from '../containers/DevTools'
// reducers
import { routerReducer as routing } from 'react-router-redux'

export default function configureStore(rootReducer, initialState) {

  rootReducer = combineReducers({
    ...rootReducer,
    routing
  })

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, createLogger(), apiMiddleware),
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
