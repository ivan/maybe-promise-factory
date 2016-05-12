# maybe-promise-factory
The maybePromiseFactory normalizes synchronous values and asynchronous values by always returning a Promise. The
factory uses the ES6 Promise implementation by default but can use other Promise implementations. The maybePromise
function accepts a function argument which is invoked and whose result is used, or any other value, which is coerced
into a promise if it isn't one.

## Installation

Install with `npm install maybe-promise-factory`.

## Usage

```js
const maybePromise = require('maybe-promise-factory')();

// If passed a non-Promise value, coerces it into an immediately-resolved Promise.
maybePromise(42).then(res => console.log(res)); // 42
// If passed a Promise, simply returns the Promise.
maybePromise(new Promise(resolve => resolve(42))).then(res => console.log(res)); // 42

// If passed a function, invokes the function. If the function returns a non-Promise value, coerces the result into an
// immediately-resolved Promise.
maybePromise(syncSum.bind(null, 1, 2)).then(res => console.log(res)); // 3
// If passed a function, invokes the function. Thrown exceptions are caught and the Promise is rejected with the
// exception.
maybePromise(syncSum.bind(null, 1, 'x').catch(err => console.error(err)); // TypeError

function syncSum (a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    throw new TypeError('Invaild arguments passed to syncSum');
  }
}

// If passed a function, invokes the function. If the function returns a Promise, simply returns the Promise.
maybePromise(asyncSum.bind(null, 1, 2)).then(res => console.log(res)); // 3
maybePromise(asyncSum.bind(null, 1, 'x').catch(err => console.error(err)); // TypeError

function asyncSum (a, b) {
  return new Promise((resolve, reject) => {
    if (typeof a === 'number' && typeof b === 'number') {
      resolve(a + b);
    } else {
      reject(new TypeError('Invalid arguments passed to asyncSum'));
    }
  });
}
```

## maybePromiseFactory

The maybePromiseFactory accepts two arguments:

* {class} `promiseConstructor` A Promise implementation (e.g. `Bluebird` or `Promise`)
* {boolean} `[useAnyThenable]` If truthy, any Promise implementation is considered a promise; otherwise, only instances of the `promiseConstructor` are considered promises.

The maybePromiseFactory returns a maybePromise function, which is passed a function (synchronous or asynchronous) and any parameters to invoke it with. It returns an instance of `promiseConstructor`.
