import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
// middlewares
import createLogger from 'redux-logger'
import DevTools from '../containers/DevTools'

export default function configureStore(rootReducer, initialState, middlewares = []) {

  rootReducer = combineReducers(rootReducer)

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(createLogger(), ...middlewares),
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
