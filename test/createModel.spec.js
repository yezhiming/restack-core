import createModel from '../src/model'

describe('create model', () => {

  it('can create model', () => {
    const model = createModel({name: 'test1'})
    expect(model).not.toBeNull();
  })

  it('can define createReducer', () => {
    const model = createModel({name: 'test2', initialState: {}})
    const reducer = model.createReducer()
    expect(reducer instanceof Function).toBeTruthy()
  })

  it('can define reducers as map', () => {
    const model = createModel({
      name: 'test1',
      reducers: {
        m1: (state, action) => {
          return {a: 'a'}
        },
        m2: (state, action) => {
          return {b: 'b'}
        }
      }
    })

    const reducer = model.createReducer()
    expect(reducer instanceof Function).toBeTruthy()

    const result = reducer(undefined, {type: 'any-action'})
    expect(result).toEqual({
      m1: {a: 'a'},
      m2: {b: 'b'}
    })
  })

  it('can define createReducer', () => {
    const model = createModel({
      name: 'test4',
      reducer: (state, action) => {
        return {test: true}
      }
    })

    const reducer = model.createReducer()
    expect(reducer instanceof Function).toBeTruthy()

    const result = reducer({})
    expect(result).toEqual({test: true})
  })
})
