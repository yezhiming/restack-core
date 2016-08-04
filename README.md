## restack-core

tools make react application development easier.

### redux integration


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
