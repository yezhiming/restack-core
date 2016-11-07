import React from 'react';
import { Router, browserHistory, match } from 'react-router';
import { routerReducer, routerMiddleware as createRouterMiddleware , syncHistoryWithStore } from 'react-router-redux'

export default function router({universal = false, routes}) {

  return {
    reducers: {
      routing: routerReducer
    },
    middlewares: [createRouterMiddleware(browserHistory)],
    // warp create
    create: function(pre, app) {

      const history = syncHistoryWithStore(browserHistory, app.store)

      return <Router history={history} children={routes} />
    },
    // warp render
    render: function(app, next) {

      if (universal) {
        match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
          console.log('match')
          next();
        });
      } else {
        next();
      }
    }

  }
}
