## npm dependencies

dependency|type|desc|
----------|----|----|
babel-plugin-transform-class-properties|babel-plugin|
babel-plugin-transform-object-rest-spread|babel-plugin|
babel-runtime|babel|
jed|lib|jed i18n
lodash|lib|underscore like
moment|lib|time
react|lib|

dependency|type|desc|
----------|----|----|
babel-plugin-transform-runtime|babel-plugin|babel helpers in one place



## babel plugins

### Class properties transform

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

### Object rest spread transform

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

### Regenerator transform

```js
function* a() {
  yield 1;
}
```

### syntax-async-functions

```js
(async function() {
  await loadStory();
  console.log("Yey, story successfully loaded!");
}());
```
