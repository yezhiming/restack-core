import createApp from '../src/app'

describe('replaceSagas', () => {
  it('works', () => {
    const app = createApp({});
    app.model({
      name: "test",
      initialState: {}
    })
    app.create()

    app.replaceSagas([
      {
        name: "test",
        initialState: {}
      }
    ]);
  })
})
