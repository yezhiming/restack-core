## restack-core

tools make react application development easier.

### modal

[accroding to the post](http://stackoverflow.com/questions/35623656/how-can-i-display-a-modal-dialog-in-redux-that-performs-asynchronous-actions/35641680)

### i18n

sample bootstrap script `app.jsx` with i18n

```js
import React from 'react'
import { render } from 'react-dom'
import { App, i18n } from 'restack-core'

i18n.fetchLocaleData({defaultLocale: config.defaultLocale})
.then(({locale, localeData}) => {
  render(
    <App
      routes={routes}
      reducers={......}
      locale={locale}
      localeData={localeData}
      />,

    document.getElementById('react-view')
  );
})
.catch(error => {
  console.error(error);
});
```

sample bootstrap script `app.jsx` without i18n

```js
import React from 'react'
import { render } from 'react-dom'
import { App } from 'restack-core'

render(
  <App
    routes={routes}
    reducers={......}
    locale={locale}
    localeData={localeData}
    />,

  document.getElementById('react-view')
);
```

### npm dependencies description

dependency|type|desc|
----------|----|----|
babel-runtime|babel|
jed|lib|jed i18n
lodash|lib|underscore like
moment|lib|time
react|lib|

dependency|type|desc|
----------|----|----|
babel-plugin-transform-async-to-generator|babel-plugin|Stage 3
babel-plugin-transform-class-properties|babel-plugin|Stage 1
babel-plugin-transform-export-extensions|babel-plugin|Stage 1
babel-plugin-transform-object-rest-spread|babel-plugin|Stage 2
babel-plugin-transform-runtime|babel-plugin|babel helpers in one place
babel-preset-es2015|babel-plugin|
babel-preset-react|babel-plugin|
babel-preset-react-hmre|babel-plugin|



### babel plugins

we enabled these es features by babel

#### Async to generator transform

```js
async function foo() {
  await bar();
}
```

#### Class properties transform

```js
class MyClass {
  myProp = 42;
  static myStaticProp = 21;

  constructor() {
    console.log(this.myProp); // Prints '42'
    console.log(MyClass.myStaticProp); // Prints '21'
  }
}
```

#### Export extensions transform

```js
export * as ns from 'mod';
export v from 'mod';
```

#### Object rest spread transform

```js
// Rest properties
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }

// Spread properties
let n = { x, y, ...z };
console.log(n); // { x: 1, y: 2, a: 3, b: 4 }
```
