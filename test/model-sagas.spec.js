import {takeEvery} from 'redux-saga'
import {fork} from 'redux-saga/effects'

import createApp from '../src/app'
import {UPDATE} from '../src/utils/updateReducer'

// 产生效果的action
const TAKE_EFFECT_ACTION = 'TAKE_EFFECT_ACTION'
// 不产生效果的action
const TAKE_NO_EFFECT_ATION = 'TAKE_NO_EFFECT_ATION'
// 初始任务名字
const INITIAL_NAME = "INITIAL_NAME"
// 修改后的任务名字
const MODIFIED_NAME = "MODIFIED_NAME"
// 初始任务状态
const initialState = {done: false, name: INITIAL_NAME}

describe('create app', () => {

  it('can define no reducers', () => {
    const app = createApp({});
    app.model({
      name: "test",
      initialState: {}
    })
    app.create()
    const { store } = window;
    expect(store).not.toBeNull()
  })

  it('can define reducers as map', () => {

    const app = createApp({});

    app.model({
      name: "test",
      reducers: {
        task: function(state = initialState, action) {
          if (action.type === TAKE_EFFECT_ACTION) {
            return {...state, done: true}
          }
          return state;
        }
      }
    })

    app.create()

    const { store } = window;

    expect(store.getState().test).toEqual({task: initialState})

    // no effect
    store.dispatch({type: TAKE_NO_EFFECT_ATION})
    expect(store.getState().test).toEqual({task: initialState})

    // take effect
    store.dispatch({type: TAKE_EFFECT_ACTION})
    expect(store.getState().test).toEqual({task: {...initialState, done: true}})

    // update effect
    store.dispatch({
      type: UPDATE,
      namespace: 'test',
      path: 'task',
      updates: {name: MODIFIED_NAME}
    })
    expect(store.getState().test.task.name).toEqual(MODIFIED_NAME)
  })

  it('can define reducers as function', () => {

    const app = createApp({});

    app.model({
      name: "test",
      initialState,
      reducers: function(state = initialState, action) {
        if (action.type === TAKE_EFFECT_ACTION) {
          return {...state, done: true}
        }
        return state;
      }
    })

    app.create()

    const { store } = window;

    expect(store.getState().test).toEqual(initialState)
  })

  it('can define sagas', () => {
    const fnToBeCalled = jest.fn();

    const app = createApp({});
    app.model({
      name: 'test',
      initialState: {},
      sagas: {
        *myAction() {
          fnToBeCalled()
        }
      }
    })

    app.create()

    const { store } = window;

    store.dispatch({type: "test/myAction"})

    expect(fnToBeCalled).toBeCalled()
  })

  it('can define createSaga', () => {

    const fnToBeCalled = jest.fn();

    const app = createApp({});
    app.model({
      name: 'test',
      initialState: {},
      createSaga: ({update}) => {

        expect(update instanceof Function).toBeTruthy()

        function* executeGenerator() {
          fnToBeCalled()
        }

        function* g1() {
          yield takeEvery(TAKE_EFFECT_ACTION, executeGenerator)
        }

        function* g2() {

        }

        function* customSaga() {
          yield [
            fork(g1),
            fork(g2)
          ]
        }

        return customSaga
      }
    })

    app.create()

    const { store } = window;

    store.dispatch({type: TAKE_EFFECT_ACTION})

    expect(fnToBeCalled).toBeCalled()
  })
})
