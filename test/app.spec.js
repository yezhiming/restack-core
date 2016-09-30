import { App } from '../lib'
import React from 'react'
import ReactDOM from 'react-dom/server';
import {Route, IndexRoute} from 'react-router'

describe('app', () => {

  it('can create', () => {
    const app = new App()

    expect(app).not.toBeNull();
  })

  it('can render without config', () => {
    const app = new App()
    app.render()
  })

  it('can render on server', async () => {
    const app = new App()
    let Component = await app.render()
    console.log('render: ' + ReactDOM.renderToString(Component))
  })

  it('can render on server with router', async () => {

    const BlankComponent = () => {
      return (
        <span>blank</span>
      )
    }

    const app = new App()
    app.routes = (
      <Route path="/" component={BlankComponent}>
      </Route>
    )
    let Component = await app.render()
    console.log('render2: ' + ReactDOM.renderToString(Component))
  })
})
