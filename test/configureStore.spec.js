import createSagaMiddleware from 'redux-saga'

/**
 * debugging:
 * http://facebook.github.io/jest/docs/troubleshooting.html#tests-are-failing-and-you-don-t-know-why
 */

['dev', 'prod'].forEach( env => {

  const configureStore = require(`../src/store/configureStore.${env}`).default;

  describe(`configureStore.${env}`, () => {

    it('create store successfully', () => {

      const store = configureStore({}, {})

      expect(store).not.toBeNull();
    })

    it('dispatch action and middleware get called', () => {

      var actionFn;

      const myMiddleware = ({dispatch, getState}) => next => {

        actionFn = jest.fn(action => {
          console.log(`action: ${action}`)
          return next(action);
        })

        return actionFn;
      }

      const store = configureStore({}, {}, [myMiddleware]);

      store.dispatch({type: "?"})

      expect(actionFn).toBeCalled();
    })

    it('dispatch action and middleware takes effect', () => {

      // action type for test
      const MY_ACTION_TYPE = "MY_ACTION_TYPE";
      // espected result for test
      const ACTION_RESULT = "ACTION_RESULT";

      // mock middleware for test
      const myMiddleware = ({dispatch, getState}) => next => action => {

        if (action.type === MY_ACTION_TYPE) {
          return next({type: MY_ACTION_TYPE, result: ACTION_RESULT})
        }

        return next(action);
      }

      const myReducer = jest.fn((state = {}, action) => {

        if (action.type === MY_ACTION_TYPE) {
          // result check
          expect(action.result).toBe(ACTION_RESULT);
        }

        return state;
      })

      const store = configureStore({myReducer}, {}, [myMiddleware]);

      store.dispatch({type: MY_ACTION_TYPE})

      expect(myReducer).toBeCalled();
    })

    it('can configure with redux-saga middleware', () => {
      const sagaMiddleware = createSagaMiddleware()
      const store = configureStore({}, {}, [sagaMiddleware])

      expect(store).not.toBeNull()

      function* helloSaga() {
        console.log('hello sagas!')
      }

      sagaMiddleware.run(helloSaga)
    })
  })

})
