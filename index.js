"use strong";
"use strict";

module.exports.makeMaybePromise = function(promiseConstructor) {
	return function maybePromise(f, ...args) {
		let result;
		try {
			result = f.apply(null, args);
		} catch(e) {
			return promiseConstructor.reject(e);
		}

		if(result instanceof promiseConstructor) {
			return result;
		} else if(result instanceof Error) {
			return promiseConstructor.reject(result);
		} else {
			return promiseConstructor.resolve(result);
		}
	};
}
