# ECMAScript Evaluator

A small module for executing ES6 in the browser and running basic assertions. Built as part of [Interactive ES6](https://github.com/jackfranklin/interactive-es6), an online JS workshop environment.

## Usage

```js
import Evaluator from 'ecmascript-evaluator';

Evaluator.run(`
  const x = 1;
  assertEqual(x, 1);
`).then((results) => {
  console.log(results);
  //=> [{ assertion: 'equal', args: [1, 1], passed: true }]
});

Evaluator.run(`
  const promise = Promise.resolve(3);
  assertResolvesTo(promise, 3);
  assertResolvesTo(promise, 4);
`).then((results) => {
  console.log(results);
  //=> [{ assertion: 'resolvesTo', args: ['promise', 3], passed: true },
  //=>  { assertion: 'resolvesTo', args: ['promise', 4], passed: false }]
});
```
