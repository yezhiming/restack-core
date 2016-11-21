import React from 'react';
import { Router, browserHistory, match } from 'react-router';
import { routerReducer, routerMiddleware as createRouterMiddleware , syncHistoryWithStore } from 'react-router-redux'

export default function router({universal = false, routes, history = browserHistory}) {

  // enable navigation via redux actions
  // https://github.com/reactjs/react-router-redux#what-if-i-want-to-issue-navigation-events-via-redux-actions
  // http://stackoverflow.com/questions/32612418/transition-to-another-route-on-successful-async-redux-action/32922381#32922381
  const theMiddleware = createRouterMiddleware(history)

  return {
    name: "router",
    reducers: {
      routing: routerReducer
    },
    middlewares: [theMiddleware],
    // warp create
    create: function(next, pre, app) {

      const syncedHistory = syncHistoryWithStore(history, app.store)

      next(
        <Router history={syncedHistory} children={routes} />
      )
    },
    // warp render
    render: function(next) {

      if (universal) {
        match({ history: history, routes }, (error, redirectLocation, renderProps) => {
          console.log('[router-plugin] match')
          next();
        });
      } else {
        next();
      }
    }

  }
}
