import createApp from '../src/app'

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
      }
    })

  })

})
