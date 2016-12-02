import createApp from '../src/app'

describe('create app', () => {
  it('can define reducers', () => {

    const initialState = {done: false, name: 'mytask'}
    const TAKE_EFFECT_ACTION = 'TAKE_EFFECT_ACTION'
    const TAKE_NO_EFFECT_ATION = 'TAKE_NO_EFFECT_ATION'

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
  })
})
