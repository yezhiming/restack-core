import createApp from '../src/app'

import i18n from '../src/plugins/i18n-plugin'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import { take, put, call, fork, select, race } from 'redux-saga/effects'

describe('create app', () => {

  it('can be created', () => {

    const app = createApp({});

    expect(app).not.toBeNull();
  })

  it('can render on server', () => {
    const app = createApp({});

    return app.render().then(result => {
      expect(result).not.toBeNull()
    });
  })

  it('can define models', () => {
    const app = createApp({});

    app.model({
      name: 'userList',
      initialState: {
        isFetching: false
      },
      reducers: {
        xxx: function(state, action) {
          return state;
        }
      },
      sagas: {

        *list() {

          yield put({type: 'userList/xxx'})

          yield update({isFetching: true})

          const { response, error} = yield call(fetch, `http://www.baidu.com`)

          if (response) {

            yield update({isFetching: false, items: response})
          } else {

            yield update({isFetching: true, error})
          }
        }
      }
    })

  })


})
