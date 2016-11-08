import u from 'updeep'

function rootReducer(state, action) {
  if (action == 'xxx') {
    const {path, updates} = action;
    return u(path, updates, state)
  }
}
