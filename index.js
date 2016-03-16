"use strong";
"use strict";

/**
 * Constructs a maybePromise function.
 * @param {class} promiseConstructor A Promise implementation (e.g. `Bluebird` or `Promise`)
 * @param {boolean} [useAnyThenable] If truthy, any Promise implementation is considered a promise; otherwise,
 * only instances of the `promiseConstructor` are considered promises.
 * @returns {Function} A function that takes a function and arguments. Invokes the function with arguments. If
 * the result of the function is a promise, it is returned. Otherwise, the result is converted to a promise.
 * If an error is thrown, a rejected promise is returned.
 */
module.exports = function maybePromiseFactory(promiseConstructor, useAnyThenable) {
	return function maybePromise(f, ...args) {
		let result;
		try {
			result = f.apply(null, args);
		} catch(e) {
			return promiseConstructor.reject(e);
		}

		if(result instanceof promiseConstructor || (useAnyThenable && result && typeof result.then === 'function')) {
			return result;
		} else {
			return promiseConstructor.resolve(result);
		}
	};
}
