import createApp from '../src/app'
import {UPDATE} from '../src/model'

describe('create app', () => {
  it('can define reducers', () => {

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

    const app = createApp({});

    app.model({
      name: "test",
      reducers: {
        tasks: function(state = initialState, action) {
          if (action.type === TAKE_EFFECT_ACTION) {
            return {...state, done: true}
          }
          return state;
        }
      }
    })

    app.create()

    const { store } = window;

    expect(store.getState().test).toEqual({tasks: initialState})

    // no effect
    store.dispatch({type: TAKE_NO_EFFECT_ATION})
    expect(store.getState().test).toEqual({tasks: initialState})

    // take effect
    store.dispatch({type: TAKE_EFFECT_ACTION})
    expect(store.getState().test).toEqual({tasks: {...initialState, done: true}})

    // update effect
    store.dispatch({
      type: UPDATE,
      namespace: 'test',
      path: 'tasks',
      updates: {name: MODIFIED_NAME}
    })
    expect(store.getState().test.tasks.name).toEqual(MODIFIED_NAME)
  })
})
