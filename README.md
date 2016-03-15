# maybe-promise-factory
Calls a function and wraps the retval or exception in a Promise only if it didn't already return a Promise; like Twisted's maybeDeferred.  Turns a sync-or-Promise API into a Promise API.

## Installation

Install with `npm install maybe-promise-factory`.

## Usage

```js
const maybePromise = require('maybe-promise-factory')(Promise);

function syncSum (a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Invaild arguments passed to syncSum');
  }
  return a + b;
}

function asyncSum (a, b) {
  return new Promise((resolve, reject) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      reject(new TypeError('Invalid arguments passed to asyncSum'));
      return;
    }
    resolve(a + b);
  });
}

maybePromise(syncSum, 1, 2).then(res => console.log(res)); // 3
maybePromise(syncSum, 1, 'x').catch(err => console.error(err)); // TypeError

maybePromise(asyncSum, 1, 2).then(res => console.log(res)); // 3
maybePromise(asyncSum, 1, 'x').catch(err => console.error(err)); // TypeError
```

## maybePromiseFactory

The maybePromiseFactory accepts two arguments:

* @param {class} `promiseConstructor` A Promise implementation (e.g. `Bluebird` or `Promise`)
* @param {boolean} `[useAnyThenable]` If truthy, any Promise implementation is considered a promise; otherwise, only instances of the `promiseConstructor` are considered promises.

The maybePromiseFactory returns a maybePromise function, which is passed a function (synchronous or asynchronous) and any parameters to invoke it with. It returns an instance of `promiseConstructor`.
