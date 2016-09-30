import createSagaMiddleware from 'redux-saga'

import configureStore from '../src/store/configureStore'

describe('test saga', () => {

  it('can apply saga', () => {

    const sagaMiddleware = createSagaMiddleware()
    const store = configureStore({}, {}, [sagaMiddleware])

    expect(store).not.toBeNull()

    function* helloSaga() {
      console.log('hello sagas!')
    }

    sagaMiddleware.run(helloSaga)
  })

})
