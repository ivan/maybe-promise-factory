'use strict';

/**
 * Constructs a maybePromise function.
 * @param {class} [PromiseImpl] A Promise implementation (e.g. `Bluebird` or `Promise`). If omitted, uses the built-in
 * ES6 Promise class.
 * @returns {Function} A maybePromise function. If passed a non-function, promisifies and returns the value. If passed a
 * function, promisifying the result of the function and returning it.
 */
module.exports = function maybePromiseFactory (PromiseImpl) {
	if (!PromiseImpl) { PromiseImpl = Promise; }
	return function maybePromise (value) {
		var result;
		if (typeof value !== 'function') {
			result = value;
		} else {
			try {
				result = value();
			} catch (ex) {
				return PromiseImpl.reject(ex);
			}
		}

		if (result && typeof result.then === 'function') {
			return result;
		} else {
			return PromiseImpl.resolve(result);
		}
	};
};
