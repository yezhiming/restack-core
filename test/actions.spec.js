import * as actions from '../lib/actions'
import {showModal, SHOW_MODAL} from '../lib/actions'

describe('provided actions', () => {

  it('can access via restack-core/actions', () => {
    expect(actions).not.toBeNull();
    expect(actions.SHOW_MODAL).toBe("SHOW_MODAL")
  })

  it('can access individual action / action creator via import', () => {
    expect(typeof showModal).toBe('function')
    expect(SHOW_MODAL).toBe("SHOW_MODAL")
  })

})
