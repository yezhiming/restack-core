import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

// extention point below
import configureStore from '../store/configureStore'
// import createdHistory from '../utils/history'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

export default class Root extends Component {
  render() {
    var { store, history, routes, reducers } = this.props

    // default value
    store = configureStore(reducers)
    history = syncHistoryWithStore(browserHistory, store)

    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object,
  routes: PropTypes.object.isRequired,
  reducers: PropTypes.object
}
