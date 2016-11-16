import { browserHistory, hashHistory, createMemoryHistory } from '../src/index'

it('exports three historys', () => {
  expect(browserHistory).not.toBeNull();
  expect(hashHistory).not.toBeNull();
  expect(createMemoryHistory).not.toBeNull();
})
