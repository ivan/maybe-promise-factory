# maybe-promise-factory
The maybePromiseFactory normalizes synchronous values and asynchronous values by always returning a Promise.

* The factory uses the ES6 Promise implementation by default but can use other Promise implementations.
* The returned maybePromise function accepts an argument and converts it to a promise if it is another type of value.
* If it is passed a function, it invokes it and applies the same rules to the result of the function to promisify it.
* If the invoked function throws an exception, it is caught and a rejected Promise is returned.

## Installation

Install with `npm install maybe-promise-factory`.

## Usage Examples

```js
const maybePromise = require('maybe-promise-factory')();

// If passed a non-Promise value, coerces it into an immediately-resolved Promise.
maybePromise(42).then(res => console.log(res)); // 42
// If passed a Promise, simply returns the Promise.
maybePromise(new Promise(resolve => resolve(42))).then(res => console.log(res)); // 42

// If passed a function, invokes the function. If the function returns a non-Promise value,
// coerces the result into an immediately-resolved Promise.
maybePromise(syncSum.bind(null, 1, 2)).then(res => console.log(res)); // 3
// If passed a function, invokes the function. Thrown exceptions are caught and the Promise
// is rejected with the exception.
maybePromise(syncSum.bind(null, 1, 'x').catch(err => console.error(err)); // TypeError

function syncSum (a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    throw new TypeError('Invaild arguments passed to syncSum');
  }
}

// If passed a function, invokes the function. If the function returns a Promise, simply
// returns the Promise.
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

// Using other Promise implementations
const Bluebird = require('bluebird');
const maybePromise = require('maybe-promise-factory')(Bluebird);
```

## Testing

Tests are written with Mocha and Should. They can be run with `npm test`.
