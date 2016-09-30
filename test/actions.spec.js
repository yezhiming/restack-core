import * as actions from '../lib/actions'
import {showModal, SHOW_MODAL} from '../lib/actions'

describe('provided actions', () => {

  it('can access via restack/actions', () => {
    console.log(actions)
    expect(actions).not.toBeNull();
  })

  it('can access individual action / action creator via import', () => {
    expect(showModal).toBeDefined()
    expect(typeof showModal).toBe('function')
    expect(SHOW_MODAL).toBe("SHOW_MODAL")
  })
})
